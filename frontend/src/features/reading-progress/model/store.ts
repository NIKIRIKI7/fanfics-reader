import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ReadingProgress {
  chapter: number;
  scroll: number;
  timestamp: number;
}

export const useReadingProgressStore = defineStore('readingProgress', () => {
  const STORAGE_KEY = 'grey_sky_reading_progress';
  
  // Состояние: Словарь, где ключ - slug произведения
  const progressData = ref<Record<string, ReadingProgress>>({});

  // Инициализация: Загрузка из LocalStorage
  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        progressData.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reading progress', e);
        progressData.value = {};
      }
    }
  };

  // Action: Сохранить прогресс
  const saveProgress = (slug: string, chapter: number, scroll: number) => {
    progressData.value[slug] = {
      chapter,
      scroll,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData.value));
  };

  // Action: Получить прогресс
  const getProgress = (slug: string): ReadingProgress | undefined => {
    return progressData.value[slug];
  };

  // Action: Удалить прогресс (например, если произведение закончено - опционально)
  const clearProgress = (slug: string) => {
    if (progressData.value[slug]) {
      delete progressData.value[slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData.value));
    }
  };

  // Запускаем инициализацию сразу при создании стора
  init();

  return {
    progressData,
    saveProgress,
    getProgress,
    clearProgress
  };
});