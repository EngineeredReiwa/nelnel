'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat, Play, Pause, Volume2, VolumeX, Home, Clock, MapPin, Activity } from 'lucide-react';

// Data types based on specification
type MovementPoint = {
  time: string;
  x: number;
  y: number;
  speed: number;
  action: string;
  location: string;
};

type StayPoint = {
  location: string;
  x: number;
  y: number;
  duration: number;
  label: string;
  icon: string;
};

type VoiceLog = {
  time: string;
  x: number;
  y: number;
  audioUrl: string;
  interpretation: string;
};

// Sample data for demonstration
const movementData: MovementPoint[] = [
  { time: '08:00', x: 200, y: 300, speed: 0.5, action: 'walking', location: 'リビング' },
  { time: '08:05', x: 150, y: 280, speed: 0.3, action: 'slow_walk', location: 'キッチン' },
  { time: '08:10', x: 120, y: 200, speed: 0.0, action: 'eating', location: 'キッチン' },
  { time: '08:25', x: 250, y: 180, speed: 0.8, action: 'running', location: 'リビング' },
  { time: '08:30', x: 350, y: 160, speed: 0.2, action: 'exploring', location: '寝室' },
  { time: '08:45', x: 380, y: 140, speed: 0.0, action: 'sleeping', location: '寝室' },
  { time: '09:30', x: 380, y: 140, speed: 0.1, action: 'grooming', location: '寝室' },
  { time: '09:45', x: 200, y: 350, speed: 0.6, action: 'walking', location: 'リビング' },
  { time: '10:00', x: 100, y: 400, speed: 0.0, action: 'resting', location: 'トイレ付近' },
];

const stayPoints: StayPoint[] = [
  { location: 'ベッド', x: 380, y: 140, duration: 1620, label: '睡眠・休息', icon: '🛏️' },
  { location: 'トイレ', x: 100, y: 400, duration: 300, label: 'トイレ', icon: '🚽' },
  { location: 'ごはん場所', x: 120, y: 200, duration: 900, label: '食事', icon: '🍚' },
  { location: 'お気に入りスペース', x: 200, y: 300, duration: 480, label: '寛ぎタイム', icon: '⭐️' },
];

const voiceLogs: VoiceLog[] = [
  { time: '08:20', x: 180, y: 250, audioUrl: 'meow1.wav', interpretation: '呼びかけ・構って欲しい' },
  { time: '09:15', x: 350, y: 160, audioUrl: 'meow2.wav', interpretation: 'ごはんの催促' },
  { time: '09:50', x: 220, y: 320, audioUrl: 'meow3.wav', interpretation: '満足・機嫌が良い' },
];

