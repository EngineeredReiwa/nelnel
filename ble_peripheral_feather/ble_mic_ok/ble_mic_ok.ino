/**********************************************************************
 Feather nRF52840 Sense
  – PDM 16 kHz で音声取得
  – 1/2 にダウンサンプリングして 8 kHz / IMA‑ADPCM 4‑bit で送信
  – BLE UART (NUS) Notify で Mac へストリーム
**********************************************************************/

#include <PDM.h>
#include <bluefruit.h>

/* ─── ファイル先頭の #include より後ろに追加 ─── */
volatile uint32_t bytesSent = 0;      // 1 秒あたりの送信量
volatile uint32_t dropCount = 0;      // TX バッファ満杯で落とした回数
unsigned long statTimer = 0;

BLEUart bleuart;

// ───────── サンプリング & バッファ設定 ─────────
#define SAMPLE_RATE          16000       // PDM の許容値なので 16 kHz のまま
#define DOWNSAMPLE_FACTOR    2           // ★16 → 8 kHz に間引く
#define SAMPLE_BUFFER_SIZE   512         // 32 ms 分
#define ENCODED_SAMPLES      (SAMPLE_BUFFER_SIZE / DOWNSAMPLE_FACTOR)

#define LED_PIN LED_BUILTIN

// ★ADPCM は 4‑bit (=1/2) なのでバイト数は /2
#define ADPCM_ENCODED_SIZE   (ENCODED_SAMPLES / 2)
#define ADPCM_BUFFER_SIZE    (ADPCM_ENCODED_SIZE + 4)   // ← ヘッダ 4 B

volatile int samplesRead = 0;
int16_t sampleBuffer[SAMPLE_BUFFER_SIZE];
int16_t dsBuffer[ENCODED_SAMPLES];       // ダウンサンプル後の PCM
uint8_t adpcmBuffer[ADPCM_BUFFER_SIZE];

// ───────── トリガー関連 ─────────
#define PRE_RECORD_MS   500
#define POST_RECORD_MS  1000
#define COOLDOWN_MS     500
#define PRE_RECORD_SAMPLES  (SAMPLE_RATE * PRE_RECORD_MS  / 1000)
#define POST_RECORD_SAMPLES (SAMPLE_RATE * POST_RECORD_MS / 1000)
#define RING_BUFFER_SIZE    PRE_RECORD_SAMPLES
#define VOLUME_THRESHOLD    1500

int16_t ringBuffer[RING_BUFFER_SIZE];
int ringIndex = 0;
bool triggered = false;
int postSamplesLeft = 0;
unsigned long lastTriggerTime = 0;

// ───────── ADPCM 変換用状態 ─────────
static int predictor = 0;
static int stepIndex = 0;

// ========== IMA‑ADPCM エンコーダ ==========
void ima_adpcm_encode(const int16_t* inPcm, uint32_t samples, uint8_t* outAdpcm)
{
  // …（テーブル定義はそのまま。元コードを省略せずに残してください）…
  /*  ↓ 既存のテーブルと for ループをそのまま貼り付け ↓  */
  static const int step_table[89] = {
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31,
    34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371,
    408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166,
    1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
    3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845,
    8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500,
    20350, 22385, 24623, 27086, 29794, 32767
  };
  static const int index_table[16] = {
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
  };

  uint8_t outByte = 0;
  for (uint32_t i = 0; i < samples; i++) {
    int diff = inPcm[i] - predictor;
    int sign = (diff < 0) ? 8 : 0;
    if (sign) diff = -diff;

    int step = step_table[stepIndex];
    int delta = 0;
    if (diff >= step)     { delta = 4; diff -= step; }
    if (diff >= step / 2) { delta |= 2; diff -= step / 2; }
    if (diff >= step / 4) { delta |= 1; }
    delta |= sign;

    int vpdiff = step >> 3;
    if (delta & 4) vpdiff += step;
    if (delta & 2) vpdiff += step >> 1;
    if (delta & 1) vpdiff += step >> 2;
    if (sign) predictor -= vpdiff; else predictor += vpdiff;
    predictor = max(-32768, min(32767, predictor));

    stepIndex += index_table[delta & 0xF];
    stepIndex = max(0, min(88, stepIndex));

    if (i & 1) {
      outByte |= (delta & 0x0F) << 4;
      *outAdpcm++ = outByte;
    } else {
      outByte = delta & 0x0F;
    }
  }
}

// ========== PDM コールバック ==========
void onPDMdata()
{
  int bytesAvailable = PDM.available();
  PDM.read(sampleBuffer, bytesAvailable);
  samplesRead = bytesAvailable / 2;

  for (int i = 0; i < samplesRead; i++) {
    ringBuffer[ringIndex] = sampleBuffer[i];
    ringIndex = (ringIndex + 1) % RING_BUFFER_SIZE;
  }
}

// ========== 音量検出 ==========
bool detectLoudVolume(int16_t* buf, int len, int th)
{
  for (int i = 0; i < len; i++) {
    if (abs(buf[i]) > th) return true;
  }
  return false;
}

void onConnect(uint16_t conn_hdl)
{
  BLEConnection *conn = Bluefruit.Connection(conn_hdl);
  Serial.print("Negotiated MTU  = ");  Serial.println(conn->getMtu());     // → 247
  Serial.print("Negotiated DLen = "); Serial.println(conn->getDataLength()); // → 251

  delay(1000);
  Serial.print("[conn] MTU after 1 s  = ");   Serial.println(conn->getMtu());
  Serial.print("[conn] DLen after 1 s = ");  Serial.println(conn->getDataLength());
}

