<script setup lang="ts">
import { onMounted } from 'vue';
// ИСПРАВЛЕНО: Импорты через Public API
import { useWorkFilterStore } from '@/features/filter-works';
import { WorkCatalog } from '@/widgets/work-catalog';

const store = useWorkFilterStore();

onMounted(() => {
  // Сбрасываем фильтры, чтобы архив открылся "чистым"
  store.resetFilters();
  store.setShowArchived(true);
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-6 py-12 relative min-h-screen">
    <div class="mb-12">
      <div class="flex flex-col gap-2 max-w-2xl">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 font-display">The Archive</h2>
        <p class="text-lg text-text-secondary italic leading-relaxed font-light font-display">
          Deprecated logs, legacy data, and old fragments stored within the database.
        </p>
      </div>
    </div>

    <!-- В Архиве фильтры по типам (Original/Fanfic) могут быть не нужны, но поиск полезен.
         WorkCatalog содержит WorkFilter. Можно оставить как есть, так как 'All' покажет все архивы. -->
    <WorkCatalog />
  </div>
</template>