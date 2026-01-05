<script setup lang="ts">
defineProps<{
  currentChapter: number;
  totalChapters: number;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<template>
  <div class="sticky top-20 z-30 flex justify-between items-center bg-background-secondary/90 backdrop-blur p-4 rounded-lg border border-border mb-8 shadow-sm transition-all">
    <button 
      @click="$emit('prev')"
      :disabled="currentChapter <= 1"
      class="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
      title="Previous Chapter"
    >
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    
    <span class="text-sm font-bold text-text-primary font-sans">
      Chapter {{ currentChapter }} / {{ totalChapters }}
    </span>
    
    <button 
      @click="$emit('next')"
      :disabled="currentChapter >= totalChapters"
      class="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
      title="Next Chapter"
    >
      <span class="material-symbols-outlined">arrow_forward</span>
    </button>
  </div>
</template>