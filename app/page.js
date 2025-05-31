'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, Heart, Home, Coffee, Play, Moon, Sun, Sunset } from 'lucide-react';
import Link from 'next/link';

// Mock data for Nel-chan's daily activities
const activities = [
  { time: '06:00', activity: 'sleep', icon: Moon, intensity: 1, emoji: '😴', description: '深い眠り' },
  { time: '07:30', activity: 'wake', icon: Sun, intensity: 3, emoji: '😸', description: '起床・のび〜' },
  { time: '08:00', activity: 'eat', icon: Coffee, intensity: 4, emoji: '🥣', description: '朝ごはん' },
  { time: '09:00', activity: 'play', icon: Play, intensity: 5, emoji: '🐾', description: '元気な遊び時間' },
  { time: '11:00', activity: 'groom', icon: Heart, intensity: 2, emoji: '🧼', description: '毛づくろい' },
  { time: '13:00', activity: 'nap', icon: Moon, intensity: 1, emoji: '💤', description: 'お昼寝' },
  { time: '15:00', activity: 'explore', icon: Home, intensity: 3, emoji: '🔍', description: '探検タイム' },
  { time: '17:00', activity: 'play', icon: Play, intensity: 4, emoji: '🎾', description: '夕方の運動' },
  { time: '18:30', activity: 'eat', icon: Coffee, intensity: 4, emoji: '🍖', description: '夕ごはん' },
  { time: '20:00', activity: 'cuddle', icon: Heart, intensity: 3, emoji: '🥰', description: '甘え時間' },
  { time: '22:00', activity: 'sleep', icon: Moon, intensity: 1, emoji: '🌙', description: '就寝準備' },
];

const getTimeBasedGradient = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return 'from-orange-200 via-yellow-100 to-blue-100'; // Morning
  } else if (hour >= 12 && hour < 17) {
    return 'from-blue-100 via-cyan-100 to-blue-200'; // Afternoon
  } else if (hour >= 17 && hour < 20) {
    return 'from-orange-300 via-pink-200 to-purple-200'; // Evening
  } else {
    return 'from-purple-900 via-blue-900 to-indigo-900'; // Night
  }
};

const CatAvatar = ({ currentActivity }) => {
  const avatarVariants = {
    sleep: { rotate: 90, scale: 0.8 },
    wake: { rotate: 0, scale: 1.1, y: -5 },
    eat: { rotate: 0, scale: 1, y: 0 },
    play: { rotate: [0, -5, 5, 0], scale: 1.2 },
    groom: { rotate: 0, scale: 1, y: 0 },
    nap: { rotate: 45, scale: 0.9 },
    explore: { x: [0, 10, -10, 0], scale: 1 },
    cuddle: { scale: 1.3, rotate: 0 }
  };

  return (
    <motion.div
      className="text-6xl md:text-8xl"
      animate={avatarVariants[currentActivity] || {}}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    >
      🐱
    </motion.div>
  );
};

const Timeline = ({ currentTime, activities, onActivitySelect }) => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center min-w-max space-x-4 px-4">
        {activities.map((activity, index) => {
          const isActive = activity.time === currentTime;
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.time}
              className={`flex flex-col items-center cursor-pointer p-3 rounded-xl transition-all ${
                isActive ? 'bg-purple-200 shadow-lg' : 'bg-white/80 hover:bg-purple-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onActivitySelect(activity)}
            >
              <div className="text-xs font-medium text-gray-600 mb-1">{activity.time}</div>
              <div className={`p-2 rounded-full ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                <Icon size={16} />
              </div>
              <div className="text-lg mt-1">{activity.emoji}</div>
              <div className="h-2 w-12 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${activity.intensity * 20}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityModal = ({ activity, isOpen, onClose }) => {
  if (!activity) return null;

  const chartData = [
    { name: '活動度', value: activity.intensity * 20 },
    { name: '興奮度', value: activity.intensity * 15 },
    { name: '満足度', value: activity.intensity * 18 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{activity.time}の活動</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{activity.emoji}</div>
              <h4 className="text-lg font-semibold text-purple-700">{activity.description}</h4>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-600 mb-3">活動データ</h5>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Bar dataKey="value" fill="#7c3aed" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <h5 className="text-sm font-medium text-purple-800 mb-2">詳細情報</h5>
              <p className="text-sm text-gray-700">
                この時間帯のねるちゃんは{activity.description}をしていました。
                センサーデータから読み取った活動レベルは{activity.intensity}/5です。
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState('08:00');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30}`.slice(0, 5);
      
      // Find closest activity time
      const closest = activities.find(a => a.time >= timeString) || activities[0];
      setCurrentTime(closest.time);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentActivity = activities.find(a => a.time === currentTime) || activities[0];

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTimeBasedGradient()} transition-all duration-1000`}>
      {/* Header */}
      <header className="relative z-10 p-6 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ねるちゃんの一日
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          リアルタイムで追体験する、愛猫の暮らし
        </motion.p>
        
        {/* Navigation */}
        <nav className="flex justify-center space-x-4 mb-8">
          <Link 
            href="/lp" 
            className="bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            製品について
          </Link>
        </nav>
      </header>

      {/* Current Time Indicator */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="inline-flex items-center bg-white/90 rounded-full px-6 py-3 shadow-lg">
          <Clock className="mr-2 text-purple-600" size={20} />
          <span className="text-xl font-semibold text-gray-800">現在時刻: {currentTime}</span>
        </div>
      </motion.div>

      {/* Cat Avatar */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <CatAvatar currentActivity={currentActivity.activity} />
        <motion.p 
          className="text-xl font-medium text-gray-700 mt-4"
          key={currentActivity.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {currentActivity.description}中...
        </motion.p>
      </motion.div>

      {/* Timeline */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">今日のタイムライン</h2>
        <Timeline 
          currentTime={currentTime} 
          activities={activities} 
          onActivitySelect={handleActivitySelect}
        />
      </motion.div>

      {/* Activity Grid */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">活動サマリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {activities.slice(0, 6).map((activity, index) => (
            <motion.div
              key={activity.time}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ y: -5 }}
              onClick={() => handleActivitySelect(activity)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl mb-2">{activity.emoji}</div>
              <div className="text-sm font-medium text-gray-700">{activity.time}</div>
              <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Summary */}
      <motion.div 
        className="max-w-4xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="mr-2 text-pink-500" size={24} />
            今日のねるちゃんまとめ
          </h3>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>朝から元気に起きて、しっかり朝ごはんを完食</span>
            </p>
            <p className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>午前中は活発に遊んで、適度な運動ができている</span>
            </p>
            <p className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>お昼寝もしっかりとれて、リラックスして過ごしている</span>
            </p>
            <p className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>夕方の甘え時間では、とても満足そうな様子</span>
            </p>
          </div>
          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-800">
              💡 <strong>AI分析:</strong> ねるちゃんは今日も健康的で規則正しい一日を過ごしています。
              活動と休息のバランスが良く、ストレス指数も低めです。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Activity Detail Modal */}
      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="text-center p-8 text-gray-600">
        <p className="text-sm">
          🐾 このデモは仮想的なデータを使用しています。実際のnelnelデバイスではリアルタイムセンサーデータを活用します。
        </p>
      </footer>
    </div>
  );
}