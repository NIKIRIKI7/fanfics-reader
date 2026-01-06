<script setup lang="ts">
import type { Work } from '../model/types';
import BaseTag from '@/shared/ui/BaseTag.vue';
import { RouterLink } from 'vue-router';
// Импортируем функцию расчета (можно через относительный путь внутри слайса)
import { getReadingTime } from '../lib/readingTime';

defineProps<{ work: Work }>();
</script>

<template>
  <article class="group relative flex flex-col lg:flex-row gap-6 p-6 rounded-xl border border-transparent hover:border-border bg-background-tertiary/20 hover:bg-background-tertiary/40 transition-all duration-300">

    <!-- Cover Image Block -->
    <div class="w-full lg:w-48 h-32 lg:h-auto shrink-0 rounded-lg overflow-hidden bg-background-secondary relative">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-30 z-10"></div>
      <img
        :src="work.coverUrl"
        :alt="work.title"
        class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay grayscale"
        loading="lazy"
      />
      <div class="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-background-primary text-text-primary border border-border text-[10px] font-bold uppercase tracking-wider">
        {{ work.type }}
      </div>
    </div>

    <!-- Content Block -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <!-- Meta Info (Date, Words, Time, Status) -->
        <div class="flex flex-wrap items-center gap-x-3 text-xs text-text-muted font-sans mb-2">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">calendar_today</span>
            {{ work.stats.date }}
          </span>

          <span class="w-1 h-1 rounded-full bg-border"></span>

          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">format_align_left</span>
            {{ work.stats.words.toLocaleString() }} words
          </span>

          <!-- НОВОЕ: Время чтения -->
          <span class="w-1 h-1 rounded-full bg-border"></span>
          <span class="flex items-center gap-1 text-text-secondary font-medium">
             <span class="material-symbols-outlined text-[14px]">schedule</span>
             {{ getReadingTime(work.stats.words) }}
          </span>

          <span class="w-1 h-1 rounded-full bg-border"></span>
          <span class="text-text-primary font-bold">{{ work.stats.status }}</span>
        </div>

        <!-- Fandom & Pairings (Only for Fanfics) -->
        <div v-if="work.type === 'Fanfic'" class="mb-1 text-sm font-sans">
          <div v-if="work.fandom" class="text-text-primary font-bold tracking-wide">
            {{ work.fandom }}
          </div>
          <div v-if="work.pairings && work.pairings.length" class="text-text-secondary italic text-xs mt-0.5">
            {{ work.pairings.join(', ') }}
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-text-primary mb-2 font-display group-hover:underline decoration-1 underline-offset-4 decoration-text-muted transition-all">
          <RouterLink :to="`/work/${work.slug}`" class="before:absolute before:inset-0">
            {{ work.title }}
          </RouterLink>
        </h3>

        <!-- Rating & Warnings (Crucial Metadata) -->
        <div class="flex flex-wrap gap-y-1 gap-x-3 text-xs font-sans mb-3 items-center">
          <!-- Rating Badge -->
          <span class="px-2 py-0.5 rounded border border-accent/30 text-accent font-bold">
            {{ work.rating }}
          </span>

          <!-- Warnings List -->
          <div v-if="work.warnings && work.warnings.length" class="flex gap-2 text-text-muted">
            <span class="font-bold text-text-secondary">Warnings:</span>
            <span>{{ work.warnings.join(', ') }}</span>
          </div>
        </div>

        <!-- Summary -->
        <p class="text-text-secondary line-clamp-2 md:line-clamp-3 mb-4 font-light text-lg font-display leading-relaxed">
          {{ work.summary }}
        </p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-2 relative z-10">
        <BaseTag v-for="tag in work.tags" :key="tag" :label="tag" />
      </div>
    </div>
  </article>
</template>