// ========== 初期化 ==========
void setup()
{
  Serial.begin(115200);
  while (!Serial) {}

  Serial.println("Booting...");

  PDM.onReceive(onPDMdata);
  
  if (!PDM.begin(1, SAMPLE_RATE)) {
    Serial.println("PDM begin failed!"); while (1);
  }
  Serial.println("PDM ready");

  // Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);
  Bluefruit.configPrphConn(247, 100, 16, 16);

  // BLE初期化
  if (!Bluefruit.begin()) {
    Serial.println("Bluefruit.begin() failed!"); while (1);
  }
  Serial.println("Bluefruit.begin OK");

  Bluefruit.setTxPower(4);
  Bluefruit.setName("CatVoiceStreamer");

  bleuart.begin();

  Bluefruit.Periph.setConnectCallback(onConnect); // 交渉結果をシリアルで確認
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addService(bleuart);
  Bluefruit.Advertising.addName();
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);
  Bluefruit.Advertising.start(0);

  if (!Bluefruit.Advertising.isRunning()) {
    Serial.println("BLE advertising failed to start!"); while (1);
  }
  Serial.println("Advertising started");

  Serial.println("BLE Audio Streamer Ready!");
}

// ======== メインループ =========
/*──── ① ループ外で共通関数化 ─────────────────────*/
// グローバル
static uint8_t seq = 0;  // シーケンス番号

void send_block(int16_t* pcm, int nSamples)
{
  /* 送信前に現在の状態を退避 */
  uint16_t pred0 = predictor;
  uint8_t  idx0  = stepIndex;

  /* ---------- ダウンサンプル ---------- */
  int encodedSamples = nSamples / DOWNSAMPLE_FACTOR;   // 256, 128, 64 … 可変
  for (int k = 0; k < encodedSamples; k++)
      dsBuffer[k] = pcm[k * DOWNSAMPLE_FACTOR];

  /* ---------- ADPCM 変換 ---------- */
  ima_adpcm_encode(dsBuffer, encodedSamples, adpcmBuffer + 4);

  /* ---------- ヘッダ ---------- */
  adpcmBuffer[0] = seq++;
  adpcmBuffer[1] = pred0 & 0xFF;
  adpcmBuffer[2] = pred0 >> 8;
  adpcmBuffer[3] = idx0;

  /* ---------- 送信長を “実際にエンコードした分” に合わせる ---------- */
  int adpcmBytes  = (encodedSamples + 1) / 2;          // 2 サンプル / 1 バイト
  int bytesToSend = adpcmBytes + 4;                    // ← ★ここが可変になる

  if (Bluefruit.connected()) {
    unsigned long t0 = micros();
    size_t sent = bleuart.write(adpcmBuffer, bytesToSend);
    unsigned long t1 = micros();

    bytesSent += sent;
    Serial.print("TX "); Serial.print(sent); Serial.print("B (");
    Serial.print(bytesToSend); Serial.print("B expected), ");
    Serial.print("took "); Serial.print(t1 - t0); Serial.println(" us");

    if (sent < bytesToSend) {
      dropCount++;
      Serial.println("⚠️ Drop detected!");
    }
  }
}

/******************************************************************
  追加：リンクが“準備完了”かどうか判定するヘルパ
******************************************************************/
bool linkReady()
{
  if (!Bluefruit.connected()) return false;
  BLEConnection* conn = Bluefruit.Connection(0);   // 1本だけ想定

  /* MTU と DataLen が拡張済みか？ */
  return (conn->getMtu() >= 247) && (conn->getDataLength() >= 200);
}

/*──── ② loop() 内 ─────────────────────────────*/
void loop()
{
  /* Negotiation が終わるまで PCM を捨てるだけ */
  if (!linkReady()) { samplesRead = 0; return; }

  if (samplesRead == 0) return;

  unsigned long now = millis();

  /* ── triggered 中だけ送信 ── */
  if (triggered && postSamplesLeft > 0) {
    int sendSamples = min(samplesRead, postSamplesLeft);
    send_block(sampleBuffer, sendSamples);     // ← 関数呼び出し
    postSamplesLeft -= sendSamples;
    if (postSamplesLeft <= 0) triggered = false;
  }

  /* ── 新規トリガー判定 ── */
  if (!triggered &&
      (now - lastTriggerTime > COOLDOWN_MS) &&
      detectLoudVolume(sampleBuffer, samplesRead, VOLUME_THRESHOLD)) {

    triggered = true;
    predictor = 0;
    stepIndex = 0;
    postSamplesLeft = POST_RECORD_SAMPLES;
    lastTriggerTime = now;

    /* 直前 500 ms を送信 */
    int idx = ringIndex;
    for (int sent = 0; sent < RING_BUFFER_SIZE; sent += SAMPLE_BUFFER_SIZE) {
      int blk = min(SAMPLE_BUFFER_SIZE, RING_BUFFER_SIZE - sent);
      int16_t tmp[SAMPLE_BUFFER_SIZE];
      for (int j = 0; j < blk; j++) {
        tmp[j] = ringBuffer[(idx + j) % RING_BUFFER_SIZE];
      }
      send_block(tmp, blk);                   // ← ここでも同じ関数
      idx = (idx + blk) % RING_BUFFER_SIZE;
    }
  }

  samplesRead = 0;

  if (millis() - statTimer >= 1000) {   // 1 秒ごと
    Serial.print("TX "); Serial.print(bytesSent); Serial.print(" B/s,  drop ");
    Serial.println(dropCount);
    bytesSent = dropCount = 0;
    statTimer = millis();
  }
}