import asyncio, logging, sys
import numpy as np
import sounddevice as sd
from bleak import BleakScanner, BleakClient


# Feather で設定したデバイス名／UART キャラクタリスティック UUID
DEVICE_NAME = "FeatherTest"
UART_UUID   = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

# IMA-ADPCM デコーダ  
# state: [prev_sample, index]
STEP_TABLE = [
     7,     8,     9,    10,    11,    12,    13,    14,
    16,    17,    19,    21,    23,    25,    28,    31,
    34,    37,    41,    45,    50,    55,    60,    66,
    73,    80,    88,    97,   107,   118,   130,   143,
   157,   173,   190,   209,   230,   253,   279,   307,
   337,   371,   408,   449,   494,   544,   598,   658,
   724,   796,   876,   963,  1060,  1166,  1282,  1411,
  1552,  1707,  1878,  2066,  2272,  2499,  2749,  3024,
  3327,  3660,  4026,  4428,  4871,  5358,  5894,  6484,
  7132,  7845,  8630,  9493, 10442, 11487, 12635, 13899,
 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
 32767
]
INDEX_TABLE = [
 -1, -1, -1, -1, 2, 4, 6, 8,
 -1, -1, -1, -1, 2, 4, 6, 8
]

# ---------- ログ設定 ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("feather_rx")

def decode_ima_adpcm(adpcm: bytes, state=None):
    """IMA-ADPCM を 16bit PCM にデコードします"""
    if state is None:
        prev_sample = 0
        index = 0
    else:
        prev_sample, index = state

    pcm_out = []
    for byte in adpcm:
        # 下位ニブルと上位ニブルを処理
        for shift in (0, 4):
            code = (byte >> shift) & 0x0F
            step = STEP_TABLE[index]
            diff = step >> 3
            if code & 1: diff += step >> 2
            if code & 2: diff += step >> 1
            if code & 4: diff += step
            if code & 8: diff = -diff

            sample = prev_sample + diff
            sample = max(-32768, min(32767, sample))
            pcm_out.append(sample)
            prev_sample = sample

            index += INDEX_TABLE[code]
            index = max(0, min(index, len(STEP_TABLE)-1))

    return np.array(pcm_out, dtype=np.int16), (prev_sample, index)

async def main():
    print("Scanning for BLE device…")
    dev = None
    for d in await BleakScanner.discover(timeout=5.0):
        log.debug(f"  {d.address}  {d.name}")
        if d.name == DEVICE_NAME:
            dev = d
            break
    if dev is None:
        sys.exit("✗ FeatherTest が見つかりません")

    print(f"Connecting to {dev.name} ({dev.address})")
    async with BleakClient(dev) as cli:
        pcm_state = None  # ADPCM デコーダの状態
        buffer = np.empty((0,), dtype=np.int16)

        def callback(_, data: bytearray):
            nonlocal pcm_state, buffer
            # 受け取ったバイト列をデコード
            pcm_block, pcm_state = decode_ima_adpcm(bytes(data), pcm_state)
            buffer = np.concatenate((buffer, pcm_block))

            # 一定以上たまったら再生
            if buffer.size >= 1024:
                print("Playing", buffer.size, "samples")
                sd.play(buffer / 32768.0, samplerate=SAMPLE_RATE, blocking=True)
                buffer = np.empty((0,), dtype=np.int16)

        await cli.start_notify(UART_UUID, callback)
        print("Receiving and playing audio… Press Ctrl+C to stop.")
        while True:
            await asyncio.sleep(1)

if __name__ == "__main__":
    # SAMPLERATE は Feather 側と合わせる
    SAMPLE_RATE = 16000
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Stopped by user.")