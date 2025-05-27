import serial
import numpy as np
import sounddevice as sd

# ser = serial.Serial('/dev/cu.usbmodem101', 115200)  # ポートを確認して指定
ser = serial.Serial('/dev/cu.usbmodem11101', 115200)  # ポートを確認して指定

fs = 16000  # サンプリングレート (Arduinoと一致)
buffer_size = 512  # Arduinoと一致させる

print("Streaming Audio... Press Ctrl+C to stop.")

# try:
#     while True:
#         data = ser.read(buffer_size * 2)
#         audio_data = np.frombuffer(data, dtype=np.int16)
#         sd.play(audio_data, fs, blocking=True)
# except KeyboardInterrupt:
#     print("Stopped by user")
# finally:
#     ser.close()

try:
    with sd.OutputStream(samplerate=fs, channels=1, dtype='int16') as stream:
        while True:
            data = ser.read(buffer_size * 2)
            audio_data = np.frombuffer(data, dtype=np.int16)
            stream.write(audio_data)
except KeyboardInterrupt:
    print("Stopped by user")
finally:
    ser.close()