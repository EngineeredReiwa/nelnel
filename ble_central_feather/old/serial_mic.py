import serial
import pyaudio
import audioop  # 音量増幅に使う
import numpy as np
import wave
from datetime import datetime
import time

SAMPLE_BUFFER_SIZE = 512 # もともと512 bytesの音声データが、圧縮されて256 bytesになるので、512/2
SAMPLES_PER_CHUNK = 256 # 1回のデコードで256 samples
SAMPLE_RATE = 16000
SERIAL_THROUGHPUT = 921600

ser = serial.Serial('/dev/cu.usbmodem11101', SERIAL_THROUGHPUT,timeout=1)
p = pyaudio.PyAudio()

stream = p.open(format=pyaudio.paInt16,
                channels=1,
                rate=SAMPLE_RATE,
                output=True,
                frames_per_buffer=SAMPLES_PER_CHUNK,)

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

def lowpass_simple(pcm_bytes: bytes, smoothing=4):
    pcm_array = np.frombuffer(pcm_bytes, dtype=np.int16)
    smoothed = np.convolve(pcm_array, np.ones(smoothing)/smoothing, mode='same')
    return smoothed.astype(np.int16).tobytes()

def save_wav(pcm_data: bytes, filename="output.wav"):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(1)              # モノラル
        wf.setsampwidth(2)              # int16 = 2byte
        wf.setframerate(SAMPLE_RATE)    # 16kHz
        wf.writeframes(pcm_data)

predictor = 0
index = 0

def decode_ima_adpcm(data: bytes):
    global predictor, index  # ← 維持するために global 宣言
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

# ======== メイン処理 =========
try:
    print("Receiving and playing audio… Press Ctrl+C to stop.")
    all_pcm = bytearray()

    while True:
        # シリアルからデータを読み込む
        data = ser.read(SAMPLE_BUFFER_SIZE)
        if len(data) != SAMPLE_BUFFER_SIZE:
            continue
        print(f"Received Data: {(data)}")
        # if len(data) == 0:
        #     continue  # 🔁 ← 空ならスキップ
        # if data == b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00':
        #     continue  # 🔁 ← 全部ゼロならスキップ
        # print(f"Received {len(data)} bytes")
        # trimmed = data.rstrip(b'\x00')
        # pcm_data = decode_ima_adpcm(trimmed)

        # 🔊 ストリームに書き出し
        # smoothed = lowpass_simple(pcm_data, smoothing=10)
        # louder = audioop.mul(pcm_data, 2, 12)  # 4倍に増幅
        stream.write(data,exception_on_underflow=False)

        # WAVファイルに保存
        all_pcm.extend(data)


except KeyboardInterrupt:
    print("Saving full session as WAV...")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"session_{timestamp}.wav"
    save_wav(all_pcm, filename)

    stream.stop_stream()
    stream.close()
    p.terminate()
    ser.close()
    print("Stream closed.")