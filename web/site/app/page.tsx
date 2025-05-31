'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Cat, Clock, Activity, TrendingUp, Moon, Sun, Coffee, Heart, MapPin, Volume2 } from 'lucide-react';

type Activity = {
  time: string;
  endTime: string;
  activity: string;
  emoji: string;
  title: string;
  description: string;
  location: string;
  locationIcon: string;
  duration: string;
};

type MeowLog = {
  time: string;
  type: string;
  interpretation: string;
  confidence: number;
};

// Mock data for Nel-chan's activities with locations
const activities: Activity[] = [
  { 
    time: '22:00', endTime: '06:00', activity: 'sleep', emoji: '😴', title: '就寝', 
    description: 'ぐっすり眠っています', location: 'ベッドルーム', locationIcon: '🛏️', duration: '8時間'
  },
  { 
    time: '06:00', endTime: '07:30', activity: 'sleep', emoji: '😴', title: '熟睡中', 
    description: 'まだ眠っています', location: 'ベッドルーム', locationIcon: '🛏️', duration: '1時間30分'
  },
  { 
    time: '07:30', endTime: '08:00', activity: 'wake', emoji: '😊', title: '起床', 
    description: 'おはよう！目が覚めました', location: 'ベッドルーム', locationIcon: '🛏️', duration: '30分'
  },
  { 
    time: '08:00', endTime: '08:30', activity: 'eat', emoji: '🍽️', title: '朝ごはん', 
    description: 'カリカリを食べています', location: 'キッチン', locationIcon: '🍽️', duration: '30分'
  },
  { 
    time: '08:30', endTime: '09:00', activity: 'groom', emoji: '🧼', title: 'グルーミング', 
    description: '食後の毛づくろい', location: 'リビング', locationIcon: '🛋️', duration: '30分'
  },
  { 
    time: '09:00', endTime: '11:00', activity: 'play', emoji: '🎾', title: '遊び', 
    description: 'ボールで元気に遊んでいます', location: 'リビング', locationIcon: '🛋️', duration: '2時間'
  },
  { 
    time: '11:00', endTime: '13:00', activity: 'nap', emoji: '😴', title: '昼寝', 
    description: '窓際で日向ぼっこしながらうとうと', location: '窓際', locationIcon: '🪟', duration: '2時間'
  },
  { 
    time: '13:00', endTime: '15:00', activity: 'explore', emoji: '🚶', title: '探検', 
    description: '家の中を巡回中', location: '家全体', locationIcon: '🏠', duration: '2時間'
  },
  { 
    time: '15:00', endTime: '17:00', activity: 'play', emoji: '🐾', title: '遊び', 
    description: 'ねこじゃらしで遊んでいます', location: 'リビング', locationIcon: '🛋️', duration: '2時間'
  },
  { 
    time: '17:00', endTime: '18:00', activity: 'groom', emoji: '🧼', title: 'グルーミング', 
    description: '夕方の毛づくろいタイム', location: 'リビング', locationIcon: '🛋️', duration: '1時間'
  },
  { 
    time: '18:00', endTime: '18:30', activity: 'eat', emoji: '🍽️', title: '夕ごはん', 
    description: 'おいしそうに食べています', location: 'キッチン', locationIcon: '🍽️', duration: '30分'
  },
  { 
    time: '18:30', endTime: '20:00', activity: 'cuddle', emoji: '💕', title: 'スキンシップ', 
    description: 'なでなでタイム', location: 'ソファ', locationIcon: '🛋️', duration: '1時間30分'
  },
];

