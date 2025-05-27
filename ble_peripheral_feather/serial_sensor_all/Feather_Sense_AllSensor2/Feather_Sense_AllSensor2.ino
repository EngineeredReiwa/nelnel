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

// -------------------- グローバル変数 --------------------
bool     new_rev = true; // true = 新REV (LSM6DS3TR-C)
uint8_t  proximity;
uint16_t r, g, b, c;
float    temperature, pressure; // altitude 削除
float    magnetic_x, magnetic_y, magnetic_z;
float    accel_x, accel_y, accel_z;
float    gyro_x,  gyro_y,  gyro_z;
float    humidity;
int32_t  mic;

// -------------------- PDM マイク --------------------
short         sampleBuffer[256];
volatile int  samplesRead = 0;

// -------------------- BLE 定義 --------------------
BLEService       sensorService(0x180C);
BLECharacteristic sensorChar  (0x2A58);

// ============================================================================
// PDM コールバック
// ============================================================================
void onPDMdata() {
  int bytes = PDM.available();
  PDM.read(sampleBuffer, bytes);
  samplesRead = bytes / 2;
}

// ============================================================================
// マイク振幅ピーク差分取得
// ============================================================================
int32_t getPDMwave(int32_t samples) {
  short minv =  30000;
  short maxv = -30000;
  while (samples > 0) {
    if (!samplesRead) { yield(); continue; }
    for (int i = 0; i < samplesRead && samples > 0; i++, samples--) {
      minv = min(sampleBuffer[i], minv);
      maxv = max(sampleBuffer[i], maxv);
    }
    samplesRead = 0;
  }
  return maxv - minv;
}

// ============================================================================
// BLE 初期化
// ============================================================================
void setupBLE() {
  Bluefruit.begin();
  Bluefruit.setTxPower(4);            // 送信出力 dBm
  Bluefruit.setName("FeatherSensor");

  sensorService.begin();
  sensorChar.setProperties(CHR_PROPS_NOTIFY);
  sensorChar.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  sensorChar.setFixedLen(sizeof(uint16_t) * 18); // 36 バイト
  sensorChar.begin();

  Bluefruit.Advertising.addService(sensorService);
  Bluefruit.Advertising.start();
}

// ============================================================================
// パケット生成 & Notify 送信（altitude を含まない 18 ワード）
// ============================================================================
void sendSensorDataCompressed() {
  uint16_t packet[] = {
    proximity,                 // 0  近接
    r, g, b, c,                // 1–4 色

    // 5 温度  -40〜85℃ → (℃*100 + 4000)
    (uint16_t)(temperature * 100 + 4000),

    // 6 気圧  95000〜105000 Pa → ((Pa-95000)/2) 0.02 hPa 単位
    (uint16_t)((pressure - 95000) / 2),

    // 7–9 地磁気 -100〜100 µT → (µT*100 + 10000)
    (uint16_t)(magnetic_x * 100 + 10000),
    (uint16_t)(magnetic_y * 100 + 10000),
    (uint16_t)(magnetic_z * 100 + 10000),

    // 10–12 加速度 -16〜16 m/s² → (m/s²*1000 + 16000)
    (uint16_t)(accel_x * 1000 + 16000),
    (uint16_t)(accel_y * 1000 + 16000),
    (uint16_t)(accel_z * 1000 + 16000),

    // 13–15 ジャイロ -2000〜2000 dps → (dps*10 + 20000)
    (uint16_t)(gyro_x * 10 + 20000),
    (uint16_t)(gyro_y * 10 + 20000),
    (uint16_t)(gyro_z * 10 + 20000),

    // 16 湿度 0〜100% → (%*100)
    (uint16_t)(humidity * 100),

    // 17 マイク振幅
    (uint16_t)(mic > 65535 ? 65535 : mic)
  };

  if (sensorChar.notifyEnabled()) {
    sensorChar.notify((uint8_t*)packet, sizeof(packet));
  }
}

// ============================================================================
// setup()
// ============================================================================
void setup() {
  Serial.begin(115200);
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
  PDM.begin(1, 16000);  // 16 kHz / mono

  // ----- BLE 初期化 ------------------------------
  setupBLE();
}

// ============================================================================
// loop() : 300 ms 周期でセンサ取得 → 圧縮 → BLE送信
// ============================================================================
void loop() {
  // ---------- 近接 & 色センサ ----------
  proximity = apds9960.readProximity();
  while (!apds9960.colorDataReady()) delay(5);
  apds9960.getColorData(&r, &g, &b, &c);

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

  samplesRead = 0;
  mic = getPDMwave(4000);

  sendSensorDataCompressed();
  delay(300); // 送信間隔調整
}
