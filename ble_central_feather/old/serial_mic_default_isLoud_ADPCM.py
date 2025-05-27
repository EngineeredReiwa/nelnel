import serial
import pyaudio

SAMPLE_BUFFER_SIZE = int(512/2) # もともと512 bytesの音声データが、圧縮されて256 bytesになるので、512/2
SAMPLE_RATE = 16000
SERIAL_THROUGHPUT = 921600

# シリアルポートの設定
ser = serial.Serial('/dev/cu.usbmodem11101', 115200,timeout=1)  # 'COM3'は環境に応じて変更してください

# PyAudioの設定
p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16,
                channels=1,
                rate=16000,
                output=True)

# ======== IMA-ADPCM デコーダ定義 =========
step_table = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31,
    34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130,
    143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408,
    449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282,
    1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327,
    3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630,
    9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350,
    22385, 24623, 27086, 29794, 32767
]

index_table = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
]

def decode_ima_adpcm(data: bytes):
    predictor = 0
    index = 0
    pcm_out = []

    for byte in data:
        for nibble in [byte & 0x0F, (byte >> 4) & 0x0F]:
            step = step_table[index]
            diffq = step >> 3
            if nibble & 1: diffq += step >> 2
            if nibble & 2: diffq += step >> 1
            if nibble & 4: diffq += step
            if nibble & 8:
                predictor -= diffq
            else:
                predictor += diffq

            predictor = max(-32768, min(32767, predictor))
            index += index_table[nibble]
            index = max(0, min(88, index))

            pcm_out.append(predictor)

    # int16 リトルエンディアンに変換
    return b''.join(int(x).to_bytes(2, byteorder='little', signed=True) for x in pcm_out)


try:
    while True:
        adpcm_data = ser.read(SAMPLE_BUFFER_SIZE)  # 512サンプル（4bit×512 = 256byte）
        print(f"Received Data: {(adpcm_data)}")
        if len(adpcm_data) < SAMPLE_BUFFER_SIZE:
            print(f"[WARN] Short read: {len(adpcm_data)} bytes")
            continue
        pcm_data = decode_ima_adpcm(adpcm_data)
        stream.write(pcm_data)
except KeyboardInterrupt:
    pass

stream.stop_stream()
stream.close()
p.terminate()
ser.close()