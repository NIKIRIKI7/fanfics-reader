<script setup lang="ts">
import { ref } from 'vue';
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works';
import { WorkCard, WorkCardSkeleton } from '@/entities/work';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { filteredWorks } = storeToRefs(store);
const isLoading = ref(false);

const handleTagClick = (tag: string) => {
  store.searchByTag(tag);
  // Автоскролл к началу списка при фильтрации
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <section>
    <!-- Feature: Filter -->
    <WorkFilter class="mb-8" />

    <!-- Loading State: Skeletons -->
    <div v-if="isLoading" class="grid grid-cols-1 gap-6">
      <WorkCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Data State: Real Cards -->
    <div v-else class="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
        @clickTag="handleTagClick"
      />

      <!-- Empty State -->
      <div v-if="filteredWorks.length === 0" class="py-12 text-center border border-dashed border-border rounded-xl">
        <p class="text-text-muted font-display italic text-lg">Signal lost. No records match your parameters.</p>
        <button
          @click="store.resetFilters"
          class="mt-4 text-accent hover:underline text-sm font-bold"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </section>
</template>