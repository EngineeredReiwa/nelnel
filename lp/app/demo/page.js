'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, Heart, Volume2, MapPin, Zap } from 'lucide-react';

// サンプルデータ: ねるちゃんの一日の行動
const catActivities = [
  { time: '06:00', activity: 'sleep', emoji: '😴', title: '熟睡中', description: 'ベッドの隅でぐっすり', color: 'bg-blue-200', intensity: 9 },
  { time: '07:30', activity: 'wake', emoji: '😸', title: '起床', description: 'のび〜っと伸びをして', color: 'bg-yellow-200', intensity: 3 },
  { time: '08:00', activity: 'eat', emoji: '🍽️', title: 'ごはんタイム', description: 'モリモリ食べてる', color: 'bg-green-200', intensity: 7 },
  { time: '08:30', activity: 'groom', emoji: '🧼', title: '毛づくろい', description: 'きれいきれい', color: 'bg-pink-200', intensity: 5 },
  { time: '09:00', activity: 'play', emoji: '🎾', title: 'おもちゃ遊び', description: 'ボールを追いかけて', color: 'bg-orange-200', intensity: 8 },
  { time: '10:00', activity: 'sunbath', emoji: '☀️', title: '日向ぼっこ', description: '窓際でまったり', color: 'bg-yellow-100', intensity: 2 },
  { time: '12:00', activity: 'nap', emoji: '😴', title: 'お昼寝', description: 'ソファの上で', color: 'bg-blue-100', intensity: 8 },
  { time: '14:00', activity: 'explore', emoji: '🔍', title: '探検タイム', description: '家の中をパトロール', color: 'bg-purple-200', intensity: 6 },
  { time: '15:30', activity: 'call', emoji: '🗣️', title: '甘え鳴き', description: '「遊んで〜」のサイン', color: 'bg-red-200', intensity: 4 },
  { time: '17:00', activity: 'play', emoji: '🏃', title: '運動モード', description: 'キャットタワーでジャンプ', color: 'bg-orange-300', intensity: 9 },
  { time: '18:00', activity: 'eat', emoji: '🍽️', title: '夕ごはん', description: '今日も完食！', color: 'bg-green-300', intensity: 7 },
  { time: '19:00', activity: 'social', emoji: '💕', title: 'まったりタイム', description: '飼い主にすりすり', color: 'bg-pink-300', intensity: 3 },
  { time: '20:00', activity: 'groom', emoji: '🧼', title: '夜の毛づくろい', description: 'お手入れタイム', color: 'bg-pink-100', intensity: 5 },
  { time: '22:00', activity: 'sleep', emoji: '😴', title: '就寝準備', description: 'お気に入りの場所へ', color: 'bg-blue-300', intensity: 8 }
];

// 時間帯による背景色の変化
const getTimeBasedGradient = (currentHour) => {
  if (currentHour >= 6 && currentHour < 12) {
    return 'from-orange-100 via-yellow-50 to-blue-50'; // 朝
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'from-yellow-50 via-orange-50 to-red-50'; // 昼
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'from-red-50 via-purple-50 to-blue-100'; // 夕方
  } else {
    return 'from-blue-100 via-indigo-100 to-purple-200'; // 夜
  }
};

// 猫のアバターコンポーネント
const CatAvatar = ({ activity, size = 'large' }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  const activityAnimations = {
    sleep: { rotate: [0, -5, 0], scale: [1, 1.05, 1] },
    wake: { y: [0, -10, 0], rotate: [0, 10, -10, 0] },
    eat: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
    play: { rotate: [0, 360], scale: [1, 1.2, 1] },
    groom: { rotate: [0, 15, -15, 0] },
    default: { y: [0, -5, 0] }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} inline-block`}
      animate={activityAnimations[activity] || activityAnimations.default}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      🐱
    </motion.div>
  );
};

// 時間マーカーコンポーネント
const TimeMarker = ({ currentTime, isActive }) => {
  return (
    <motion.div
      className={`flex flex-col items-center ${isActive ? 'z-10' : 'z-0'}`}
      animate={isActive ? { scale: 1.1, y: [0, -5, 0] } : { scale: 1 }}
      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
    >
      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500 shadow-lg' : 'bg-gray-300'}`} />
      <div className={`text-sm mt-1 ${isActive ? 'font-bold text-red-600' : 'text-gray-500'}`}>
        {currentTime}
      </div>
    </motion.div>
  );
};

