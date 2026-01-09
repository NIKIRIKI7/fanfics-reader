<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type Work, getReadingTime } from '@/entities/work'
import BaseTag from '@/shared/ui/BaseTag.vue'
import { useWorkFilterStore } from '@/features/filter-works'
import { BookmarkButton } from '@/features/manage-library' // <--- IMPORT

defineProps<{ work: Work }>()

const router = useRouter()
const filterStore = useWorkFilterStore()

const handleTagClick = (tag: string) => {
  // 1. Устанавливаем фильтр в сторе
  filterStore.searchByTag(tag)
  // 2. Редиректим пользователя в каталог
  router.push({ name: 'works' })
}
</script>

<template>
  <header class="mb-12 border-b border-border pb-8 text-center relative">
    <!-- Добавлен relative -->

    <!-- !!! НОВАЯ КНОПКА (Десктоп) !!! -->
    <div class="absolute top-0 right-0 hidden md:block z-20">
      <BookmarkButton :work="work" variant="full" />
    </div>

    <!-- Badges -->
    <div class="flex justify-center mb-4 gap-2 items-center relative">
      <!-- !!! НОВАЯ КНОПКА (Мобилки) !!! -->
      <div class="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20">
        <BookmarkButton :work="work" variant="icon" size="sm" />
      </div>

      <span
        class="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border rounded text-text-secondary"
      >
        {{ work.type }}
      </span>
      <span
        class="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest border border-accent/50 text-accent rounded"
      >
        {{ work.rating }}
      </span>
    </div>

    <!-- Fandom Info -->
    <div v-if="work.type === 'Fanfic'" class="mb-2 font-sans">
      <div class="text-text-muted uppercase text-sm tracking-widest">{{ work.fandom }}</div>
      <div v-if="work.pairings" class="text-text-secondary italic">
        {{ work.pairings.join(', ') }}
      </div>
    </div>

    <!-- Title -->
    <h1
      class="text-4xl md:text-6xl font-black italic tracking-tight text-text-primary mb-6 leading-tight"
    >
      {{ work.title }}
    </h1>

    <!-- Warnings -->
    <div
      v-if="work.warnings && work.warnings.length"
      class="mb-6 bg-background-tertiary/20 p-3 rounded-lg border border-border/50 inline-block text-left"
    >
      <p class="text-xs font-bold text-text-primary mb-1 uppercase tracking-wide text-center">
        Warnings:
      </p>
      <p class="text-sm text-text-secondary font-sans">{{ work.warnings.join(', ') }}</p>
    </div>

    <!-- Stats -->
    <div
      class="flex flex-wrap items-center justify-center gap-3 text-text-secondary font-sans text-sm mb-6"
    >
      <span class="font-bold text-text-primary">{{ work.author }}</span>

      <span class="w-1 h-1 rounded-full bg-border"></span>
      <span>{{ work.stats.date }}</span>

      <span class="w-1 h-1 rounded-full bg-border"></span>
      <span>{{ work.stats.words.toLocaleString() }} words</span>

      <!-- НОВОЕ: Время чтения -->
      <span class="w-1 h-1 rounded-full bg-border"></span>
      <span class="flex items-center gap-1 text-text-primary font-medium">
        <span class="material-symbols-outlined text-[16px]">schedule</span>
        {{ getReadingTime(work.stats.words) }}
      </span>
    </div>

    <!-- Tags (Clickable) -->
    <div class="flex flex-wrap justify-center gap-2">
      <BaseTag
        v-for="tag in work.tags"
        :key="tag"
        :label="tag"
        @click="handleTagClick(tag)"
        title="Filter by this tag"
      />
    </div>
  </header>
</template>
