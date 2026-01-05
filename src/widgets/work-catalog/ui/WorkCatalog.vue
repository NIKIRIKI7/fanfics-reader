<script setup lang="ts">
import { ref } from 'vue';
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works';
import { WorkCard, WorkCardSkeleton } from '@/entities/work';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { filteredWorks } = storeToRefs(store);

// Ставим false, так как данные локальные и доступны мгновенно.
// При подключении API здесь будет true, а в fetch() переключится на false.
const isLoading = ref(false);
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
      />

      <!-- Empty State -->
      <div v-if="filteredWorks.length === 0" class="py-12 text-center border border-dashed border-border rounded-xl">
        <p class="text-text-muted font-display italic text-lg">Signal lost. No records match your parameters.</p>
      </div>
    </div>
  </section>
</template>