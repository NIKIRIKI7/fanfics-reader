<script setup lang="ts">
import { ref } from 'vue';
import { useWorkFilterStore } from '../model/store';
import FilterSearchBar from './parts/FilterSearchBar.vue';
import FilterRating from './parts/FilterRating.vue';
import FilterStatus from './parts/FilterStatus.vue';
import FilterFandom from './parts/FilterFandom.vue';
import FilterTags from './parts/FilterTags.vue';
import { onEnterAccordion, onLeaveAccordion } from '@/shared/lib/gsapTransitions';

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
  <div class="flex flex-col gap-2 mb-10 transition-all duration-300">
    <FilterSearchBar
      :isAdvancedOpen="isAdvancedOpen"
      @toggleAdvanced="toggleAdvanced"
    />

    <transition
      :css="false"
      @enter="onEnterAccordion" @leave="onLeaveAccordion"
    >
      <div
        v-if="isAdvancedOpen"
        class="bg-background-secondary/95 backdrop-blur-xl border border-border rounded-xl p-6 shadow-xl overflow-hidden"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FilterRating />
          <FilterStatus />
          <FilterFandom />
          <FilterTags />
        </div>

        <div class="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <button
            @click="store.resetFilters"
            class="text-xs text-text-muted hover:text-red-500 transition-colors uppercase tracking-wider font-bold"
          >
            Reset All
          </button>
          <button
            @click="closePanel"
            class="text-xs text-text-primary hover:underline uppercase tracking-wider font-bold"
          >
            Close Panel
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
