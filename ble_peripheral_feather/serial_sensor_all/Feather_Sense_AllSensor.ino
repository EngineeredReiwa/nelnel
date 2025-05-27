// ============================================================================
// FeatherSense_BLE_Sensor_Demo.ino  (altitude 削除版) — FINAL FULL CODE
// -----------------------------------------------------------------------------
// Adafruit Feather nRF52840 Sense の各種センサーから取得したデータを、
// uint16_t へスケーリングして 36 バイト（18 ワード）に圧縮し、BLE Notify で送信。
// 位置推定に不要な altitude は MCU では計算せずゲートウェイ側で算出する。
//
// ────────────────────────────────────────────────────────────────────────────
//  ✨ 構成概要
//   1. 各センサ初期化 → 値取得
//   2. Bluefruit で独自サービス / キャラクタリスティック定義
//   3. センサ値を uint16_t にパッキング（倍率 + オフセット）
//   4. 300 ms ごとに Notify 送信（36 バイト固定）
// ============================================================================

// -------------------- 必要ライブラリ --------------------
#include <bluefruit.h>
#include <Adafruit_APDS9960.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_LIS3MDL.h>
#include <Adafruit_LSM6DS33.h>
#include <Adafruit_LSM6DS3TRC.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_Sensor.h>
#include <PDM.h>

// -------------------- センサオブジェクト --------------------
Adafruit_APDS9960   apds9960;   // 近接・色センサ
Adafruit_BMP280     bmp280;     // 温度・気圧センサ
Adafruit_LIS3MDL    lis3mdl;    // 地磁気センサ
Adafruit_LSM6DS3TRC lsm6ds3trc; // 新REV 用 6軸 IMU
Adafruit_LSM6DS33   lsm6ds33;   // 旧REV 用 6軸 IMU
Adafruit_SHT31      sht30;      // 湿度センサ

// ------------ オーディオ設定 ---------------
constexpr uint16_t SAMPLE_RATE   = 16000;          // 16 kHz
constexpr uint32_t CLIP_SAMPLES  = SAMPLE_RATE * 1; // 1秒間分の音声データから,何サンプル取るか
constexpr uint16_t THRESHOLD_P2P = 2500;           // 適宜調整
constexpr uint16_t ADPCM_BYTES   = 4096;           // 4 kB (16 kB / 4)
constexpr uint16_t FRAG_PAYLOAD  = 240;            // 244‑Header4

// ------------ センサ変数 ---------------
bool     new_rev = true;
uint8_t  proximity;
uint16_t r,g,b,c;
float    temperature, pressure;
float    magnetic_x,magnetic_y,magnetic_z;
float    accel_x,accel_y,accel_z;
float    gyro_x, gyro_y, gyro_z;
float    humidity;

// ------------ PDM バッファ ---------------
int16_t  ringBuffer[CLIP_SAMPLES]; // 生音声をリアルタイムに溜めるバッファ
volatile uint32_t writeIdx = 0; // 現在マイクからのデータを書き込んでいる位置（最新）
short    sampleBuffer[256]; 
volatile int samplesRead = 0;

// -------------------- BLE 定義 --------------------
BLEService       sensorService("180C"); // センサーデータ送信用のBLEサービス
BLECharacteristic sensorChar("2A58");  // 固定 17 B
BLEService       audioService("181C"); // 音声データ（マイクで録音した1秒音片）送信用のBLEサービス
BLECharacteristic audioChar("2A59");   // 244 B
uint8_t clipID = 0;   // Audio Clip ID: 複数パケットに分かれた音声を同一IDで識別するためのもの

// ------------ ADPCM スタブ ---------------
extern "C" void ima_adpcm_encode(const int16_t* inPcm, uint32_t samples, uint8_t* outAdpcm);

// ============================================================================
// PDM 受信 ISR: PDMマイク（Pulse Density Modulation）からリアルタイムに届く音声サンプルをリングバッファに保存する「割り込み処理（ISR）」
// 常に1秒分の音声データ（=リングバッファ）を最新状態に保つための中核
// ============================================================================
void onPDMdata(){
  // 現在読み取れるPDMデータのバイト数を取得（最大512バイト = 256サンプル）
  int bytes = PDM.available();

  // sampleBuffer に読み取ったPDMデータ（16bit PCM）を格納
  PDM.read(sampleBuffer, bytes); 

  // sampleBuffer は short 配列だが、16bitの音声サンプルとしてアクセスするために int16_t* にキャスト
  int16_t* ptr = (int16_t*)sampleBuffer;

  // サンプル数（バイト数 ÷ 2）を算出
  int cnt = bytes/2;
  
  // 取得した音声データを 1 サンプルずつ ringBuffer に書き込み
  // writeIdx は常に循環（リングバッファ）
  for(int i = 0; i < cnt; i++){
    ringBuffer[writeIdx] = ptr[i];
    writeIdx = (writeIdx + 1) % CLIP_SAMPLES;
  }

  // 今回取得したサンプル数を保存。後で音量検出などで参照される
  samplesRead = cnt;
}

