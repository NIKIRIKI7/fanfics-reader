<script setup lang="ts">
import { onMounted } from 'vue'
// ИСПРАВЛЕНО: Импорты через Public API
import { useWorkFilterStore } from '@/features/filter-works'
import { WorkCatalog } from '@/widgets/work-catalog'

// Reset filter on mount to show 'All' (which will be filtered visually by user choice)
const store = useWorkFilterStore()

onMounted(() => {
  store.setShowArchived(false) // Показываем только Originals и Fanfics
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-6 py-12 relative min-h-screen">
    <div class="mb-12">
      <div class="flex flex-col gap-2 max-w-2xl">
        <h2
          class="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 font-display"
        >
          Works
        </h2>
        <p class="text-lg text-text-secondary italic leading-relaxed font-light font-display">
          Current narratives. Originals and Fanfictions from the Deep Field.
        </p>
      </div>
    </div>
    <WorkCatalog />
  </div>
</template>