// Mock meow logs
const meowLogs: MeowLog[] = [
  { time: '07:45', type: '要求', interpretation: 'ごはんが欲しいサインです', confidence: 85 },
  { time: '12:30', type: '挨拶', interpretation: '飼い主さんに挨拶しています', confidence: 92 },
  { time: '17:45', type: '注意喚起', interpretation: 'ごはんの時間を知らせています', confidence: 88 },
  { time: '19:30', type: 'コミュニケーション', interpretation: '甘えたい気持ちを表現しています', confidence: 90 },
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
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Find current activity based on time
    const current = activities.find(activity => {
      const activityTime = activity.time;
      const endTime = activity.endTime;
      return currentTimeStr >= activityTime && currentTimeStr < endTime;
    });
    
    return current || activities[activities.length - 1]; // Default to last activity if not found
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
            className="inline-flex items-center space-x-6 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl max-w-2xl mx-auto"
            animate={{ 
              scale: [1, 1.02, 1],
              transition: { duration: 4, repeat: Infinity }
            }}
          >
            <span className="text-6xl animate-float">{getCurrentActivity().emoji}</span>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{getCurrentActivity().title}</h2>
              <p className="text-white/80 mb-3">{getCurrentActivity().description}</p>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{getCurrentActivity().location}</span>
                  <span className="text-lg">{getCurrentActivity().locationIcon}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{getCurrentActivity().duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Timeline */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              今日の活動記録
              <span className="text-sm font-normal text-white/70 ml-2">（最新から表示）</span>
            </h3>
            
            {/* Timeline Container */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {[...activities].reverse().map((activity, index) => {
                const relatedMeows = meowLogs.filter(meow => {
                  const meowTime = meow.time;
                  return meowTime >= activity.time && meowTime <= activity.endTime;
                });
                
                return (
                  <motion.div
                    key={`${activity.time}-${index}`}
                    className="bg-white/15 backdrop-blur-md rounded-xl p-4 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedActivity(activity)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                          {activity.emoji}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-0.5 h-8 bg-white/20 mt-2"></div>
                        )}
                      </div>
                      
                      {/* Activity content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-white font-semibold">{activity.title}</h4>
                            <span className="text-white/60 text-sm">{activity.time} - {activity.endTime}</span>
                            <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white/80">
                              {activity.duration}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-white/80 text-sm mb-3">{activity.description}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2 text-white/70">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{activity.location}</span>
                            <span>{activity.locationIcon}</span>
                          </div>
                        </div>
                        
                        {/* Meow logs for this activity */}
                        {relatedMeows.length > 0 && (
                          <div className="space-y-2">
                            {relatedMeows.map((meow, meowIndex) => (
                              <motion.div
                                key={meowIndex}
                                className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 ml-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + meowIndex * 0.1 }}
                              >
                                <div className="flex items-start space-x-2">
                                  <Volume2 className="w-4 h-4 text-blue-300 mt-0.5" />
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-blue-200 font-medium text-sm">{meow.time} 鳴き声</span>
                                      <span className="bg-blue-500/30 px-2 py-0.5 rounded-full text-xs text-blue-200">
                                        {meow.type}
                                      </span>
                                      <span className="text-blue-300/70 text-xs">
                                        確信度: {meow.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-blue-100 text-sm">{meow.interpretation}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Activity Chart */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              活動レベル
            </h3>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'white' }} />
                  <YAxis hide />
                  <Bar dataKey="activity" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Meow Summary */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                鳴き声サマリー
              </h4>
              <div className="space-y-2">
                {meowLogs.map((meow, index) => (
                  <div key={index} className="text-white/80 text-sm">
                    <span className="font-medium">{meow.time}</span>: {meow.type}
                  </div>
                ))}
              </div>
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
            今日のねるちゃん - AI分析
          </h3>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">📊 行動パターン分析</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                今日のねるちゃんは健康的な一日を過ごしています。リビングでの活動時間が長く、
                窓際での日向ぼっこも十分取れており、ストレスレベルは低めです。
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">🔊 鳴き声分析</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                本日は{meowLogs.length}回の鳴き声を検出しました。主に食事の要求や甘えたい気持ちの表現で、
                攻撃的な鳴き声は記録されていません。コミュニケーション欲求が高い一日でした。
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">🏠 居場所の傾向</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                リビングとキッチンでの滞在時間が多く、社交的な様子が伺えます。
                ベッドルームでの休息もしっかり取れており、生活リズムは良好です。💕
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation to LP */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a 
            href="/lp"
            className="inline-flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            <span>CatSenseについて詳しく</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
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
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedActivity.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedActivity.title}</h3>
                <div className="flex justify-center items-center space-x-4 text-gray-600 mb-4">
                  <span>{selectedActivity.time} - {selectedActivity.endTime}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">{selectedActivity.duration}</span>
                </div>
                <p className="text-gray-800 mb-6">{selectedActivity.description}</p>
                
                {/* Location Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    居場所
                  </h4>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">{selectedActivity.locationIcon}</span>
                    <span className="font-medium text-gray-700">{selectedActivity.location}</span>
                  </div>
                </div>
                
                {/* Sensor Data */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-3">センサーデータ</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.floor(Math.random() * 10) + 1}/10
                      </div>
                      <div className="text-sm text-gray-600">活動量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {Math.floor(Math.random() * 50) + 120}
                      </div>
                      <div className="text-sm text-gray-600">心拍数 (bpm)</div>
                    </div>
                  </div>
                </div>
                
                {/* Meow logs for this activity */}
                {(() => {
                  const relatedMeows = meowLogs.filter(meow => {
                    return meow.time >= selectedActivity.time && meow.time <= selectedActivity.endTime;
                  });
                  
                  if (relatedMeows.length > 0) {
                    return (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Volume2 className="w-4 h-4 mr-2" />
                          この時間の鳴き声記録
                        </h4>
                        <div className="space-y-2">
                          {relatedMeows.map((meow, index) => (
                            <div key={index} className="bg-white rounded p-3 text-left">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-blue-600">{meow.time}</span>
                                <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                                  {meow.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{meow.interpretation}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                確信度: {meow.confidence}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
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