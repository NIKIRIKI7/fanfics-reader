import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Work } from '@/entities/work'
import type { Collection, CollectionIcon } from '@/entities/collection'

export const useLibraryStore = defineStore('library', () => {
  const STORAGE_KEY = 'grey_sky_library_v2'

  // Состояние
  const collections = ref<Collection[]>([])
  const worksCache = ref<Record<string, Work>>({})

  // Инициализация
  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          worksCache.value = parsed.reduce((acc, work) => ({ ...acc, [work.id]: work }), {})
          collections.value = [
            {
              id: 'default',
              title: 'General Library',
              icon: 'default',
              workIds: parsed.map((w: Work) => w.id),
              isSystem: true,
            },
          ]
        } else {
          collections.value = parsed.collections || []
          worksCache.value = parsed.worksCache || {}
        }
      } catch (e) {
        console.error('Library data corrupted', e)
        resetToDefault()
      }
    } else {
      resetToDefault()
    }
  }

  const resetToDefault = () => {
    collections.value = [
      {
        id: 'default',
        title: 'General Library',
        icon: 'default',
        workIds: [],
        isSystem: true,
      },
      {
        id: 'favorites',
        title: 'Favorites',
        icon: 'heart',
        workIds: [],
        isSystem: true,
      },
    ]
    worksCache.value = {}
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        collections: collections.value,
        worksCache: worksCache.value,
      }),
    )
  }

  // --- Actions ---

  const createCollection = (title: string, icon: CollectionIcon = 'book') => {
    const newCol: Collection = {
      id: crypto.randomUUID(),
      title,
      icon,
      workIds: [],
    }
    collections.value.push(newCol)
    saveToStorage()
  }

  const updateCollection = (
    id: string,
    payload: { title?: string; icon?: CollectionIcon }
  ) => {
    const col = collections.value.find((c) => c.id === id)
    if (col && !col.isSystem) {
      if (payload.title) col.title = payload.title
      if (payload.icon) col.icon = payload.icon
      saveToStorage()
    }
  }

  const deleteCollection = (id: string) => {
    const index = collections.value.findIndex((c) => c.id === id)
    // FIX: Добавлена проверка, что элемент по индексу существует
    if (index !== -1 && collections.value[index] && !collections.value[index].isSystem) {
      collections.value.splice(index, 1)
      cleanUpCache()
      saveToStorage()
    }
  }

  const addWorkToCollection = (work: Work, collectionId: string) => {
    const col = collections.value.find((c) => c.id === collectionId)
    if (!col) return

    if (!worksCache.value[work.id]) {
      worksCache.value[work.id] = work
    }

    if (!col.workIds.includes(work.id)) {
      col.workIds.unshift(work.id)
      saveToStorage()
    }
  }

  const removeWorkFromCollection = (workId: string, collectionId: string) => {
    const col = collections.value.find((c) => c.id === collectionId)
    if (!col) return

    col.workIds = col.workIds.filter((id) => id !== workId)
    cleanUpCache()
    saveToStorage()
  }

  const toggleWorkInCollection = (work: Work, collectionId: string) => {
    const col = collections.value.find((c) => c.id === collectionId)
    if (!col) return

    if (col.workIds.includes(work.id)) {
      removeWorkFromCollection(work.id, collectionId)
    } else {
      addWorkToCollection(work, collectionId)
    }
  }

  const cleanUpCache = () => {
    const usedIds = new Set<string>()
    collections.value.forEach((c) => c.workIds.forEach((id) => usedIds.add(id)))

    for (const key in worksCache.value) {
      if (!usedIds.has(key)) {
        delete worksCache.value[key]
      }
    }
  }

  // --- Getters ---

  const isSavedInCollection = (workId: string, collectionId: string) => {
    const col = collections.value.find((c) => c.id === collectionId)
    return col ? col.workIds.includes(workId) : false
  }

  const isSavedAnywhere = (workId: string) => {
    return collections.value.some((c) => c.workIds.includes(workId))
  }

  const getWorksInCollection = (collectionId: string): Work[] => {
    const col = collections.value.find((c) => c.id === collectionId)
    if (!col) return []
    return col.workIds
      .map((id) => worksCache.value[id])
      .filter((w) => !!w)
  }

  const savedCount = computed(() => Object.keys(worksCache.value).length)

  init()

  return {
    collections,
    savedCount,
    createCollection,
    updateCollection,
    deleteCollection,
    addWorkToCollection,
    removeWorkFromCollection,
    toggleWorkInCollection,
    isSavedInCollection,
    isSavedAnywhere,
    getWorksInCollection,
  }
})
