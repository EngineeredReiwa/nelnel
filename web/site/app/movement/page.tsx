'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat, Volume2, Home, Clock } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play on load
  const [selectedPoint, setSelectedPoint] = useState<MovementPoint | null>(null);
  const [selectedStayPoint, setSelectedStayPoint] = useState<StayPoint | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceLog | null>(null);
  const [timeSliderValue, setTimeSliderValue] = useState(0);

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

  // Auto-play functionality (4 hours → 20 seconds playback)
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        setTimeSliderValue(prev => {
          const next = prev + 1; // 1分ずつ進める
          if (next > 240) { // 12:00 (240分) まで (08:00から4時間)
            setIsPlaying(true); // Loop back to start
            setCurrentTime('08:00');
            return 0;
          }
          setCurrentTime(minutesToTime(480 + next)); // 08:00 (480分) から開始
          return next;
        });
      }, 83); // 83ms ≈ 0.083秒 (1分 = 0.083秒, 20秒/240分)
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
    setIsPlaying(true); // Restart playback when user interacts with slider
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

  // Get action emoji
  const getActionEmoji = (action: string) => {
    const emojis = {
      walking: '🚶',
      running: '🏃',
      slow_walk: '🚶',
      eating: '🍚',
      sleeping: '😴',
      grooming: '🧶',
      exploring: '🔍',
      resting: '😴',
    };
    return emojis[action as keyof typeof emojis] || '🐈';
  };

  // Get opacity based on time (past = 1.0, future = 0.3)
  const getOpacityForTime = (pointTime: string) => {
    const currentMinutes = timeToMinutes(currentTime);
    const pointMinutes = timeToMinutes(pointTime);
    return pointMinutes <= currentMinutes ? 1.0 : 0.3;
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
          <div className="flex flex-col items-center">
            {/* Time Slider */}
            <div className="w-full max-w-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                時間: {currentTime}
              </label>
              <input
                type="range"
                min="0"
                max="240"
                step="1"
                value={timeSliderValue}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>08:00</span>
                <span>12:00</span>
              </div>
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

                  {/* Movement Path - Always visible */}
                  <path
                    d={getMovementPath()}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Movement Points */}
                  {movementData.map((point, index) => {
                    const isCurrentPosition = index === getCurrentMovementPoints().length - 1 && 
                                            timeToMinutes(point.time) <= timeToMinutes(currentTime);
                    const opacity = getOpacityForTime(point.time);
                    
                    return (
                      <g key={index} opacity={opacity}>
                        {isCurrentPosition ? (
                          <motion.g
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="20"
                              fill="rgba(251, 115, 22, 0.2)"
                              className="cursor-pointer"
                              onClick={() => setSelectedPoint(point)}
                            />
                            <text
                              x={point.x}
                              y={point.y + 5}
                              textAnchor="middle"
                              fontSize="20"
                              className="pointer-events-none"
                            >
                              {getActionEmoji(point.action)}
                            </text>
                          </motion.g>
                        ) : (
                          <>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="15"
                              fill="transparent"
                              className="cursor-pointer hover:fill-gray-100"
                              onClick={() => setSelectedPoint(point)}
                            />
                            <text
                              x={point.x}
                              y={point.y + 5}
                              textAnchor="middle"
                              fontSize="16"
                              className="pointer-events-none"
                            >
                              {getActionEmoji(point.action)}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}

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
                  {voiceLogs.map((voice, index) => {
                    const opacity = getOpacityForTime(voice.time);
                    return (
                      <g key={index} opacity={opacity}>
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
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">凡例</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🚶</span>
                  <span className="text-sm">移動</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🏃</span>
                  <span className="text-sm">走る</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🍚</span>
                  <span className="text-sm">食事</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">😴</span>
                  <span className="text-sm">睡眠</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🧶</span>
                  <span className="text-sm">グルーミング</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔍</span>
                  <span className="text-sm">探索</span>
                </div>
              </div>
            </div>

            {/* Voice Logs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">鳴き声ログ</h3>
              <div className="space-y-3">
                {voiceLogs.map((voice, index) => {
                  const opacity = getOpacityForTime(voice.time);
                  return (
                    <div 
                      key={index}
                      className="p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors"
                      style={{ opacity }}
                      onClick={() => setSelectedVoice(voice)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{voice.time}</span>
                        <Volume2 className="w-4 h-4 text-pink-500" />
                      </div>
                      <p className="text-sm text-gray-600">{voice.interpretation}</p>
                    </div>
                  );
                })}
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