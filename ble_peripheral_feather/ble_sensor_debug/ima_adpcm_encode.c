// ima_adpcm_encode.c — 軽量 IMA-ADPCM エンコーダ（4bit/sample）実装

#include <stdint.h>

// ステップサイズテーブル（規定）
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

// インデックステーブル（符号付き4bitからstepインデックス更新用）
static const int index_table[16] = {
  -1, -1, -1, -1, 2, 4, 6, 8,
  -1, -1, -1, -1, 2, 4, 6, 8
};

// グローバルステート（マイコンなら1チャンクごとにリセットでもOK）
static int predictor = 0;  // 予測値（最初は0）
static int index = 0;      // step_table のインデックス

void ima_adpcm_encode(const int16_t* inPcm, uint32_t samples, uint8_t* outAdpcm) {
  uint8_t outByte = 0;
  for (uint32_t i = 0; i < samples; i++) {
    int diff = inPcm[i] - predictor;
    int sign = (diff < 0) ? 8 : 0;
    if (sign) diff = -diff;

    int step = step_table[index];
    int delta = 0;
    if (diff >= step)     { delta = 4; diff -= step; }
    if (diff >= step / 2) { delta |= 2; diff -= step / 2; }
    if (diff >= step / 4) { delta |= 1; }

    delta |= sign;

    // 更新予測値
    int vpdiff = step >> 3;
    if (delta & 4) vpdiff += step;
    if (delta & 2) vpdiff += step >> 1;
    if (delta & 1) vpdiff += step >> 2;
    if (sign) predictor -= vpdiff; else predictor += vpdiff;
    if (predictor > 32767) predictor = 32767;
    else if (predictor < -32768) predictor = -32768;

    // インデックス更新
    index += index_table[delta & 0xF];
    if (index < 0) index = 0;
    if (index > 88) index = 88;

    // 4bit × 2 → 1 byte にまとめる
    if (i & 1) {
      outByte |= (delta & 0x0F) << 4;
      *outAdpcm++ = outByte;
    } else {
      outByte = delta & 0x0F;
    }
  }
}