export default function CatMovementMap() {
  const [currentTime, setCurrentTime] = useState('08:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPaths, setShowPaths] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<MovementPoint | null>(null);
  const [selectedStayPoint, setSelectedStayPoint] = useState<StayPoint | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceLog | null>(null);
  const [timeSliderValue, setTimeSliderValue] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert time string to minutes for slider
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Get movement points up to current time
  const getCurrentMovementPoints = () => {
    const currentMinutes = timeToMinutes(currentTime);
    return movementData.filter(point => timeToMinutes(point.time) <= currentMinutes);
  };

  // Get current cat position
  const getCurrentCatPosition = () => {
    const currentPoints = getCurrentMovementPoints();
    return currentPoints[currentPoints.length - 1] || movementData[0];
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        setTimeSliderValue(prev => {
          const next = prev + 5; // 5分ずつ進める
          if (next > 660) { // 11:00 (660分) まで
            setIsPlaying(false);
            return 660;
          }
          setCurrentTime(minutesToTime(480 + next)); // 08:00 (480分) から開始
          return next;
        });
      }, 500);
    } else {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    }

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isPlaying]);

  // Handle time slider change
  const handleTimeChange = (value: number) => {
    setTimeSliderValue(value);
    setCurrentTime(minutesToTime(480 + value)); // 08:00から開始
  };

  // Get path for movement visualization
  const getMovementPath = () => {
    const points = getCurrentMovementPoints();
    if (points.length < 2) return '';
    
    return points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');
  };

  // Get action color
  const getActionColor = (action: string) => {
    const colors = {
      walking: '#3B82F6',
      running: '#EF4444',
      slow_walk: '#10B981',
      eating: '#F59E0B',
      sleeping: '#8B5CF6',
      grooming: '#EC4899',
      exploring: '#06B6D4',
      resting: '#6B7280',
    };
    return colors[action as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cat className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-800">ねるちゃんの動線マップ</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>ホーム</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-800">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Playback Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? '一時停止' : '再生'}</span>
              </button>
              
              <button
                onClick={() => setShowPaths(!showPaths)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showPaths ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                軌跡表示
              </button>
            </div>

            {/* Time Slider */}
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                時間: {currentTime}
              </label>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={timeSliderValue}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>08:00</span>
                <span>11:00</span>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Floor Plan and Movement Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative" style={{ height: '600px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 500"
                  className="absolute inset-0"
                  style={{ transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)` }}
                >
                  {/* Floor Plan Background */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="500" height="500" fill="url(#grid)" />
                  
                  {/* Room Boundaries */}
                  <rect x="50" y="50" width="200" height="150" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                  <text x="150" y="130" textAnchor="middle" className="text-sm font-medium" fill="#64748b">リビング</text>
                  
                  <rect x="50" y="200" width="100" height="100" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <text x="100" y="255" textAnchor="middle" className="text-sm font-medium" fill="#92400e">キッチン</text>
                  
                  <rect x="300" y="50" width="150" height="200" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                  <text x="375" y="155" textAnchor="middle" className="text-sm font-medium" fill="#047857">寝室</text>
                  
                  <rect x="50" y="350" width="80" height="80" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
                  <text x="90" y="395" textAnchor="middle" className="text-sm font-medium" fill="#be185d">トイレ</text>

                  {/* Movement Path */}
                  {showPaths && (
                    <path
                      d={getMovementPath()}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeOpacity="0.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Movement Points */}
                  {getCurrentMovementPoints().map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={3 + point.speed * 5}
                        fill={getActionColor(point.action)}
                        opacity={0.7}
                        className="cursor-pointer hover:opacity-100"
                        onClick={() => setSelectedPoint(point)}
                      />
                      {index === getCurrentMovementPoints().length - 1 && (
                        <motion.circle
                          cx={point.x}
                          cy={point.y}
                          r="8"
                          fill="#F97316"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </g>
                  ))}

                  {/* Stay Points */}
                  {stayPoints.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="15"
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        className="cursor-pointer hover:fill-opacity-40"
                        onClick={() => setSelectedStayPoint(point)}
                      />
                      <text
                        x={point.x}
                        y={point.y + 5}
                        textAnchor="middle"
                        fontSize="16"
                        className="pointer-events-none"
                      >
                        {point.icon}
                      </text>
                    </g>
                  ))}

                  {/* Voice Logs */}
                  {voiceLogs
                    .filter(voice => timeToMinutes(voice.time) <= timeToMinutes(currentTime))
                    .map((voice, index) => (
                      <g key={index}>
                        <circle
                          cx={voice.x}
                          cy={voice.y}
                          r="12"
                          fill="rgba(236, 72, 153, 0.2)"
                          stroke="#EC4899"
                          strokeWidth="2"
                          className="cursor-pointer animate-pulse"
                          onClick={() => setSelectedVoice(voice)}
                        />
                        <Volume2 
                          x={voice.x - 6} 
                          y={voice.y - 6} 
                          width="12" 
                          height="12" 
                          className="pointer-events-none"
                          fill="#EC4899"
                        />
                      </g>
                    ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                現在の状況
              </h3>
              {(() => {
                const currentPos = getCurrentCatPosition();
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">時刻:</span>
                      <span className="font-medium">{currentTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">場所:</span>
                      <span className="font-medium">{currentPos.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">行動:</span>
                      <span className="font-medium">{currentPos.action}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">速度:</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${currentPos.speed * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{Math.round(currentPos.speed * 10)}/10</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">凡例</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">歩行</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">走行</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">ゆっくり歩行</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">食事</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">睡眠</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">グルーミング</span>
                </div>
              </div>
            </div>

            {/* Voice Logs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">鳴き声ログ</h3>
              <div className="space-y-3">
                {voiceLogs
                  .filter(voice => timeToMinutes(voice.time) <= timeToMinutes(currentTime))
                  .map((voice, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors"
                      onClick={() => setSelectedVoice(voice)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{voice.time}</span>
                        <Volume2 className="w-4 h-4 text-pink-500" />
                      </div>
                      <p className="text-sm text-gray-600">{voice.interpretation}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Movement Point Detail */}
        {selectedPoint && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPoint(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">移動ポイント詳細</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>時刻:</span>
                  <span className="font-medium">{selectedPoint.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>場所:</span>
                  <span className="font-medium">{selectedPoint.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>行動:</span>
                  <span className="font-medium">{selectedPoint.action}</span>
                </div>
                <div className="flex justify-between">
                  <span>速度:</span>
                  <span className="font-medium">{selectedPoint.speed.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>座標:</span>
                  <span className="font-medium">({selectedPoint.x}, {selectedPoint.y})</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Stay Point Detail */}
        {selectedStayPoint && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStayPoint(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedStayPoint.icon}</div>
                <h3 className="text-xl font-bold mb-4">{selectedStayPoint.location}</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>滞在時間:</span>
                    <span className="font-medium">{Math.floor(selectedStayPoint.duration / 60)}分</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>活動:</span>
                    <span className="font-medium">{selectedStayPoint.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>座標:</span>
                    <span className="font-medium">({selectedStayPoint.x}, {selectedStayPoint.y})</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStayPoint(null)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Voice Log Detail */}
        {selectedVoice && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVoice(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <Volume2 className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">鳴き声詳細</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>時刻:</span>
                    <span className="font-medium">{selectedVoice.time}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>場所:</span>
                    <span className="font-medium">({selectedVoice.x}, {selectedVoice.y})</span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-600 mb-2">AI解釈:</span>
                    <p className="text-gray-800 font-medium">{selectedVoice.interpretation}</p>
                  </div>
                  <button className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-2">
                    <Volume2 className="w-4 h-4 inline mr-2" />
                    音声を再生
                  </button>
                </div>
                <button
                  onClick={() => setSelectedVoice(null)}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}