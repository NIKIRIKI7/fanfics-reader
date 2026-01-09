export { default as WorkCard } from './ui/WorkCard.vue'
export { default as WorkCardSkeleton } from './ui/WorkCardSkeleton.vue'
export { works } from './api/mockData'
export { getReadingTime } from './lib/readingTime'

// Экспортируем все типы через Public API
export type { Work, WorkType, WorkStatus, Track, SceneSoundtrack } from './model/types'
