import serial
import numpy as np
import sounddevice as sd
from bleak import BleakScanner, BleakClient
import asyncio

# 先ほどの ima_adpcm_decode() を同一ファイル内に記載

UART_SERVICE_UUID    = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
UART_TX_CHAR_UUID    = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"


# --------- ADPCM デコード処理 ---------
step_table = np.array([
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
], dtype=np.int32)

index_table = np.array([
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
], dtype=np.int8)

predictor = 0
step_index = 0

def ima_adpcm_decode(adpcm_bytes):
    global predictor, step_index
    output = []

    for byte in adpcm_bytes:
        for nibble_shift in [0, 4]:
            nibble = (byte >> nibble_shift) & 0x0F
            step = step_table[step_index]
            diffq = step >> 3
            if nibble & 4: diffq += step
            if nibble & 2: diffq += step >> 1
            if nibble & 1: diffq += step >> 2
            if nibble & 8:
                predictor -= diffq
            else:
                predictor += diffq

            predictor = max(-32768, min(32767, predictor))
            output.append(predictor)

            step_index += index_table[nibble]
            step_index = max(0, min(88, step_index))

    return np.array(output, dtype=np.int16)



# --------- シリアル & 再生 ---------
# ser = serial.Serial('/dev/cu.usbmodem11101', 115200)
# fs = 16000
# buffer_size = 512  # ArduinoでのPCMサイズ（512 samples → 256 bytes ADPCM）

# print("Streaming ADPCM Audio...")

# try:
#     with sd.OutputStream(samplerate=fs, channels=1, dtype='int16') as stream:
#         while True:
#             adpcm_data = ser.read(buffer_size // 2)  # 512 samples → 256 bytes
#             pcm = ima_adpcm_decode(adpcm_data)
#             stream.write(pcm)
# except KeyboardInterrupt:
#     print("Stopped by user")
# finally:
#     ser.close()

async def main():
    # 1) デバイス探索（名称やアドレスでフィルタリング可）
    devices = await BleakScanner.discover()
    target = None
    for d in devices:
        if d.name and "CatVoiceStreamer" in d.name:  # 実装側の device.setName()
            target = d
            break
    if not target:
        print("BLEデバイスが見つかりません")
        return

    # 2) 接続 & Notify 開始
    async with BleakClient(target) as client:
        print("接続完了:", target.address)

        # サウンドデバイスのストリームを開く
        fs = 16000
        with sd.OutputStream(samplerate=fs, channels=1, dtype='int16') as stream:

            # 通知コールバック
            def notification_handler(characteristic, data: bytearray):
                pcm = ima_adpcm_decode(data)
                stream.write(pcm)

            # Notify を開始 (非同期)
            await client.start_notify(UART_TX_CHAR_UUID, notification_handler)
            print("BLE ADPCM ストリーム受信中...")

            # 永久ループで待機
            await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())