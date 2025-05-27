/*********************************************************************
 BLE通信の全体シーケンス：
 1. [広告]      僕は心拍数を通知できます！（UUID: 0x180D）
 2. [接続]      スマホ「よし、つないでみるか」
 3. [探索]      スマホ「どんなデータあるの？ → 心拍あるね」
 4. [通知許可]  スマホ「通知してもいいよ（CCCDをON）」
 5. [通知]      デバイス「はい、今の心拍は 65 BPM です！（毎秒）」
*********************************************************************/

#include <bluefruit.h>

/* [サービスUUID定義]
 * 心拍サービス（0x180D）と、その中の特性（Char）
 */
BLEService        hrms = BLEService(UUID16_SVC_HEART_RATE);
BLECharacteristic hrmc = BLECharacteristic(UUID16_CHR_HEART_RATE_MEASUREMENT);
BLECharacteristic bslc = BLECharacteristic(UUID16_CHR_BODY_SENSOR_LOCATION);

// Bluefruitライブラリ（Adafruit） 独自のクラスで、標準のBluetoothサービスのショートカットクラス
BLEDis bledis; // 製造元やモデル番号などのデバイス情報を提供
BLEBas blebas; // バッテリーレベル（%）を送信する標準サービス

uint8_t  bps = 0;

void setup()
{
  Serial.begin(115200);
  while ( !Serial ) delay(10);   // USBが使えるまで待つ

  Serial.println("Bluefruit52 HRM Example");

  // --------------------------------------------------
  // [1] 広告フェーズの準備：BLE初期化
  // --------------------------------------------------
  Bluefruit.begin();
  Bluefruit.setName("FeatherTest"); // これは内部的にGAPに名前を登録するだけ. 自分の内部的な名前を FeatherTest にしただけで、それをスマホに送る（＝広告パケットに含める）処理はまだしていない.  Bluefruit.Advertising.addName();ここで行っている。

  // 接続/切断時のコールバックを設定（[2] 接続、切断の監視）
  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

  // デバイス情報サービスの構築
  // 2つ共、任意の文字列でOK. BLEには「Device Information Service（DIS）」という標準サービス（UUID: 0x180A）があり、
  // Manufacturer や Model などの情報を文字列として提供できます. これらは主にスマホのアプリ（例：nRF Connectなど）が
  // 接続時に表示する情報です。ユーザーや製造者の識別に役立つものですが、動作上必須ではありません。
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  bledis.begin();

  // バッテリーサービス構築（100%に設定）
  blebas.begin(); // バッテリーの状態を知らせるサービス（UUID: 0x180F）。blebas.begin() でバッテリーサービスを有効にする.
  blebas.write(100); // 「今バッテリーは100%ですよ」と通知用の値をセット。今回は仮に100%。

  // --------------------------------------------------
  // [3] 探索で見つかるように：心拍サービスと特性を構築
  // --------------------------------------------------
  setupHRM();

  // --------------------------------------------------
  // [1] 広告：スマホが発見できるようにアドバタイズ開始
  // --------------------------------------------------
  startAdv();

  Serial.println("Advertising");
}

void startAdv(void)
{
  // アドバタイジングパケットの構成
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE); // LE_ONLY: クラシックBluetoothはサポートしてない（BLE専用） GENERAL_DISC_MODE: どんなスマホにも見つけてもらえる「一般公開モード」。つまり「これはBLE専用の、誰でも見つけられるデバイスですよ」という宣言。
  Bluefruit.Advertising.addTxPower(); // 送信電力（Tx Power）の情報を広告パケットに含めている。受信側（スマホなど）は「信号がどれぐらい減衰したか」を使って距離を推定できる（例：RSSIで近い/遠いを推定）。ただしこれはあくまで参考値であり、必須ではありません。屋内位置測位や距離推定の用途があるときに有効です。

  // [1] 広告に「心拍サービスがあります（UUID: 0x180D）」を含める
  // これは勝手に決める数字ではなく、0x180D は Bluetooth SIG（標準化団体）によって定義された公式のUUID
  // Bluetoothの標準（GATT規格）では、よく使われるサービスや特性にはショートUUID（16ビット） が割り当てられている
  Bluefruit.Advertising.addService(hrms);

  // デバイス名も追加（任意）
  Bluefruit.Advertising.addName(); //

  // 広告設定：接続後も再開など
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);
  Bluefruit.Advertising.setFastTimeout(30);
  Bluefruit.Advertising.start(0);  // 0 = 永続広告
}

