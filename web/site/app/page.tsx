'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Heart, Moon, Coffee, Play, MapPin, TrendingUp, Sparkles } from 'lucide-react';

// Mock activity data
const mockActivities = [
  { time: 6, activity: 'sleep', emoji: '😴', intensity: 10, description: '深い眠り' },
  { time: 7, activity: 'wake', emoji: '😺', intensity: 3, description: 'のそのそ起床' },
  { time: 8, activity: 'eat', emoji: '🍽️', intensity: 8, description: 'モーニングごはん' },
  { time: 9, activity: 'play', emoji: '🎾', intensity: 7, description: 'おもちゃで遊び' },
  { time: 10, activity: 'groom', emoji: '🐱', intensity: 5, description: '毛づくろいタイム' },
  { time: 11, activity: 'nap', emoji: '😴', intensity: 8, description: '朝寝' },
  { time: 12, activity: 'explore', emoji: '🔍', intensity: 6, description: '探検モード' },
  { time: 13, activity: 'eat', emoji: '🍽️', intensity: 7, description: 'ランチ' },
  { time: 14, activity: 'sunbathe', emoji: '☀️', intensity: 9, description: '日向ぼっこ' },
  { time: 15, activity: 'play', emoji: '🏃', intensity: 8, description: 'アクティブタイム' },
  { time: 16, activity: 'rest', emoji: '😌', intensity: 4, description: 'のんびり' },
  { time: 17, activity: 'watch', emoji: '👁️', intensity: 3, description: '窓の外を観察' },
  { time: 18, activity: 'eat', emoji: '🍽️', intensity: 8, description: '夕ごはん' },
  { time: 19, activity: 'play', emoji: '🎯', intensity: 9, description: '夕方の運動' },
  { time: 20, activity: 'social', emoji: '💕', intensity: 6, description: '甘えタイム' },
  { time: 21, activity: 'groom', emoji: '🐱', intensity: 5, description: '夜の身だしなみ' },
  { time: 22, activity: 'rest', emoji: '😴', intensity: 7, description: '就寝準備' },
  { time: 23, activity: 'sleep', emoji: '🌙', intensity: 10, description: 'ぐっすり就寝' },
];

function getTimeBasedGradient(hour: number) {
  if (hour >= 6 && hour < 12) return 'from-orange-200 to-yellow-200'; // Morning
  if (hour >= 12 && hour < 18) return 'from-blue-200 to-blue-300'; // Afternoon  
  if (hour >= 18 && hour < 22) return 'from-purple-200 to-pink-200'; // Evening
  return 'from-indigo-300 to-purple-400'; // Night
}

function getCurrentTimeActivity() {
  const currentHour = new Date().getHours();
  return mockActivities.find(a => a.time === currentHour) || mockActivities[0];
}

function CatAvatar({ activity, isActive }: { activity: any; isActive: boolean }) {
  const animations = {
    sleep: { rotate: [0, -10, 0], scale: [1, 0.95, 1] },
    wake: { y: [0, -5, 0], rotate: [0, 5, -5, 0] },
    eat: { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] },
    play: { rotate: [0, 360], scale: [1, 1.2, 1] },
    groom: { rotate: [0, -15, 15, 0] },
    rest: { y: [0, -3, 0], scale: [1, 1.05, 1] },
  };

  return (
    <motion.div
      className={`text-6xl ${isActive ? 'scale-125' : 'scale-100'}`}
      animate={isActive ? animations[activity.activity as keyof typeof animations] || { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {activity.emoji}
    </motion.div>
  );
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentActivity = getCurrentTimeActivity();
  const currentHour = currentTime.getHours();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTimeBasedGradient(currentHour)} transition-all duration-1000`}>
      {/* Header */}
      <header className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Sparkles className="text-purple-600" size={32} />
          <h1 className="text-4xl font-bold text-gray-800">ねるちゃんの一日</h1>
          <Sparkles className="text-purple-600" size={32} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <Clock className="text-gray-600" size={20} />
          <span className="text-lg text-gray-700">
            {currentTime.toLocaleTimeString('ja-JP')} 
          </span>
          <span className="text-sm bg-white/70 px-3 py-1 rounded-full">
            {currentActivity.description}
          </span>
        </motion.div>

        <nav className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 hover:bg-white px-4 py-2 rounded-full text-gray-700 font-medium"
          >
            今日のタイムライン
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium"
            onClick={() => window.open('/lp', '_blank')}
          >
            CatSense について
          </motion.button>
        </nav>
      </header>

      {/* Main Cat Avatar */}
      <section className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="mb-6"
        >
          <CatAvatar activity={currentActivity} isActive={true} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-md shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">いまの様子</h3>
          <p className="text-gray-600 mb-4">{currentActivity.description}</p>
          <div className="flex items-center justify-center gap-4">
            <Heart className="text-red-500" size={20} />
            <span className="text-sm text-gray-600">活動レベル: {currentActivity.intensity}/10</span>
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">一日のタイムライン</h2>
            
            {/* Timeline Scroll */}
            <div className="relative mb-8">
              <div className="flex gap-2 overflow-x-auto pb-4 px-4">
                {mockActivities.map((activity, index) => (
                  <motion.div
                    key={activity.time}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.05 }}
                    className={`flex-shrink-0 w-24 h-32 rounded-2xl p-3 cursor-pointer transition-all ${
                      activity.time === currentHour 
                        ? 'bg-purple-600 text-white scale-110 shadow-lg' 
                        : 'bg-white/80 hover:bg-white text-gray-700 hover:scale-105'
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium mb-1">{activity.time}:00</div>
                      <div className="text-2xl mb-1">{activity.emoji}</div>
                      <div className="text-xs">{activity.activity}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Current Time Marker */}
              <motion.div
                className="absolute top-0 w-1 h-full bg-purple-600 rounded-full shadow-lg"
                style={{ left: `${(currentHour / 24) * 100}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="absolute -top-6 -left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  NOW
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} />
              活動レベル
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockActivities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [value, '活動レベル']}
                    labelFormatter={(label) => `${label}:00`}
                  />
                  <Bar dataKey="intensity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles size={24} />
              今日のねるちゃんAI分析
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl mb-2">😴</div>
                <div className="text-sm opacity-90">睡眠時間</div>
                <div className="text-xl font-bold">8時間</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl mb-2">🎾</div>
                <div className="text-sm opacity-90">運動時間</div>
                <div className="text-xl font-bold">3時間</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl mb-2">💝</div>
                <div className="text-sm opacity-90">機嫌</div>
                <div className="text-xl font-bold">とても良好</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <p className="text-sm leading-relaxed">
                今日のねるちゃんは理想的な一日を過ごしています！
                朝の運動から日向ぼっこ、そして夕方の活発な遊びまで、
                バランスの取れた活動パターンです。
                特に14時の日向ぼっこは満足度MAXでした🌟
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedActivity.emoji}</div>
                <h3 className="text-xl font-bold">{selectedActivity.time}:00 の様子</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">{selectedActivity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">活動レベル</span>
                  <span className="font-bold">{selectedActivity.intensity}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">カテゴリ</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {selectedActivity.activity}
                  </span>
                </div>
              </div>
              <button
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium"
                onClick={() => setSelectedActivity(null)}
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}