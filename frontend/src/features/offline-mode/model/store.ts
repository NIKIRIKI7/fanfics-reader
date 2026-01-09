import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Work } from '@/entities/work'

export const useOfflineStore = defineStore('offlineMode', () => {
  const STORAGE_KEY = 'grey_sky_offline_cache'
  // Храним полные объекты работ
  const downloadedWorks = ref<Work[]>([])
  const isOnline = ref(navigator.onLine)

  // Слушатели сети
  window.addEventListener('online', () => {
    isOnline.value = true
  })
  window.addEventListener('offline', () => {
    isOnline.value = false
  })

  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        downloadedWorks.value = JSON.parse(saved)
      } catch (e) {
        console.error('Offline cache corrupted', e)
        downloadedWorks.value = []
      }
    }
  }

  const isDownloaded = (workId: string) => {
    return downloadedWorks.value.some((w) => w.id === workId)
  }

  const downloadWork = (work: Work) => {
    if (!isDownloaded(work.id)) {
      // Клонируем объект, чтобы разорвать ссылки
      const workCopy = JSON.parse(JSON.stringify(work))
      downloadedWorks.value.push(workCopy)
      saveToStorage()
    }
  }

  const removeDownload = (workId: string) => {
    const index = downloadedWorks.value.findIndex((w) => w.id === workId)
    if (index !== -1) {
      downloadedWorks.value.splice(index, 1)
      saveToStorage()
    }
  }

  const toggleDownload = (work: Work) => {
    if (isDownloaded(work.id)) {
      removeDownload(work.id)
    } else {
      downloadWork(work)
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(downloadedWorks.value))
    } catch (e) {
      alert('Storage full! Cannot save for offline.')
      console.error(e)
    }
  }

  // Метод для получения работы (используется когда нет сети)
  const getOfflineWork = (slug: string): Work | undefined => {
    return downloadedWorks.value.find((w) => w.slug === slug)
  }

  init()

  return {
    downloadedWorks,
    isOnline,
    isDownloaded,
    toggleDownload,
    getOfflineWork,
  }
})