// ------------ Peak‑to‑Peak 計算 (最新 len サンプル) ---------------
int32_t getP2P(uint32_t len){
  short minv = 30000, maxv = -30000;
  for(uint32_t i = 0; i < len; i++){
    uint32_t idx = (writeIdx + CLIP_SAMPLES - i - 1 ) % CLIP_SAMPLES;
    int16_t v = ringBuffer[idx];
    minv = min(minv,v);
    maxv = max(maxv,v);
  }
  return maxv - minv;
}

// ============================================================================
// BLE 初期化
// ============================================================================
void setupBLE() {
  Serial.println("Feather_Sense_AllSensor.ino: setupBLE() ");
  
  Bluefruit.begin();
  Bluefruit.setTxPower(4);            // 送信出力 dBm
  Bluefruit.setName("FeatherSensor");

  // Sensor characteristic (17 B)
  sensorService.begin();
  sensorChar.setProperties(CHR_PROPS_NOTIFY);
  sensorChar.setPermission(SECMODE_OPEN,SECMODE_NO_ACCESS);
  sensorChar.setFixedLen(17);
  sensorChar.begin();

  // Audio characteristic (244 B)
  audioService.begin();
  audioChar.setProperties(CHR_PROPS_NOTIFY);
  audioChar.setPermission(SECMODE_OPEN,SECMODE_NO_ACCESS);
  audioChar.setFixedLen(244);
  audioChar.begin();

  Bluefruit.Advertising.addService(sensorService);
  Bluefruit.Advertising.addService(audioService);
  Bluefruit.Advertising.start();

  Serial.println("BLE initialized. Advertising...");
}

// ============================================================================
// センサパケット生成 (17 B)
// ============================================================================
void sendSensorDataCompressed() {
  uint8_t packet[17];
  int idx = 0;

  // 16 ビット（2 byte）の整数を、下位 8 bit と上位 8 bit の 2 つの 8 bit（1 byte）値に分割する関数
  auto push16 = [&](uint16_t v) {
    /*
      0xFF: 16 進数で 11111111₂。下位 8 bit が全部 1 のマスク。
      v & 0xFF: v の 下位 8 bit だけを残し、上位 8 bit を 0 にする。
      > uint16_t v = 0x1234;   // 0001 0010 0011 0100₂
      > uint8_t  lo = v & 0xFF;  // → 0x34 (0011 0100₂)
    */
    packet[idx++] = v & 0xFF;
    /*
      v >> 8: v を 右に 8 bit シフトして、上位 8 bit を下位側に押し出す。
      > uint8_t hi = v >> 8;   // 0000 0000 0001 0010₂ → 0x12
    */
    packet[idx++] = v >> 8;
  };

  /*
  1. 1バイト：Proximity
  2. 3バイト：加速度（各軸 ±16 m/s² → 0–255）
  3. 3バイト：地磁気（各軸 ±100 µT → 0–255）
  4. 6バイト：ジャイロ（各軸 ±2000 dps → 0–65535）
  5. 1バイト：温度（−40～+85 ℃ → 0–255）
  6. 1バイト：Clear（0–100 光量）
  7. 2バイト：RGB565
  ――――――――――――――――――――
  合計：17 バイト
  */

  packet[idx++] = proximity;
  packet[idx++] = (uint8_t)(accel_x * 8.0f + 128);
  packet[idx++] = (uint8_t)(accel_y * 8.0f + 128);
  packet[idx++] = (uint8_t)(accel_z * 8.0f + 128);
  packet[idx++] = (uint8_t)(magnetic_x * 1.25f + 128);
  packet[idx++] = (uint8_t)(magnetic_y * 1.25f + 128);
  packet[idx++] = (uint8_t)(magnetic_z * 1.25f + 128);
  auto mapGyro16 = [](float g) {
    int32_t v = (int32_t)roundf((g + 2000.0f) * 65535.0f / 4000.0f);
    return (uint16_t)constrain(v, 0, 65535);
  };
  push16(mapGyro16(gyro_x));
  push16(mapGyro16(gyro_y));
  push16(mapGyro16(gyro_z));
  packet[idx++] = (uint8_t)constrain((int)((temperature + 40.0f) * 255.0f / 125.0f), 0, 255);
  packet[idx++] = (uint8_t)min((int)c, 255);
  uint16_t rgb565 = ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3);
  push16(rgb565);

  if(sensorChar.notifyEnabled()) sensorChar.notify(packet,sizeof(packet));
}

