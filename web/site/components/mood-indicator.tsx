'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface MoodIndicatorProps {
  mood: string
  color: string
}

export function MoodIndicator({ mood, color }: MoodIndicatorProps) {
  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      'リラックス': '😌',
      '満足': '😊',
      '集中': '🧐',
      '興奮': '😆',
      'のんびり': '😎',
      '好奇心': '🤔',
      '甘えたい': '🥺',
      'すっきり': '😤',
    }
    return moodMap[mood] || '😐'
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      <motion.span
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-base"
      >
        {getMoodEmoji(mood)}
      </motion.span>
      <Heart className="w-3 h-3" />
      <span>{mood}</span>
    </motion.div>
  )
}