<script setup lang="ts">
import type { Work } from '../model/types'
import BaseTag from '@/shared/ui/BaseTag.vue'
import { RouterLink } from 'vue-router'
import { getReadingTime } from '@/entities/work'

defineProps<{ work: Work }>()

defineEmits<{
  (e: 'clickTag', tag: string): void
}>()
</script>

<template>
  <article
    class="group relative flex flex-col rounded-xl border border-transparent hover:border-border bg-background-tertiary/20 hover:bg-background-tertiary/40 transition-all duration-300 overflow-hidden h-full"
  >
    <!-- Cover Image Block -->
    <div class="relative w-full h-64 shrink-0 bg-background-secondary overflow-hidden">
      <img
        :src="work.coverUrl"
        :alt="work.title"
        class="w-full h-full object-cover transition-all duration-700 ease-in-out grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity"
      ></div>

      <!-- Type Badge -->
      <div
        class="absolute top-3 left-3 z-30 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider shadow-sm"
      >
        {{ work.type }}
      </div>

      <!-- Action Slot -->
      <div class="absolute top-3 right-3 z-30">
        <slot name="action"></slot>
      </div>
    </div>

    <!-- Content Block -->
    <div class="flex-1 flex flex-col p-6">
      <!-- Meta Info -->
      <div class="flex flex-wrap items-center gap-x-3 text-xs text-text-muted font-sans mb-3">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">calendar_today</span>
          {{ work.stats.date }}
        </span>
        <span class="w-1 h-1 rounded-full bg-border"></span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">format_align_left</span>
          {{ (work.stats.words / 1000).toFixed(1) }}k
        </span>
        <span class="w-1 h-1 rounded-full bg-border"></span>
        <span class="flex items-center gap-1 text-text-secondary font-medium">
          <span class="material-symbols-outlined text-[14px]">schedule</span>
          {{ getReadingTime(work.stats.words) }}
        </span>
      </div>

      <!-- Fandom info -->
      <div v-if="work.type === 'Fanfic'" class="mb-2 text-sm font-sans">
        <span class="text-text-primary font-bold tracking-wide block">{{ work.fandom }}</span>
        <span v-if="work.pairings?.length" class="text-text-muted italic text-xs">
          {{ work.pairings.join(', ') }}
        </span>
      </div>
      <div v-else class="mb-2 text-sm font-sans text-text-primary font-bold tracking-wide">
        Original Work
      </div>

      <!-- Title -->
      <h3
        class="text-2xl font-bold text-text-primary mb-3 font-display leading-tight decoration-text-muted transition-all"
      >
        <RouterLink
          :to="`/work/${work.slug}`"
          class="group-hover:underline underline-offset-4 decoration-1 decoration-accent before:absolute before:inset-0 z-0 focus:outline-none"
        >
          {{ work.title }}
        </RouterLink>
      </h3>

      <!-- Status & Rating -->
      <div class="flex flex-wrap items-center gap-3 mb-2 text-xs font-sans relative z-10">
        <span class="px-2 py-0.5 rounded border border-accent/30 text-accent font-bold">
          {{ work.rating }}
        </span>
        <span
          :class="work.stats.status === 'Complete' ? 'text-green-500' : 'text-text-secondary'"
          class="font-bold"
        >
          {{ work.stats.status }}
        </span>
      </div>

      <!-- Warnings (Restored Style) -->
      <div
        v-if="work.warnings?.length"
        class="mb-4 text-xs font-sans text-text-muted relative z-10 leading-relaxed"
      >
        <!-- Лейбл -->
        <span class="text-text-secondary font-bold">Warnings: </span>
        <!-- Список -->
        <span>{{ work.warnings.join(', ') }}</span>
      </div>

      <!-- Summary -->
      <p
        class="text-text-secondary line-clamp-3 mb-5 font-light text-base font-display leading-relaxed"
      >
        {{ work.summary }}
      </p>

      <!-- Tags -->
      <div class="mt-auto flex flex-wrap gap-2 relative z-20 pointer-events-auto">
        <BaseTag
          v-for="tag in work.tags"
          :key="tag"
          :label="tag"
          @click.stop="$emit('clickTag', tag)"
        />
      </div>
    </div>
  </article>
</template>
