import serial
import pyaudio

SAMPLE_BUFFER_SIZE = 512 # もともと512 bytesの音声データが、圧縮されて256 bytesになるので、512/2
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

try:
    while True:
        data = ser.read(512)  # Featherからのデータサイズに応じて調整
        print(f"Received Data: {(data)}")
        stream.write(data)
except KeyboardInterrupt:
    pass

stream.stop_stream()
stream.close()
p.terminate()
ser.close()