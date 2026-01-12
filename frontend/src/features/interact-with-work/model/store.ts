import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Comment } from './types'
import { useUserStore } from '@/entities/user'

export const useInteractionStore = defineStore('workInteraction', () => {
  const userStore = useUserStore()
  
  // Состояние: ID работ, которые лайкнул пользователь
  const likedWorkIds = ref<Set<string>>(new Set())
  // Состояние: Локальные счетчики лайков (для мгновенного обновления UI)
  const likesCountMap = ref<Record<string, number>>({})
  // Состояние: Комментарии по ID работы
  const commentsMap = ref<Record<string, Comment[]>>({})

  // Инициализация из LocalStorage
  const init = () => {
    const savedLikes = localStorage.getItem('grey_sky_likes')
    if (savedLikes) {
      likedWorkIds.value = new Set(JSON.parse(savedLikes))
    }
    
    const savedComments = localStorage.getItem('grey_sky_comments')
    if (savedComments) {
      commentsMap.value = JSON.parse(savedComments)
    }
  }

  // --- Likes Logic ---
  
  const isLiked = (workId: string) => likedWorkIds.value.has(workId)

  const getLikesCount = (workId: string, initialCount: number) => {
    // Если счетчик еще не инициализирован в сторе, берем начальное значение
    if (likesCountMap.value[workId] === undefined) {
      likesCountMap.value[workId] = initialCount
    }
    return likesCountMap.value[workId]
  }

  const toggleLike = (workId: string, initialCount: number) => {
    // Убедимся, что счетчик инициализирован
    if (likesCountMap.value[workId] === undefined) {
      likesCountMap.value[workId] = initialCount
    }

    if (likedWorkIds.value.has(workId)) {
      likedWorkIds.value.delete(workId)
      likesCountMap.value[workId]--
    } else {
      likedWorkIds.value.add(workId)
      likesCountMap.value[workId]++
    }

    saveLikes()
  }

  // --- Comments Logic ---

  const getComments = (workId: string) => {
    return commentsMap.value[workId] || []
  }

  const addComment = (workId: string, text: string) => {
    if (!text.trim()) return

    const newComment: Comment = {
      id: crypto.randomUUID(),
      workId,
      author: userStore.profile.username,
      avatarUrl: userStore.profile.avatarUrl,
      text: text.trim(),
      date: new Date().toISOString(),
      likes: 0
    }

    if (!commentsMap.value[workId]) {
      commentsMap.value[workId] = []
    }

    commentsMap.value[workId].unshift(newComment)
    saveComments()
  }

  // Helpers
  const saveLikes = () => {
    localStorage.setItem('grey_sky_likes', JSON.stringify(Array.from(likedWorkIds.value)))
  }

  const saveComments = () => {
    localStorage.setItem('grey_sky_comments', JSON.stringify(commentsMap.value))
  }

  init()

  return {
    isLiked,
    getLikesCount,
    toggleLike,
    getComments,
    addComment
  }
})