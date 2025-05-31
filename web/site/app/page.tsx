'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Cat, Clock, Activity, TrendingUp, Moon, Sun, Coffee, Heart } from 'lucide-react';

type Activity = {
  time: string;
  activity: string;
  emoji: string;
  title: string;
  description: string;
};

// Mock data for Nel-chan's activities
const activities :Activity[]= [
  { time: '06:00', activity: 'sleep', emoji: '😴', title: '熟睡中', description: 'ぐっすり眠っています' },
  { time: '07:30', activity: 'wake', emoji: '😊', title: '起床', description: 'おはよう！目が覚めました' },
  { time: '08:00', activity: 'eat', emoji: '🍽️', title: '朝ごはん', description: 'カリカリを食べています' },
  { time: '09:00', activity: 'play', emoji: '🎾', title: '遊び', description: 'ボールで遊んでいます' },
  { time: '11:00', activity: 'nap', emoji: '😴', title: '昼寝', description: '日向ぼっこしながらうとうと' },
  { time: '13:00', activity: 'explore', emoji: '🚶', title: '探検', description: '家の中を巡回中' },
  { time: '15:00', activity: 'play', emoji: '🐾', title: '遊び', description: 'ねこじゃらしで遊んでいます' },
  { time: '17:00', activity: 'groom', emoji: '🧼', title: 'グルーミング', description: '毛づくろいタイム' },
  { time: '18:00', activity: 'eat', emoji: '🍽️', title: '夕ごはん', description: 'おいしそうに食べています' },
  { time: '20:00', activity: 'cuddle', emoji: '💕', title: 'スキンシップ', description: 'なでなでタイム' },
  { time: '22:00', activity: 'sleep', emoji: '😴', title: '就寝', description: 'おやすみなさい' },
];

const activityData = [
  { time: '6h', activity: 4 },
  { time: '8h', activity: 8 },
  { time: '10h', activity: 6 },
  { time: '12h', activity: 3 },
  { time: '14h', activity: 7 },
  { time: '16h', activity: 9 },
  { time: '18h', activity: 5 },
  { time: '20h', activity: 4 },
  { time: '22h', activity: 2 },
];

export default function NelChanTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate timeline progression
      const hour = new Date().getHours();
      const activityIndex = activities.findIndex(activity => {
        const activityHour = parseInt(activity.time.split(':')[0]);
        return hour >= activityHour;
      });
      setCurrentActivityIndex(Math.max(0, activityIndex));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBackgroundGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'from-orange-200 to-yellow-200'; // Morning
    if (hour >= 12 && hour < 18) return 'from-blue-200 to-cyan-200'; // Afternoon
    if (hour >= 18 && hour < 22) return 'from-orange-300 to-pink-300'; // Evening
    return 'from-indigo-900 to-purple-900'; // Night
  };

  const getCurrentActivity = () => {
    return activities[currentActivityIndex] || activities[0];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Cat className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-white">ねるちゃんの一日</h1>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Clock className="w-5 h-5" />
              <span className="text-lg font-medium">
                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Current Activity Display */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-4 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl"
            animate={{ 
              scale: [1, 1.05, 1],
              transition: { duration: 3, repeat: Infinity }
            }}
          >
            <span className="text-6xl animate-float">{getCurrentActivity().emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{getCurrentActivity().title}</h2>
              <p className="text-white/80">{getCurrentActivity().description}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activities Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              今日の活動
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.time}
                  className={`bg-white/20 backdrop-blur-md rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    index === currentActivityIndex ? 'ring-2 ring-white animate-pulse-glow' : 'hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{activity.emoji}</div>
                    <div className="text-white font-medium">{activity.time}</div>
                    <div className="text-white/80 text-sm">{activity.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              活動レベル
            </h3>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'white' }} />
                  <YAxis hide />
                  <Bar dataKey="activity" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <motion.div 
          className="bg-white/20 backdrop-blur-md rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            今日のねるちゃん
          </h3>
          <p className="text-white/90 leading-relaxed">
            今日のねるちゃんは健康的な一日を過ごしています。朝はしっかりと目覚め、適度に遊び、
            十分な休息を取っています。活動レベルも正常範囲内で、ストレスの兆候は見られません。
            夕方の遊び時間が特に活発で、とても元気な様子です。💕
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="mt-8 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/movement"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors shadow-lg"
            >
              <span>動線マップを見る</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </a>
            
            <a 
              href="/room-setup"
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors shadow-lg"
            >
              <span>間取りを登録する</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
            
            <a 
              href="/lp"
              className="inline-flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              <span>CatSenseについて詳しく</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </main>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedActivity.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedActivity.title}</h3>
                <p className="text-gray-600 mb-4">{selectedActivity.time}</p>
                <p className="text-gray-800 mb-6">{selectedActivity.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">センサーデータ</p>
                  <div className="flex justify-between items-center mt-2">
                    <span>活動量:</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 10) + 1}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>心拍数:</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 50) + 120} bpm
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
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