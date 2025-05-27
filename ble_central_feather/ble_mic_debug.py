import asyncio
import time
from bleak import BleakScanner, BleakClient
import numpy as np
import sounddevice as sd
import logging,os

# os.environ["BLEAK_LOG_LEVEL"] = "DEBUG"
# logging.basicConfig(level=logging.DEBUG)

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

def ima_adpcm_decode(adpcm_bytes: bytearray) -> np.ndarray:
    """ADPCM データを PCM にデコードして返す。"""
    global predictor, step_index
    output = []
    for byte in adpcm_bytes:
        for shift in (0, 4):
            nibble = (byte >> shift) & 0x0F
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

def reset_decoder(pred, step):
    global predictor, step_index
    predictor = np.int32(pred)         # 32 bit に合わせる
    step_index = int(step)

# BLE UART Service UUIDs
UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
UART_TX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

# ★ ここで計測用のカウンタを用意
byte_cnt = 0
last_print = time.time()

async def main():
    # BLE デバイス探索
    print("Scanning for BLE device named 'CatVoiceStreamer'...")
    devices = await BleakScanner.discover(timeout=5.0)
    target = next((d for d in devices if d.name and 'CatVoiceStreamer' in d.name), None)
    if not target:
        print("対象デバイスが見つかりませんでした。")
        return
    print(f"Found target device: {target.name} ({target.address})")
    
    # 接続
    print(f"Connecting to {target.address}...")
    async with BleakClient(target) as client:
        # 接続完了
        print(f"Connected to {target.address}")
        # MTU 要求 (150)
        # try:
        #     mtu = await client.request_mtu(100)
        #     print(f"MTU negotiated: {mtu}")
        # except Exception as e:
        #     print(f" MTU request failed or not supported: {e}")
        # try:
        #     await client.request_phy(2)
        #     print("PHY updated to 2Mbps (if supported)")
        # except Exception as e:
        #     print(f"PHY request failed or not supported: {e}")
        #     pass

        # 音声再生ストリーム
        fs = 8000
        with sd.OutputStream(samplerate=fs, channels=1, dtype='int16') as stream:
            # 通知ハンドラ
            def handle_notify(_, data: bytearray):
                global byte_cnt, last_print

                seq        = data[0]
                pred       = int.from_bytes(data[1:3], 'little', signed=True)
                step       = data[3]
                audio_data = memoryview(data)[4:]   # ヘッダ以降をスライス

                reset_decoder(pred, step)           # ★ 状態をヘッダで上書き

                byte_cnt += len(data)
                now = time.time()
                if now - last_print >= 1.0:
                    print(f"RX {byte_cnt} B/s, packet size={len(data)} B, last seq={seq}")
                    byte_cnt = 0
                    last_print = now

                pcm = ima_adpcm_decode(audio_data)
                stream.write(pcm)


            # Notify 開始
            await client.start_notify(UART_TX_CHAR_UUID, handle_notify)
            print("Receiving audio via BLE...")
            # 終了しないように待機
            await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