// ============================================================================
// オーディオクリップ送信
// Step1. 1秒分のPCMを ringBuffer からコピー
// Step2. PCM → ADPCM 圧縮（1/4サイズ）
// Step3. 圧縮された ADPCM をBLEで17パケットに分割送信
// Step4. 識別情報付きで17パケット送信
// ============================================================================
void sendAudioClip(){
  // PCM（Pulse Code Modulation）：PDMをデコードして得られる16bitのリニア音声データ. 圧縮や解析などに使う
  static int16_t pcm[CLIP_SAMPLES];
  static uint8_t adpcm[ADPCM_BYTES];

  // マイクからの入力（PDM）1秒分を、リングバッファに16,000サンプル分コピーして、保持
  for(uint32_t i = 0; i < CLIP_SAMPLES; i++){
    uint32_t idx = (writeIdx + i) % CLIP_SAMPLES;
    pcm[i] = ringBuffer[idx];
  }
  ima_adpcm_encode(pcm, CLIP_SAMPLES,adpcm);
  uint8_t seq=0;

  for(uint32_t off=0; off<ADPCM_BYTES; off += FRAG_PAYLOAD){
    uint8_t pkt[244];
    pkt[0]=clipID; pkt[1]=seq++;
    memcpy(&pkt[2], adpcm+off,FRAG_PAYLOAD);
    if(audioChar.notifyEnabled()) audioChar.notify(pkt, 2+FRAG_PAYLOAD);
    delay(5);
  }
  clipID++;
}

// ============================================================================
// setup()
// ============================================================================
void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);  // USBシリアル接続を待つ
  Serial.println("Booting...");
  
  Serial.println("Feather Sense BLE Sensor Demo (no altitude)");

  // ----- 各センサ初期化 ------------------------------
  apds9960.begin();
  apds9960.enableProximity(true);
  apds9960.enableColor(true);

  bmp280.begin();
  lis3mdl.begin_I2C();
  lsm6ds33.begin_I2C();
  sht30.begin();

  // ------------------------------------------------------------------
  // 🆔 センサー基板リビジョン自動判定
  // ------------------------------------------------------------------
  sensors_event_t a, g, t;
  lsm6ds33.getEvent(&a, &g, &t);
  if (a.acceleration.x == 0 && g.gyro.x == 0) {
    new_rev = true;                // LSM6DS3TR-C 搭載と推定
    lsm6ds3trc.begin_I2C();
  } else {
    new_rev = false;               // 旧 LSM6DS33 をそのまま使用
  }

  // ----- マイク初期化 ------------------------------
  PDM.onReceive(onPDMdata);
  PDM.begin(1, SAMPLE_RATE);  // 16 kHz

  // ----- BLE 初期化 ------------------------------
  setupBLE();
}

// ============================================================================
// loop() : 300 ms 周期でセンサ取得 → 圧縮 → BLE送信
//.         マイクしきい値判定 
// ============================================================================
uint32_t lastSensorMs=0;

void loop() {
  digitalToggle(LED_RED); // デバッグ用にLEDを点滅
  
  // ---- センサ 300 ms ----
  if(millis()-lastSensorMs>=300){ // delay(300) と違って、マイコンを止めずに時間を測れる（非ブロッキング）
    // ---------- 近接 & 色センサ ----------
    proximity = apds9960.readProximity();
    while (!apds9960.colorDataReady()) delay(5);
    apds9960.getColorData(&r, &g, &b, &c);
    // Serial.printf("r = %u, g = %u, b = %u\n", r, g, b);

    // ---------- 温度 & 気圧 ----------
    temperature = bmp280.readTemperature();
    pressure    = bmp280.readPressure();

    // ---------- 地磁気 ----------
    lis3mdl.read();
    magnetic_x = lis3mdl.x;
    magnetic_y = lis3mdl.y;
    magnetic_z = lis3mdl.z;

    // ---------- 加速度 & ジャイロ ----------
    sensors_event_t accel, gyro, temp;
    if (new_rev) {
      lsm6ds3trc.getEvent(&accel, &gyro, &temp);
    } else {
      lsm6ds33.getEvent(&accel, &gyro, &temp);
    }
    accel_x = accel.acceleration.x;
    accel_y = accel.acceleration.y;
    accel_z = accel.acceleration.z;
    gyro_x = gyro.gyro.x;
    gyro_y = gyro.gyro.y;
    gyro_z = gyro.gyro.z;

    humidity = sht30.readHumidity();

    sendSensorDataCompressed();
  }

  // ---- マイクしきい値判定 ----
  if(getP2P(SAMPLE_RATE / 10) >= THRESHOLD_P2P) {
    sendAudioClip();
  }
}