void setupHRM(void)
{
  // [3] 探索：スマホが接続したあとに「何があるか調べる」ための定義

  // 心拍サービスを開始（UUID: 0x180D）
  hrms.begin();

  // 特性1: 心拍数通知（0x2A37）
  hrmc.setProperties(CHR_PROPS_NOTIFY); // [5] 通知（Notify）対応. この特性は通知（Notify）専用（ReadやWriteはできない）という意味
  hrmc.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);  // 読み取り（Read）は誰でもOK、書き込み（Write）は不可
  hrmc.setFixedLen(2); // この特性のデータは常に2バイト固定長（＝フラグ1バイト + 心拍1バイト）. 通知の送信用データ形式（例：{ 0x06, 0x40 }）に合っている.
  hrmc.setCccdWriteCallback(cccd_callback); // [4] 通知許可の検出（CCCD書き込み） 

  // 心拍サービスの中にある「心拍数通知」特性（UUID 0x2A37）を開始. サービスの中には複数の特性が含まれることがあるため、それぞれ個別に .begin() する必要がある。
  hrmc.begin();

  // 通知するデフォルト値を設定
  uint8_t hrmdata[2] = { 0b00000110, 0x40 };  // フラグ + 心拍数（64BPM）. 「BLE通知で送る心拍データ（2バイト）」を定義している行。uint8_t は「0〜255の整数を入れる箱（＝1バイト）」のこと. hrmdata[2] は「2バイトの配列」 → hrmdata[0] と hrmdata[1] が存在. 値の意味：0b00000110 → 先頭バイト。ビット単位のフラグ（意味はBLE仕様書で定義されてる). たとえば「心拍は1バイトの整数である」などを意味する.0x64 → 2バイト目。実際の心拍数（＝10進数で100). 0b は「2進数（binary）で書く」C++の記法（Arduinoでもサポートされてる）例：0b00000110 = 2進数 = 10進数で 6 = 16進数で 0x06. **1バイト目（＝0x06）はBLEの心拍特性（Heart Rate Measurement）に関する”Flagバイト”**であり、各ビットに意味があります。
  hrmc.write(hrmdata, 2);

  // 特性2: センサーの装着位置（0x2A38）
  bslc.setProperties(CHR_PROPS_READ);  // 読み取り専用. “Read” は「スマホ側から読み取る」、“Notify” は「Featherから勝手に送る」. このコードでは：hrmc → 通知（心拍数）bslc → 読み取り（センサー装着位置）
  bslc.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  bslc.setFixedLen(1);
  bslc.begin();
  bslc.write8(2);  // 装着位置 = 手首（2）
}

void connect_callback(uint16_t conn_handle)
{
  // [2] 接続：誰と繋がったかを確認
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char central_name[32] = { 0 }; //32文字分の文字列を入れる入れ物を用意して、中身を全部ゼロで初期化」してます。char は「1文字」を表す型（1バイト）. char[32] は「最大31文字＋終端用1文字」のC言語的な文字列バッファ. { 0 } で全要素を 0 で初期化（C文字列では0＝終端記号). つまり、「あとで名前を入れるための空っぽの文字列」です。

  connection->getPeerName(central_name, sizeof(central_name)); //	connection は BLEConnection* 型（ポインタ）. -> は「ポインタからそのメソッド（関数）やメンバーにアクセスする演算子」. getPeerName(...) は BLEConnectionクラスのメソッド（関数）. つまりこれは：「connection オブジェクトが持つ getPeerName 関数を呼び、スマホ名を central_name に書き込む」

  Serial.print("Connected to ");
  Serial.println(central_name);
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  // 切断イベント（自動で再アドバタイズ）
  Serial.print("Disconnected, reason = 0x"); //disconnect_callback(...) が呼ばれるのは「BLE接続が切れた」という重要なイベント。その中の Serial.print(...) は、ただの人間向けログ出力（デバッグやトラブルシュート用）。
  Serial.println(reason, HEX);
  Serial.println("Advertising!");
}

// [4] 通知許可：スマホ側が Notify を有効にしたら呼ばれる
void cccd_callback(uint16_t conn_hdl, BLECharacteristic* chr, uint16_t cccd_value)
{
  Serial.print("CCCD Updated: ");
  Serial.println(cccd_value);

  if (chr->uuid == hrmc.uuid) {
    if (chr->notifyEnabled(conn_hdl)) {
      Serial.println("Heart Rate Measurement 'Notify' enabled");
    } else {
      Serial.println("Heart Rate Measurement 'Notify' disabled");
    }
  }
}

void loop()
{
  digitalToggle(LED_RED); // デバッグ用にLEDを点滅

  // [5] 通知：接続されていれば心拍数を送信
  if ( Bluefruit.connected() ) {
    uint8_t hrmdata[2] = { 0b00000110, bps++ }; // フラグ + BPM値（毎秒インクリメント）

    // .notify() = 接続 & CCCD許可されていれば通知送信
    if ( hrmc.notify(hrmdata, sizeof(hrmdata)) ){
      Serial.print("Heart Rate Measurement updated to: ");
      Serial.println(bps);
    } else {
      Serial.println("ERROR: Notify not set in the CCCD or not connected!");
    }
  }

  delay(1000);  // 毎秒1回送信
}