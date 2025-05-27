#include <PDM.h>

#define SAMPLE_BUFFER_SIZE 512

// Number of audio samples read
volatile int samplesRead;

int16_t sampleBuffer[SAMPLE_BUFFER_SIZE];
void onPDMdata() {
  // Query the number of available bytes
  int bytesAvailable = PDM.available();

  // Read into the sample buffer
  PDM.read(sampleBuffer, bytesAvailable);

  // 16-bit, 2 bytes per sample
  samplesRead = bytesAvailable / 2;
}

void setup() {
  Serial.begin(115200);
  while (!Serial);

  PDM.onReceive(onPDMdata);
  if (!PDM.begin(1, 16000)) {
    Serial.println("Failed to start PDM!");
    while (1);
  }
}

void loop() {
  // Wait for samples to be read
  if (samplesRead) {
    Serial.write((uint8_t *)sampleBuffer, samplesRead * 2); // 生のPCMデータをシリアルに送信 (16bit=2byte)
    samplesRead = 0;
  }
}