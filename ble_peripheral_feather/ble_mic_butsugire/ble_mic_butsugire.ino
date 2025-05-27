#include <PDM.h>
#include <bluefruit.h>

// UART サービスを使う
BLEUart bleuart;

#define SAMPLE_BUFFER_SIZE 512
#define ADPCM_BUFFER_SIZE (SAMPLE_BUFFER_SIZE / 2)

volatile int samplesRead;
int16_t sampleBuffer[SAMPLE_BUFFER_SIZE];
uint8_t adpcmBuffer[ADPCM_BUFFER_SIZE];

#define SAMPLE_RATE 16000
#define PRE_RECORD_MS 500
#define POST_RECORD_MS 1000
#define COOLDOWN_MS 500
#define PRE_RECORD_SAMPLES (SAMPLE_RATE * PRE_RECORD_MS / 1000)  // 8000
#define POST_RECORD_SAMPLES (SAMPLE_RATE * POST_RECORD_MS / 1000)  // 16000
#define RING_BUFFER_SIZE PRE_RECORD_SAMPLES
#define VOLUME_THRESHOLD 1500

int16_t ringBuffer[RING_BUFFER_SIZE];
int ringIndex = 0;
bool triggered = false;
int postSamplesLeft = 0;

unsigned long lastTriggerTime = 0;

// IMA-ADPCM エンコーダ用状態
static int predictor = 0;
static int stepIndex = 0;

void ima_adpcm_encode(const int16_t* inPcm, uint32_t samples, uint8_t* outAdpcm) {
  static const int step_table[89] = {
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
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
    if (predictor > 32767) predictor = 32767;
    else if (predictor < -32768) predictor = -32768;

    stepIndex += index_table[delta & 0xF];
    if (stepIndex < 0) stepIndex = 0;
    if (stepIndex > 88) stepIndex = 88;

    if (i & 1) {
      outByte |= (delta & 0x0F) << 4;
      *outAdpcm++ = outByte;
    } else {
      outByte = delta & 0x0F;
    }
  }
}

void onPDMdata() {
  int bytesAvailable = PDM.available();
  PDM.read(sampleBuffer, bytesAvailable);
  samplesRead = bytesAvailable / 2;

  // リングバッファに追記
  for (int i = 0; i < samplesRead; i++) {
    ringBuffer[ringIndex] = sampleBuffer[i];
    ringIndex = (ringIndex + 1) % RING_BUFFER_SIZE;
  }
}

bool detectLoudVolume(int16_t* buffer, int len, int threshold) {
  for (int i = 0; i < len; i++) {
    if (abs(buffer[i]) > threshold) return true;
  }
  return false;
}

void setup() {
  // --- デバッグ用シリアルはそのまま残すと便利 ---
  Serial.begin(115200);
  while(!Serial) delay(10);

  // --- PDM マイクの初期化（音声取得部分は①と同じ） ---
  PDM.onReceive(onPDMdata);
  if (!PDM.begin(1, SAMPLE_RATE)) {
    Serial.println("PDM begin failed!");
    while(1);
  }

  // --- BLE 初期化 ---
  Bluefruit.begin();           // デフォルト：1 接続, 1 広告チャネル

  Bluefruit.setTxPower(4);     // 適宜調整
  Bluefruit.setName("CatVoiceStreamer");

  // --- UART サービスの開始 ---
  bleuart.begin();             // TX: Notify, RX: Write

  // --- Advertising の設定 ---
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addService(bleuart);  // UART サービスを含める
  Bluefruit.Advertising.addName();
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244); // fast/slow
  Bluefruit.Advertising.start(0);             // 無期限広告

  Serial.println("BLE Audio Streamer Ready!");
}

void loop() {
  if (samplesRead > 0) {
    unsigned long now = millis();

    // --- トリガー中の後段サンプル送信 ---
    if (triggered && postSamplesLeft > 0) {
      int sendSamples = min(samplesRead, postSamplesLeft);
      ima_adpcm_encode(sampleBuffer, sendSamples, adpcmBuffer);
      int bytesToSend = sendSamples / 2;  // ADPCM で半分

      // BLE 経由で送る
      if ( Bluefruit.connected() ) {
        // UART TX キャラクタリスティックに対して Notify
        // 20bytes を超える場合は自動で分割されます
        bleuart.write(adpcmBuffer, bytesToSend);
      }
      postSamplesLeft -= sendSamples;
      if (postSamplesLeft <= 0) {
        triggered = false;
      }
    }

    // --- 新規トリガー判定（リングバッファ送信も同様に置き換え） ---
    if (!triggered && (now - lastTriggerTime > COOLDOWN_MS)) {
      if (detectLoudVolume(sampleBuffer, samplesRead, VOLUME_THRESHOLD)) {
        triggered = true;
        postSamplesLeft = POST_RECORD_SAMPLES;
        lastTriggerTime = now;

        // 直前 500ms のリングバッファを送信
        int idx = ringIndex;
        for (int i = 0; i < RING_BUFFER_SIZE; i += SAMPLE_BUFFER_SIZE) {
          int blockSize = min(SAMPLE_BUFFER_SIZE, RING_BUFFER_SIZE - i);
          int16_t tempBuf[SAMPLE_BUFFER_SIZE];
          for (int j = 0; j < blockSize; j++) {
            tempBuf[j] = ringBuffer[(idx + j) % RING_BUFFER_SIZE];
          }
          ima_adpcm_encode(tempBuf, blockSize, adpcmBuffer);
          int bytesToSend = blockSize / 2;
          if (Bluefruit.connected()) {
            bleuart.write(adpcmBuffer, bytesToSend);
          }
          idx = (idx + blockSize) % RING_BUFFER_SIZE;
        }
      }
    }

    samplesRead = 0;
  }
}
void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();

  // Include bleuart 128-bit uuid
  Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();
  
  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

// callback invoked when central connects
void connect_callback(uint16_t conn_handle)
{
  // Get the reference to current connection
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char central_name[32] = { 0 };
  connection->getPeerName(central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);
}

/**
 * Callback invoked when a connection is dropped
 * @param conn_handle connection where this event happens
 * @param reason is a BLE_HCI_STATUS_CODE which can be found in ble_hci.h
 */
void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  (void) conn_handle;
  (void) reason;

  Serial.println();
  Serial.print("Disconnected, reason = 0x"); Serial.println(reason, HEX);
}
