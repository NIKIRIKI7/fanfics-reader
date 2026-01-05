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

  // Advanced Filters
  const selectedRatings = ref<string[]>([]);
  const selectedStatuses = ref<WorkStatus[]>([]);
  const selectedFandoms = ref<string[]>([]);

  // Context
  const showArchived = ref(false);

  // === ACTIONS ===
  const setType = (type: WorkType | 'All') => {
    activeType.value = type;
  };

  const setShowArchived = (value: boolean) => {
    showArchived.value = value;
    resetFilters();
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

  const resetFilters = () => {
    activeType.value = 'All';
    searchQuery.value = '';
    selectedRatings.value = [];
    selectedStatuses.value = [];
    selectedFandoms.value = [];
  };

  // === GETTERS ===
  const availableFandoms = computed(() => {
    const fandoms = new Set<string>();
    works.forEach(w => {
      if (w.fandom) fandoms.add(w.fandom);
    });
    return Array.from(fandoms);
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
        work.tags.some(tag => tag.toLowerCase().includes(query)) ||
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

    return [...result].sort((a, b) => {
      if (sortBy.value === 'date') {
        return new Date(b.stats.date).getTime() - new Date(a.stats.date).getTime();
      }
      return b.stats.words - a.stats.words;
    });
  });

  const activeFiltersCount = computed(() => {
    return selectedRatings.value.length + selectedStatuses.value.length + selectedFandoms.value.length;
  });

  return {
    searchQuery,
    activeType,
    sortBy,
    showArchived,
    selectedRatings,
    selectedStatuses,
    selectedFandoms,
    availableFandoms,
    activeFiltersCount,
    availableRatings, // Экспортируем константу
    setType,
    setShowArchived,
    toggleRating,
    toggleStatus,
    toggleFandom,
    resetFilters,
    filteredWorks
  };
});