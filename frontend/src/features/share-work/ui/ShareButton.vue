<script setup lang="ts">
import { ref } from 'vue';
import type { Work } from '@/entities/work';
import ShareModal from './ShareModal.vue';

defineProps<{ work: Work }>();

const isModalOpen = ref(false);
</script>

<template>
  <button 
    @click="isModalOpen = true"
    class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background-primary text-text-secondary hover:text-text-primary hover:border-text-muted transition-all text-xs uppercase font-bold tracking-wider shadow-sm group"
    title="Share Transmission"
  >
    <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">share</span>
    <span class="hidden md:inline">Share</span>
  </button>

  <ShareModal 
    :work="work" 
    :is-open="isModalOpen" 
    @close="isModalOpen = false" 
  />
</template>