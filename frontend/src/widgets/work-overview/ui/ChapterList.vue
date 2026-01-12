<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { onEnterAccordion, onLeaveAccordion } from '@/shared/lib/gsapTransitions'
import type { WorkStats } from '@/entities/work/model/types.ts'

const props = defineProps<{
  stats: WorkStats
  slug: string
}>()

const isOpen = ref(true)

// Генерируем фейковые данные для глав (как было ранее)
const chapters = computed(() => {
  return Array.from({ length: props.stats.chapters }, (_, i) => {
    const date = new Date(props.stats.date)
    date.setDate(date.getDate() - (props.stats.chapters - i) * 7)
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
  <div class="flex flex-col mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
    <!-- Header / Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center justify-between border-b border-border pb-4 group w-full cursor-pointer select-none outline-none"
    >
      <div class="flex items-center gap-3">
        <h3 class="text-2xl font-display font-bold italic text-text-primary group-hover:text-accent transition-colors">
          Table of Contents
        </h3>
        <div
          class="p-1 rounded-full bg-background-tertiary/50 text-text-muted transition-transform duration-300 group-hover:bg-accent group-hover:text-background-primary"
          :class="{ '-rotate-180': !isOpen }"
        >
          <ChevronDown :size="16" />
        </div>
      </div>
      <span class="text-sm text-text-muted font-mono">{{ stats.chapters }} parts</span>
    </button>

    <!-- Collapsible List -->
    <transition :css="false" @enter="onEnterAccordion" @leave="onLeaveAccordion">
      <div v-if="isOpen" class="overflow-hidden">
        <!-- Добавляем отступ сверху, чтобы он не схлопывался рывком -->
        <div class="pt-6 flex flex-col divide-y divide-border/30">
          <router-link
            v-for="chapter in chapters"
            :key="chapter.id"
            :to="{ name: 'work-details', params: { slug }, query: { chapter: chapter.id } }"
            class="group/item flex items-center justify-between py-4 px-2 hover:bg-background-tertiary/30 rounded-lg transition-colors cursor-pointer"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-3">
                <span class="text-sm font-mono text-text-muted font-bold w-6">{{ chapter.id }}.</span>
                <span class="text-base font-bold text-text-primary group-hover/item:text-accent transition-colors">
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

            <div class="text-text-muted group-hover/item:text-accent group-hover/item:translate-x-1 transition-all">
              <ChevronRight :size="20" />
            </div>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>
