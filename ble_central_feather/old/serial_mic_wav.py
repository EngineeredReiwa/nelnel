import serial
import time

# ====== 設定 ======
PORT = '/dev/cu.usbmodem11101'  # macOSの例。Windowsなら 'COM3' などに置き換えてください
BAUDRATE = 115200
WAV_FILENAME = 'output.wav'
TOTAL_SIZE = 44 + 16000 * 2 * 2  # WAVヘッダ44 + 16kHz × 2秒 × 2byte

# ====== シリアル接続開始 ======
ser = serial.Serial(PORT, BAUDRATE, timeout=5)
print(f"Connected to {PORT}... Waiting for data")

# ====== データ受信 ======
received_data = bytearray()
start_time = time.time()

while len(received_data) < TOTAL_SIZE:
    data = ser.read(TOTAL_SIZE - len(received_data))
    if data:
        received_data.extend(data)
        print(f"Received {len(received_data)}/{TOTAL_SIZE} bytes")
    else:
        print("No more data received, timeout?")
        break

# ====== 保存 ======
if len(received_data) >= 44:
    with open(WAV_FILENAME, 'wb') as f:
        f.write(received_data)
    print(f"Saved as {WAV_FILENAME}")
else:
    print("Received data is too short. Failed.")

ser.close()