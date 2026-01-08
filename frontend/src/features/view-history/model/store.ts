import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Work } from '@/entities/work';

export const useViewHistoryStore = defineStore('viewHistory', () => {
  const history = ref<Work[]>([]);
  // ИЗМЕНЕНО: 3 вместо 4, чтобы соответствовать дизайну "Latest Transmissions"
  const MAX_ITEMS = 3;

  // Инициализация из localStorage
  const init = () => {
    const saved = localStorage.getItem('grey_sky_view_history');
    if (saved) {
      try {
        history.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse view history', e);
      }
    }
  };

  const addWork = (work: Work) => {
    // Удаляем дубликат, если работа уже была в истории
    const existingIndex = history.value.findIndex(w => w.id === work.id);
    if (existingIndex !== -1) {
      history.value.splice(existingIndex, 1);
    }

    // Добавляем в начало
    history.value.unshift(work);

    // Обрезаем лишнее
    if (history.value.length > MAX_ITEMS) {
      history.value = history.value.slice(0, MAX_ITEMS);
    }

    // Сохраняем
    localStorage.setItem('grey_sky_view_history', JSON.stringify(history.value));
  };

  const clearHistory = () => {
    history.value = [];
    localStorage.removeItem('grey_sky_view_history');
  };

  init();

  return {
    history,
    addWork,
    clearHistory
  };
});