export interface DailyLog {
  date: string
  seconds: number
  words: number
}

export interface UserStats {
  totalSeconds: number
  totalWords: number
  currentStreak: number
  lastActiveDate: string | null
}

export interface UserProfile {
  username: string
  avatarUrl: string
  joinDate: string
  level: number
  stats: UserStats
  dailyLogs: DailyLog[]
  unlockedAchievements: string[]
}