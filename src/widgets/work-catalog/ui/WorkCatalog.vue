<script setup lang="ts">
// ИСПРАВЛЕНО: Импорты через Public API
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works';
import { WorkCard } from '@/entities/work';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { filteredWorks } = storeToRefs(store);
</script>

<template>
  <section>
    <!-- Feature: Filter -->
    <WorkFilter />

    <!-- List of Entities -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
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