import asyncio, audioop, datetime, wave, sys, logging
from collections import defaultdict
from pathlib import Path
from bleak import BleakClient, BleakScanner

# ---------- 基本設定 ----------
DEVICE_NAME          = "FeatherTest"
AUDIO_CHAR_UUID      = "00002a59-0000-1000-8000-00805f9b34fb"
FRAGS_PER_CLIP       = 17
FRAG_PAYLOAD_BYTES   = 240
SAMPLE_RATE          = 16_000

# ---------- ログ設定 ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("feather_rx")

# -- clipID : {seq:int -> bytes} を格納
clips = defaultdict(dict)


# ---------- ユーティリティ ----------
def save_wav(clip_id: int, adpcm: bytes) -> None:
    pcm, _state = audioop.adpcm2lin(adpcm, 2, None)
    ts   = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    name = f"clip_{clip_id}_{ts}.wav"
    with wave.open(name, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm)
    log.info(f"[CLIP {clip_id:02d}] WAV 保存完了 → {name}  "
             f"({len(pcm)//2} samples)")


# ---------- 通知ハンドラ ----------
def handle_audio(_: int, data: bytearray) -> None:
    clip_id, seq = data[0], data[1]
    frag         = bytes(data[2:])

    log.debug(f"[ID {clip_id:02d}]  Seq {seq:02d}  "
              f"{len(frag)} B  {frag[:8].hex()}…")

    if len(frag) != FRAG_PAYLOAD_BYTES:
        log.warning(f"[ID {clip_id:02d}]  Seq {seq:02d} 長さ異常 "
                    f"({len(frag)} B)")

    # 受領フラグメント格納
    clips[clip_id][seq] = frag

    received = len(clips[clip_id])
    if received < FRAGS_PER_CLIP:
        missing = [i for i in range(FRAGS_PER_CLIP) if i not in clips[clip_id]]
        log.info(f"[ID {clip_id:02d}] 受信 {received}/{FRAGS_PER_CLIP}  "
                 f"Missing→ {missing}")
        return

    # ----- 全フラグメント揃った -----
    adpcm = b"".join(clips[clip_id][i] for i in range(FRAGS_PER_CLIP))
    log.info(f"[ID {clip_id:02d}] 全フラグメント受信完了  "
             f"({len(adpcm)} B) — デコード開始")
    try:
        save_wav(clip_id, adpcm)
    except Exception as e:
        log.exception(f"[ID {clip_id:02d}] デコード失敗: {e}")
    finally:
        del clips[clip_id]           # 後片付け


# ---------- メイン ----------
async def main() -> None:
    log.info("BLE スキャン開始 …")
    dev = None
    for d in await BleakScanner.discover(timeout=5.0):
        log.debug(f"  {d.address}  {d.name}")
        if d.name == DEVICE_NAME:
            dev = d
            break
    if dev is None:
        sys.exit("✗ FeatherTest が見つかりません")

    log.info(f"デバイス発見 → {dev.address}  — 接続します")
    async with BleakClient(dev) as client:
        await client.start_notify(AUDIO_CHAR_UUID, handle_audio)
        log.info("✓ 接続完了・Notify 開始 (Ctrl‑C で終了)")

        # オプション: RSSI を定期表示
        async def rssi_monitor():
            while True:
                try:
                    rssi = await client.get_rssi()
                    log.debug(f"RSSI  {rssi} dBm")
                except Exception:
                    pass
                await asyncio.sleep(5)

        asyncio.create_task(rssi_monitor())
        while True:
            await asyncio.sleep(3600)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info("停止しました")