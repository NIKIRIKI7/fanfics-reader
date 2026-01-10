import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from './types'

export const useUserStore = defineStore('user', () => {
  const STORAGE_KEY = 'grey_sky_user_profile_v1'

  // Default State
  const profile = ref<UserProfile>({
    username: 'Guest Reader',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=GreySky',
    joinDate: new Date().toISOString(),
    level: 1,
    stats: {
      totalSeconds: 0,
      totalWords: 0,
      currentStreak: 0,
      lastActiveDate: null,
    },
    dailyLogs: [],
    unlockedAchievements: [],
  })

  // --- Helpers ---
  const getTodayDateString = (): string => {
    // Гарантированно возвращаем строку YYYY-MM-DD
    return new Date().toISOString().split('T')[0] || new Date().toLocaleDateString('en-CA')
  }

  // --- Init & Persistence ---
  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Мержим сохраненные данные с дефолтными, чтобы избежать undefined при миграции
        profile.value = {
            ...profile.value,
            ...parsed,
            stats: { ...profile.value.stats, ...(parsed.stats || {}) }
        }
      } catch (e) {
        console.error('User profile corrupted', e)
      }
    }
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.value))
  }

  // --- Actions ---

  // Обновление времени и логов (вызывается из фичи трекинга)
  const updateReadingSession = (secondsDelta: number, wordsDelta: number) => {
    const today = getTodayDateString()

    // 1. Обновляем общую статистику
    profile.value.stats.totalSeconds += secondsDelta
    profile.value.stats.totalWords += wordsDelta

    // 2. Обновляем lastActiveDate
    if (profile.value.stats.lastActiveDate !== today) {
      profile.value.stats.lastActiveDate = today
    }

    // 3. Обновляем Daily Logs
    const logIndex = profile.value.dailyLogs.findIndex(l => l.date === today)

    if (logIndex !== -1) {
      const log = profile.value.dailyLogs[logIndex]
      // TypeScript Guard: log точно существует
      if (log) {
        log.seconds += secondsDelta
        log.words += wordsDelta
      }
    } else {
      profile.value.dailyLogs.push({ date: today, seconds: secondsDelta, words: wordsDelta })
      // Храним историю только за год
      if (profile.value.dailyLogs.length > 365) profile.value.dailyLogs.shift()
    }

    // 4. Пересчитываем стрик (реактивно обновляется через computed, но можно форсировать сохранение)
    save()
  }

  const unlockAchievement = (id: string) => {
    if (!profile.value.unlockedAchievements.includes(id)) {
      profile.value.unlockedAchievements.push(id)
      save()
      return true // Возвращаем true, если это новое достижение
    }
    return false
  }

  // --- Getters ---

  const wpm = computed(() => {
    if (profile.value.stats.totalSeconds < 60) return 0
    const minutes = profile.value.stats.totalSeconds / 60
    return Math.round(profile.value.stats.totalWords / minutes)
  })

  // FIX: Исправленная логика стрика без ошибок типов
  const calculatedStreak = computed(() => {
    const logs = profile.value.dailyLogs
    if (logs.length === 0) return 0

    // Сортировка (копия массива)
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const today = getTodayDateString()
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterday = yesterdayDate.toISOString().split('T')[0] || ''

    const lastLog = sortedLogs[0]
    // Guard: если массив пуст (хотя проверка выше была)
    if (!lastLog) return 0

    // Если последняя запись не сегодня и не вчера — стрик прерван
    if (lastLog.date !== today && lastLog.date !== yesterday) {
      return 0
    }

    let streak = 1

    // Цикл безопасен, так как идем до length - 1
    for (let i = 0; i < sortedLogs.length - 1; i++) {
        const currentLog = sortedLogs[i]
        const nextLog = sortedLogs[i+1]

        // TS Guards (на случай, если что-то пойдет не так с индексами)
        if (!currentLog || !nextLog) break

        const d1 = new Date(currentLog.date).getTime()
        const d2 = new Date(nextLog.date).getTime()

        // Разница в днях
        const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            streak++
        } else {
            break // Разрыв в датах > 1 дня
        }
    }

    return streak
  })

  const formattedTotalTime = computed(() => {
    const totalSec = profile.value.stats.totalSeconds
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    return `${hrs}h ${mins}m`
  })

  init()

  return {
    profile,
    updateReadingSession,
    unlockAchievement,
    wpm,
    calculatedStreak,
    formattedTotalTime,
    getTodayDateString
  }
})
