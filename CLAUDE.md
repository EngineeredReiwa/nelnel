# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an IoT cat health monitoring system that uses Adafruit Feather nRF52840 Sense boards to collect sensor data and audio, transmitting via BLE to a Python gateway, which feeds a Next.js web application.

## Key Architecture

### Hardware/Firmware (`ble_peripheral_feather/`)
- Main firmware: `serial_sensor_all/Feather_Sense_AllSensor2/Feather_Sense_AllSensor2.ino`
- Sensors: APDS9960, BMP280, LIS3MDL, LSM6DS3TRC, SHT31, PDM microphone
- Data format: 17-byte packets containing all sensor readings
- Audio: ADPCM compressed audio streaming via separate BLE characteristic
- BLE Services: Custom GATT service with UUIDs defined in firmware

### BLE Gateway (`ble_central_feather/`)
- Main receiver: `ble_sensor_debug.py` - receives and decodes sensor data
- Audio receiver: `ble_mic_default.py` - receives and plays audio stream
- Uses `bleak` library for BLE communication
- ADPCM decoding implemented in Python (matching C implementation)

### Web Application (`web/site/`)
- Next.js 15.3.2 app with TypeScript
- Main dashboard: `app/page.tsx` - shows real-time cat activity
- Landing page: `app/lp/page.tsx` - product information
- Uses Framer Motion for animations, Recharts for data visualization

## Development Commands

### Web Application
```bash
cd web/site
npm install        # Install dependencies
npm run dev        # Start development server on localhost:3000
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Arduino/Firmware
1. Open Arduino IDE
2. Install board support for Adafruit nRF52 (via Board Manager)
3. Install required libraries (all in `ble_peripheral_feather/libraries/`)
4. Select "Adafruit Feather nRF52840 Sense" as board
5. Upload `.ino` files to board

### Python BLE Scripts
```bash
cd ble_central_feather
pip install bleak numpy sounddevice
python ble_sensor_debug.py    # Run sensor data receiver
python ble_mic_default.py     # Run audio receiver
```

## Data Packet Structure

The 17-byte sensor packet contains:
- Proximity (2 bytes)
- Color RGB (6 bytes) 
- Temperature (2 bytes)
- Pressure (4 bytes)
- Magnetometer XYZ (6 bytes - overlapping with pressure)
- Accelerometer XYZ (6 bytes)
- Gyroscope XYZ (6 bytes - overlapping with accelerometer)
- Humidity (2 bytes)

Total unique data: 17 bytes (packed with some overlapping fields)

## BLE UUIDs
- Service UUID: `19B10010-E8F2-537E-4F6C-D104768A1214`
- Sensor Characteristic: `19B10012-E8F2-537E-4F6C-D104768A1214`
- Audio Characteristic: `19B10011-E8F2-537E-4F6C-D104768A1214`

## Testing

### Firmware Testing
- Use Serial Monitor (115200 baud) to view debug output
- LED indicators show BLE connection status

### BLE Testing
- Use `ble_sensor_debug.py` to verify sensor data format
- Check for "Feather nRF52840 Sense" device name in BLE scans

### Web Testing
- Mock data available in development mode
- Check browser console for WebSocket connection status