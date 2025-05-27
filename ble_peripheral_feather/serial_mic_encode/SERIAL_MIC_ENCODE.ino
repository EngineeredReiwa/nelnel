#include <PDM.h>

#define SAMPLE_BUFFER_SIZE 512
#define ADPCM_BUFFER_SIZE (SAMPLE_BUFFER_SIZE / 2)

volatile int samplesRead;
int16_t sampleBuffer[SAMPLE_BUFFER_SIZE];
uint8_t adpcmBuffer[ADPCM_BUFFER_SIZE];

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
  if (samplesRead) {
    ima_adpcm_encode(sampleBuffer, samplesRead, adpcmBuffer);
    Serial.write(adpcmBuffer, samplesRead / 2);
    samplesRead = 0;
  }
}