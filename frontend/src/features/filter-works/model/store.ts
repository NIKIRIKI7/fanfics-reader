import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { works, type WorkType, type WorkStatus } from '@/entities/work';

export const useWorkFilterStore = defineStore('workFilter', () => {
  // === CONSTANTS ===
  const availableRatings = ['0+', '6+', '12+', '16+', '18+'];

  // === STATE ===
  const searchQuery = ref('');
  const activeType = ref<WorkType | 'All'>('All');
  const sortBy = ref<'date' | 'words'>('date');

  // Filters
  const selectedRatings = ref<string[]>([]);
  const selectedStatuses = ref<WorkStatus[]>([]);
  const selectedFandoms = ref<string[]>([]);
  const selectedTags = ref<string[]>([]); // НОВОЕ: Массив выбранных тегов

  const showArchived = ref(false);

  // === ACTIONS ===
  const setType = (type: WorkType | 'All') => {
    activeType.value = type;
  };

  // ИЗМЕНЕНИЕ 1: Убрали resetFilters() отсюда.
  // Теперь это просто переключатель режима.
  const setShowArchived = (value: boolean) => {
    showArchived.value = value;
  };

  const toggleRating = (rating: string) => {
    if (selectedRatings.value.includes(rating)) {
      selectedRatings.value = selectedRatings.value.filter(r => r !== rating);
    } else {
      selectedRatings.value.push(rating);
    }
  };

  const toggleStatus = (status: WorkStatus) => {
    if (selectedStatuses.value.includes(status)) {
      selectedStatuses.value = selectedStatuses.value.filter(s => s !== status);
    } else {
      selectedStatuses.value.push(status);
    }
  };

  const toggleFandom = (fandom: string) => {
    if (selectedFandoms.value.includes(fandom)) {
      selectedFandoms.value = selectedFandoms.value.filter(f => f !== fandom);
    } else {
      selectedFandoms.value.push(fandom);
    }
  };

  // НОВОЕ: Переключение тега
  const toggleTag = (tag: string) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter(t => t !== tag);
    } else {
      selectedTags.value.push(tag);
    }
  };

  const resetFilters = () => {
    activeType.value = 'All';
    searchQuery.value = '';
    selectedRatings.value = [];
    selectedStatuses.value = [];
    selectedFandoms.value = [];
    selectedTags.value = []; // Сброс тегов
  };

  // ИЗМЕНЕНИЕ 2: При поиске по тегу убеждаемся, что мы не в архиве
  const searchByTag = (tag: string) => {
    resetFilters();
    selectedTags.value.push(tag);
    showArchived.value = false; // Принудительно выходим из архива, чтобы видеть результаты
  };

  // === GETTERS ===
  const availableFandoms = computed(() => {
    const fandoms = new Set<string>();
    works.forEach(w => { if (w.fandom) fandoms.add(w.fandom); });
    return Array.from(fandoms);
  });

  // НОВОЕ: Получаем список всех уникальных тегов
  const availableTags = computed(() => {
    const tags = new Set<string>();
    works.forEach(w => {
      w.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  const filteredWorks = computed(() => {
    let result = works;

    if (showArchived.value) {
      result = result.filter(work => work.type === 'Archive');
    } else {
      result = result.filter(work => work.type !== 'Archive');
    }

    if (activeType.value !== 'All') {
      result = result.filter(work => work.type === activeType.value);
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(work =>
        work.title.toLowerCase().includes(query) ||
        (work.fandom && work.fandom.toLowerCase().includes(query))
      );
    }

    if (selectedRatings.value.length > 0) {
      result = result.filter(work => selectedRatings.value.includes(work.rating));
    }

    if (selectedStatuses.value.length > 0) {
      result = result.filter(work => selectedStatuses.value.includes(work.stats.status));
    }

    if (selectedFandoms.value.length > 0) {
      result = result.filter(work => work.fandom && selectedFandoms.value.includes(work.fandom));
    }

    // НОВОЕ: Фильтрация по выбранным тегам
    if (selectedTags.value.length > 0) {
      // Работа должна содержать ВСЕ выбранные теги (строгая фильтрация)
      result = result.filter(work =>
        selectedTags.value.every(selectedTag => work.tags.includes(selectedTag))
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy.value === 'date') {
        return new Date(b.stats.date).getTime() - new Date(a.stats.date).getTime();
      }
      return b.stats.words - a.stats.words;
    });
  });

  const activeFiltersCount = computed(() => {
    return selectedRatings.value.length +
           selectedStatuses.value.length +
           selectedFandoms.value.length +
           selectedTags.value.length;
  });

  return {
    searchQuery,
    activeType,
    sortBy,
    showArchived,
    selectedRatings,
    selectedStatuses,
    selectedFandoms,
    selectedTags,      // export
    availableFandoms,
    availableTags,     // export
    activeFiltersCount,
    availableRatings,
    setType,
    setShowArchived,
    toggleRating,
    toggleStatus,
    toggleFandom,
    toggleTag,         // export
    resetFilters,
    searchByTag,
    filteredWorks
  };
});