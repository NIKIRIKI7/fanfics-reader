<script setup lang="ts">
import { onEnterSlideUp, onLeaveSlideUp } from '@/shared/lib/gsapTransitions';

defineProps<{
  chapter: number;
  isVisible: boolean;
}>();

defineEmits<{
  (e: 'resume'): void;
  (e: 'close'): void;
}>();
</script>

<template>
  <transition
    :css="false"
    @enter="onEnterSlideUp" @leave="onLeaveSlideUp"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
    >
      <div class="bg-background-secondary/95 backdrop-blur-md border border-accent/20 shadow-2xl rounded-xl p-4 flex items-center justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-xs text-text-muted font-bold uppercase tracking-wider">Welcome Back</span>
          <span class="text-sm font-sans text-text-primary">
            Resume reading from <span class="font-bold text-accent">Chapter {{ chapter }}</span>?
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('close')"
            class="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-background-tertiary"
            title="Dismiss"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          <button
            @click="$emit('resume')"
            class="px-4 py-2 bg-accent text-background-primary text-sm font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>