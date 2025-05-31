import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return '朝'
  if (hour >= 12 && hour < 17) return '昼'
  if (hour >= 17 && hour < 21) return '夕方'
  return '夜'
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateTimelineData() {
  const activities = [
    { name: '睡眠', emoji: '😴', duration: 120, mood: 'リラックス', color: '#6366f1' },
    { name: 'ご飯', emoji: '🍽️', duration: 15, mood: '満足', color: '#10b981' },
    { name: '毛づくろい', emoji: '🧼', duration: 30, mood: '集中', color: '#f59e0b' },
    { name: '遊び', emoji: '🎾', duration: 45, mood: '興奮', color: '#ef4444' },
    { name: '日向ぼっこ', emoji: '☀️', duration: 60, mood: 'のんびり', color: '#f97316' },
    { name: '探索', emoji: '🔍', duration: 25, mood: '好奇心', color: '#8b5cf6' },
    { name: '甘え鳴き', emoji: '💕', duration: 10, mood: '甘えたい', color: '#ec4899' },
    { name: 'トイレ', emoji: '🚽', duration: 5, mood: 'すっきり', color: '#06b6d4' },
  ]

  const data = []
  let currentTime = new Date()
  currentTime.setHours(6, 0, 0, 0) // Start at 6 AM

  for (let i = 0; i < 20; i++) {
    const activity = getRandomElement(activities)
    const startTime = new Date(currentTime)
    const endTime = new Date(currentTime.getTime() + activity.duration * 60 * 1000)
    
    data.push({
      id: i + 1,
      activity: activity.name,
      emoji: activity.emoji,
      mood: activity.mood,
      startTime,
      endTime,
      duration: activity.duration,
      color: activity.color,
      location: getRandomElement(['リビング', 'キッチン', '寝室', 'ベランダ', '廊下']),
      intensity: Math.floor(Math.random() * 5) + 1,
      notes: getRandomElement([
        'いつもより長めでした',
        '普段通りです',
        '少し短めでした',
        'とても活発でした',
        'おとなしくしていました'
      ])
    })

    // Add some random gap between activities
    currentTime = new Date(endTime.getTime() + (Math.random() * 30 + 5) * 60 * 1000)
  }

  return data
}

export type TimelineActivity = ReturnType<typeof generateTimelineData>[0]