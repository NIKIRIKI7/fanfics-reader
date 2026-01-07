<script setup lang="ts">
defineProps<{
  currentChapter: number;
  totalChapters: number;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'toggle-list'): void;
}>();
</script>

<template>
  <div class="relative flex justify-between items-center bg-background-secondary/90 backdrop-blur p-2 sm:p-4 rounded-lg border border-border mb-8 shadow-sm transition-all">
    <button
      @click="$emit('prev')"
      :disabled="currentChapter <= 1"
      class="p-2 sm:px-4 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-background-tertiary"
      title="Previous Chapter"
    >
      <span class="material-symbols-outlined">arrow_back</span>
    </button>

    <!-- Сделали центральную часть кнопкой -->
    <button
      @click="$emit('toggle-list')"
      class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-background-tertiary transition-colors group"
      title="Open Table of Contents"
    >
      <span class="text-xs sm:text-sm font-bold text-text-primary font-sans">
        Chapter {{ currentChapter }} / {{ totalChapters }}
      </span>
      <span class="material-symbols-outlined text-[16px] text-text-muted group-hover:text-accent transition-colors">expand_more</span>
    </button>

    <button
      @click="$emit('next')"
      :disabled="currentChapter >= totalChapters"
      class="p-2 sm:px-4 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-background-tertiary"
      title="Next Chapter"
    >
      <span class="material-symbols-outlined">arrow_forward</span>
    </button>
  </div>
</template>
