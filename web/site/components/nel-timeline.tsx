'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, Heart, Activity, Zap, Calendar } from 'lucide-react'
import { generateTimelineData, formatTime, getTimeOfDay, type TimelineActivity } from '@/lib/utils'
import { ActivityChart } from './activity-chart'
import { MoodIndicator } from './mood-indicator'

export function NelTimeline() {
  const [timelineData, setTimelineData] = useState<TimelineActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<TimelineActivity | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    setTimelineData(generateTimelineData())
  }, [])

  useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate new activity every 5 seconds in demo mode
      if (Math.random() < 0.3) {
        setTimelineData(prev => [...prev.slice(-19), generateTimelineData()[0]])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const currentActivity = timelineData.find(activity => {
    const now = currentTime
    return activity.startTime <= now && activity.endTime >= now
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-float">🐱</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ネルちゃんタイムライン</h1>
                <p className="text-sm text-gray-600">リアルタイム行動監視デモ</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isLive 
                    ? 'bg-green-100 text-green-700 animate-pulse-glow' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isLive ? '🔴 LIVE' : '⏸️ PAUSED'}
              </button>
              <div className="text-right">
                <div className="text-lg font-mono text-gray-800">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600">
                  {getTimeOfDay(currentTime.getHours())}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current Activity Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                今の様子
              </h2>
              {currentActivity ? (
                <motion.div
                  key={currentActivity.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-6"
                >
                  <div className="text-6xl animate-timeline-pulse">
                    {currentActivity.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {currentActivity.activity}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(currentActivity.startTime)} - {formatTime(currentActivity.endTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {currentActivity.location}
                      </span>
                    </div>
                    <div className="mt-3">
                      <MoodIndicator mood={currentActivity.mood} color={currentActivity.color} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">😴</div>
                  <p>現在は活動していません</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                今日のタイムライン
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto timeline-scroll">
                <AnimatePresence>
                  {timelineData.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                        selectedActivity?.id === activity.id
                          ? 'bg-purple-100 border-2 border-purple-300'
                          : 'bg-white/50 border border-gray-200 hover:bg-white/80'
                      }`}
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="text-2xl">{activity.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{activity.activity}</h4>
                          <span className="text-sm text-gray-500">
                            {activity.duration}分
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>{formatTime(activity.startTime)}</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {activity.mood}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: activity.intensity }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: activity.color }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Chart */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                活動分布
              </h3>
              <ActivityChart data={timelineData} />
            </div>

            {/* Selected Activity Details */}
            <AnimatePresence>
              {selectedActivity && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">詳細情報</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedActivity.emoji}</span>
                      <span className="font-semibold">{selectedActivity.activity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">開始時刻</span>
                        <div className="font-mono">{formatTime(selectedActivity.startTime)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">終了時刻</span>
                        <div className="font-mono">{formatTime(selectedActivity.endTime)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">場所</span>
                        <div>{selectedActivity.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">気分</span>
                        <div>{selectedActivity.mood}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">メモ</span>
                      <div className="text-sm bg-gray-50 p-2 rounded mt-1">
                        {selectedActivity.notes}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">今日の統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">総活動時間</span>
                  <span className="font-bold">
                    {timelineData.reduce((acc, curr) => acc + curr.duration, 0)}分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">活動回数</span>
                  <span className="font-bold">{timelineData.length}回</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">平均継続時間</span>
                  <span className="font-bold">
                    {Math.round(timelineData.reduce((acc, curr) => acc + curr.duration, 0) / timelineData.length)}分
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}