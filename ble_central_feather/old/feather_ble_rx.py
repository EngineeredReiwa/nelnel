#!/usr/bin/env python3
import asyncio, struct, math
from bleak import BleakScanner, BleakClient

SERVICE_UUID = "0000180c-0000-1000-8000-00805f9b34fb"   # 0x180C
CHAR_UUID    = "00002a58-0000-1000-8000-00805f9b34fb"   # 0x2A58

def decode(packet: bytes) -> dict:
    if len(packet) != 17:
        raise ValueError(f"期待 17 byte, 取得 {len(packet)} byte")
    
    
    prox = packet[0]

    # 1-3: Acceleration (±16 m/s² → 128段階)
    ax = (packet[1] - 128) / 8.0
    ay = (packet[2] - 128) / 8.0
    az = (packet[3] - 128) / 8.0

    # 4-6: Magnetic field (±100 µT → 0.8 µT刻み)
    mx = (packet[4] - 128) / 1.25
    my = (packet[5] - 128) / 1.25
    mz = (packet[6] - 128) / 1.25

    # 7-12: Gyroscope (±2000 dps → uint16 0–65535)
    def u16(lo, hi):
        return lo | (hi << 8)
    gx_raw = u16(packet[7], packet[8])
    gy_raw = u16(packet[9], packet[10])
    gz_raw = u16(packet[11], packet[12])
    # マッピングの逆変換: g = (raw / 65535) * 4000 - 2000
    gx = (gx_raw * 4000.0 / 65535.0) - 2000.0
    gy = (gy_raw * 4000.0 / 65535.0) - 2000.0
    gz = (gz_raw * 4000.0 / 65535.0) - 2000.0

    # 13: Temperature (-40～+85℃ mapped to 0–255)
    temp = (packet[13] * 125.0 / 255.0) - 40.0

    # 14: Clear light level (0–255)
    clear = packet[14]

    # 15-16: RGB565
    rgb565 = packet[15] | (packet[16] << 8)
    r = ((rgb565 >> 11) & 0x1F) << 3
    g = ((rgb565 >> 5) & 0x3F) << 2
    b = (rgb565 & 0x1F) << 3

    return {
        "prox": prox,
        "accel (m/s²)": (ax, ay, az),
        "mag (µT)": (mx, my, mz),
        "gyro (dps)": (gx, gy, gz),
        "temp (°C)": temp,
        "clear": clear,
        "rgb": (r, g, b),
    }


async def main():
    print("🔍 デバイスをスキャン中 ... (5 s)")
    devices = await BleakScanner.discover(timeout=5.0)
    target   = next((d for d in devices if d.name == "FeatherTest"), None)
    if not target:
        print("❌ FeatherTest が見つかりません。電源とアドバタイズを確認してください。")
        return

    print(f"✅ 見つかりました: {target.address}. 接続します…")
    async with BleakClient(target) as client:
        # 接続後サービス確認（省略可）
        svcs = await client.get_services()
        # 取得したキャラクタリスティック一覧を出力
        char_uuids = [str(ch.uuid) for ch in svcs.get_service(SERVICE_UUID).characteristics]
        print("🗒 Service characteristics:", char_uuids)
        service = svcs.get_service(SERVICE_UUID)
        if service is None:
            raise RuntimeError(f"Service {SERVICE_UUID} が見つかりません。")
        if CHAR_UUID not in [str(ch.uuid) for ch in service.characteristics]:
            raise RuntimeError(f"{CHAR_UUID} characteristic が見つかりません。UUID を確認してください。")
        
        print("🔌 接続完了。Notify を開始します。")
        def handle(sender, data: bytearray):
            try:
                decoded = decode(data)
                print(decoded)
            except Exception as e:
                print("⚠️ デコードエラー:", e)

        await client.start_notify(CHAR_UUID, handle)
        print("📡 Notify 開始。Ctrl-C で終了します。")
        while True:                          # 接続維持
            await asyncio.sleep(60)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 終了しました。")