// 行動カードコンポーネント
const ActivityCard = ({ activity, isActive, onClick }) => {
  return (
    <motion.div
      className={`p-4 rounded-2xl cursor-pointer transition-all ${activity.color} ${
        isActive ? 'ring-4 ring-purple-400 shadow-lg scale-105' : 'hover:shadow-md'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{activity.emoji}</span>
        <span className="font-bold text-gray-800">{activity.title}</span>
      </div>
      <p className="text-sm text-gray-600">{activity.description}</p>
      <div className="mt-2 text-xs text-gray-500">{activity.time}</div>
    </motion.div>
  );
};

export default function NelTimelineDemo() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const timelineRef = useRef(null);

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 現在時刻に近い活動を見つける
  const getCurrentActivity = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    let closestActivity = catActivities[0];
    let minDiff = Infinity;

    catActivities.forEach(activity => {
      const [hours, minutes] = activity.time.split(':').map(Number);
      const activityTime = hours * 60 + minutes;
      const diff = Math.abs(now - activityTime);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestActivity = activity;
      }
    });

    return closestActivity;
  };

  const currentActivity = getCurrentActivity();
  const currentHour = currentTime.getHours();

  // グラフ用のデータ準備
  const chartData = catActivities.map(activity => ({
    time: activity.time,
    intensity: activity.intensity,
    name: activity.title
  }));

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTimeBasedGradient(currentHour)} transition-all duration-1000`}>
      
      {/* ヘッダー */}
      <header className="px-4 py-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            ねるちゃんの一日 🐾
          </h1>
          <p className="text-lg text-gray-600">
            現在時刻: {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      </header>

      {/* 現在の行動ハイライト */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center justify-center gap-4">
              <CatAvatar activity={currentActivity.activity} size="large" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  いま: {currentActivity.title}
                </h2>
                <p className="text-gray-600">{currentActivity.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* タイムライン */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            今日のタイムライン
          </h3>
          
          {/* 時間軸 */}
          <div className="relative overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-full px-4">
              {catActivities.map((activity, index) => (
                <TimeMarker
                  key={activity.time}
                  currentTime={activity.time}
                  isActive={activity === currentActivity}
                />
              ))}
            </div>
            
            {/* 行動バー */}
            <div className="mt-8 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="intensity" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 行動カードグリッド */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {catActivities.map((activity, index) => (
              <ActivityCard
                key={activity.time}
                activity={activity}
                isActive={activity === currentActivity}
                onClick={() => setSelectedActivity(activity)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedActivity.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedActivity.title}
                </h3>
                <p className="text-gray-600 mb-4">{selectedActivity.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {selectedActivity.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={16} />
                    活動度: {selectedActivity.intensity}/10
                  </div>
                </div>
                <button
                  className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
                  onClick={() => setSelectedActivity(null)}
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI要約 */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">今日のねるちゃんまとめ</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>• 朝はしっかり起きて、ごはんもモリモリ食べました</p>
              <p>• 日中は適度に遊んで、日向ぼっこでリラックス</p>
              <p>• 夕方の運動タイムは特に活発でした</p>
              <p>• 飼い主さんとのふれあい時間も大満足</p>
            </div>
            <div className="mt-4 text-sm text-purple-600 font-semibold">
              ねるちゃんは今日も元気に過ごしています 😊
            </div>
          </motion.div>
        </div>
      </section>

      {/* ナビゲーション */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-4">
            <button
              className="text-purple-600 hover:text-purple-800 transition-colors"
              onClick={() => setAutoScroll(!autoScroll)}
            >
              {autoScroll ? '⏸️' : '▶️'} 自動追跡
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <a 
              href="/"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← メインページに戻る
            </a>
          </div>
        </motion.div>
      </div>

    </div>
  );
}