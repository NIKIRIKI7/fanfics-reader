import type { Component } from 'vue'
import { Flame, Moon, Zap, BookOpen } from 'lucide-vue-next'
// Импортируем тип UserProfile из entities
import type { UserProfile } from '@/entities/user'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: Component
  // Условие теперь принимает весь профиль для гибкости
  condition: (profile: UserProfile, computedStreak: number) => boolean
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Read between 2 AM and 5 AM.',
    icon: Moon,
    condition: () => {
      const hour = new Date().getHours()
      return hour >= 2 && hour < 5
    }
  },
  {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    description: 'Read more than 10,000 words in total.',
    icon: Zap,
    condition: (profile) => profile.stats.totalWords >= 10000
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Maintain a 3-day reading streak.',
    icon: Flame,
    condition: (_, streak) => streak >= 3
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Accumulate 24 hours of total reading time.',
    icon: BookOpen,
    condition: (profile) => profile.stats.totalSeconds >= 24 * 60 * 60
  }
]
