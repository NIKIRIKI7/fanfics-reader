import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Work } from '@/entities/work';

export const useLibraryStore = defineStore('library', () => {
  const STORAGE_KEY = 'grey_sky_library_v1';
  const savedWorks = ref<Work[]>([]);

  // Инициализация
  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        savedWorks.value = JSON.parse(saved);
      } catch (e) {
        console.error('Library data corrupted', e);
        savedWorks.value = [];
      }
    }
  };

  // Проверка наличия
  const isSaved = (workId: string) => {
    return savedWorks.value.some((w) => w.id === workId);
  };

  // Основное действие
  const toggleWork = (work: Work) => {
    const index = savedWorks.value.findIndex((w) => w.id === work.id);
    if (index !== -1) {
      // Удаляем
      savedWorks.value.splice(index, 1);
    } else {
      // Добавляем в начало (как стек)
      savedWorks.value.unshift(work);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWorks.value));
  };

  const savedCount = computed(() => savedWorks.value.length);

  init();

  return {
    savedWorks,
    savedCount,
    isSaved,
    toggleWork,
  };
});