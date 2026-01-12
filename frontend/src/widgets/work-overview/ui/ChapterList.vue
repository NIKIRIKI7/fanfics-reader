<script setup lang="ts">
import { computed } from 'vue'
import type { WorkStats } from '@/entities/work'
import { Calendar, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  stats: WorkStats
  slug: string
}>()

// Генерируем фейковые данные для глав, так как в моках только количество
const chapters = computed(() => {
  return Array.from({ length: props.stats.chapters }, (_, i) => {
    const date = new Date(props.stats.date)
    date.setDate(date.getDate() - (props.stats.chapters - i) * 7) // разброс по неделям
    return {
      id: i + 1,
      title: i === 0 ? 'Лжец' : i === 1 ? 'Гость за семейным столом' : `Chapter ${i + 1}`,
      date: date.toLocaleDateString(),
      comments: Math.floor(Math.random() * 20),
    }
  })
})
</script>

<template>
  <div class="flex flex-col gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
    <div class="flex items-center justify-between border-b border-border pb-4">
      <h3 class="text-2xl font-display font-bold italic text-text-primary">Table of Contents</h3>
      <span class="text-sm text-text-muted font-mono">{{ stats.chapters }} parts</span>
    </div>

    <div class="flex flex-col divide-y divide-border/30">
      <router-link
        v-for="chapter in chapters"
        :key="chapter.id"
        :to="{ name: 'work-details', params: { slug }, query: { chapter: chapter.id } }"
        class="group flex items-center justify-between py-4 px-2 hover:bg-background-tertiary/30 rounded-lg transition-colors cursor-pointer"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-3">
            <span class="text-sm font-mono text-text-muted font-bold w-6">{{ chapter.id }}.</span>
            <span class="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
              {{ chapter.title }}
            </span>
          </div>
          <div class="flex items-center gap-4 pl-9 text-xs text-text-muted">
            <span class="flex items-center gap-1">
              <Calendar :size="10" /> {{ chapter.date }}
            </span>
            <span class="flex items-center gap-1" v-if="chapter.comments > 0">
               <span class="underline decoration-dotted">Reviews: {{ chapter.comments }}</span>
            </span>
          </div>
        </div>

        <div class="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all">
          <ChevronRight :size="20" />
        </div>
      </router-link>
    </div>
  </div>
</template>
