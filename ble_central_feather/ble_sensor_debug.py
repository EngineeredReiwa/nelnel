import asyncio
from bleak import BleakClient, BleakScanner
import struct

# BLE UUIDs
SENSOR_CHAR_UUID = "00002A58-0000-1000-8000-00805F9B34FB"
AUDIO_CHAR_UUID = "00002A59-0000-1000-8000-00805F9B34FB"

# センサー通知のコールバック
def handle_sensor_data(_, data: bytearray):
    if len(data) != 17:
        print("Invalid sensor packet length.")
        return

    proximity = data[0]
    accel = [(data[i] - 128) / 8.0 for i in range(1, 4)]
    magnetic = [(data[i] - 128) / 1.25 for i in range(4, 7)]
    gyro = [struct.unpack("<H", data[i:i+2])[0] * 4000 / 65535 - 2000 for i in range(7, 13, 2)]
    temperature = data[13] * 125 / 255 - 40
    clear = data[14]
    rgb565 = struct.unpack("<H", data[15:17])[0]

    print(f"[Sensor] Prox:{proximity} Acc:{accel} Mag:{magnetic} Gyro:{gyro} Temp:{temperature:.1f}°C Clear:{clear} RGB565:0x{rgb565:04X}")

# オーディオ通知のコールバック
def handle_audio_data(_, data: bytearray):
    clip_id = data[0]
    seq = data[1]
    payload = data[2:]
    print(f"[Audio] Clip:{clip_id} Seq:{seq:02} Size:{len(payload)}")

# メインループ
async def main():
    print("🔍 Scanning for FeatherSensor...")
    devices = await BleakScanner.discover()
    target = next((d for d in devices if d.name and "FeatherSensor" in d.name), None)

    if not target:
        print("❌ FeatherSensor not found.")
        return

    async with BleakClient(target.address) as client:
        print(f"✅ Connected to {target.name} ({target.address})")

        await client.start_notify(SENSOR_CHAR_UUID, handle_sensor_data)
        await client.start_notify(AUDIO_CHAR_UUID, handle_audio_data)

        print("📡 Receiving BLE notifications...")
        while True:
            await asyncio.sleep(1)

asyncio.run(main())