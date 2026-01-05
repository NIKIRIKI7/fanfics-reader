<script setup lang="ts">
import { ref } from 'vue';
import { useWorkFilterStore } from '../model/store';

// Importing decomposed parts
import FilterSearchBar from './parts/FilterSearchBar.vue';
import FilterRating from './parts/FilterRating.vue';
import FilterStatus from './parts/FilterStatus.vue';
import FilterFandom from './parts/FilterFandom.vue';

const store = useWorkFilterStore();
const isAdvancedOpen = ref(false);

const toggleAdvanced = () => {
  isAdvancedOpen.value = !isAdvancedOpen.value;
};

const closePanel = () => {
  isAdvancedOpen.value = false;
};
</script>

<template>
  <div class="sticky top-20 z-40 flex flex-col gap-2 mb-10 transition-all duration-300">

    <!-- Top Bar Component -->
    <FilterSearchBar
      :isAdvancedOpen="isAdvancedOpen"
      @toggleAdvanced="toggleAdvanced"
    />

    <!-- Dropdown Panel -->
    <transition name="slide">
      <div v-if="isAdvancedOpen" class="bg-background-secondary/95 backdrop-blur-xl border border-border rounded-xl p-6 shadow-xl overflow-hidden">

        <!-- Grid of Filter Groups -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FilterRating />
          <FilterStatus />
          <FilterFandom />
        </div>

        <!-- Footer Actions -->
        <div class="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <button @click="store.resetFilters" class="text-xs text-text-muted hover:text-red-500 transition-colors uppercase tracking-wider font-bold">
            Reset All
          </button>
          <button @click="closePanel" class="text-xs text-text-primary hover:underline uppercase tracking-wider font-bold">
            Close Panel
          </button>
        </div>

      </div>
    </transition>

  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>