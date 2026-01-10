import { defineStore } from 'pinia'
import { useUserStore } from '@/entities/user'
import { ACHIEVEMENTS_LIST } from './achievements'

export const useReadingHabitStore = defineStore('readingHabitLogic', () => {
  const userStore = useUserStore()
  let timerInterval: number | null = null

  // --- Session Logic ---

  const startSession = () => {
    if (timerInterval) return

    // Запускаем таймер
    timerInterval = window.setInterval(() => {
      // Каждую секунду обновляем статистику в User Store
      userStore.updateReadingSession(1, 0)
      checkAchievements()
    }, 1000)
  }

  const endSession = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const recordChapterRead = (wordCount: number) => {
    // Обновляем статистику слов
    userStore.updateReadingSession(0, wordCount)
    checkAchievements()
  }

  const checkAchievements = () => {
    // Проверяем условия для всех ачивок
    ACHIEVEMENTS_LIST.forEach(achievement => {
      // Если ачивка еще не получена
      if (!userStore.profile.unlockedAchievements.includes(achievement.id)) {
        // Проверяем условие, передавая профиль и вычисляемый стрик
        const isMet = achievement.condition(userStore.profile, userStore.calculatedStreak)
        
        if (isMet) {
          const isNew = userStore.unlockAchievement(achievement.id)
          if (isNew) {
            console.log(`🏆 Achievement Unlocked: ${achievement.title}`)
            // Тут можно вызвать Toast уведомление
          }
        }
      }
    })
  }

  return {
    startSession,
    endSession,
    recordChapterRead
  }
})