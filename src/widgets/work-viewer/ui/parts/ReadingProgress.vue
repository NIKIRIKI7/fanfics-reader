<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

const calculateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
  if (docHeight <= 0) {
    progress.value = 0;
    return;
  }
  
  const percent = (scrollTop / docHeight) * 100;
  progress.value = Math.min(100, Math.max(0, percent));
};

onMounted(() => {
  window.addEventListener('scroll', calculateProgress);
  // Initial calc
  calculateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', calculateProgress);
});
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none">
    <div 
      class="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_10px_rgba(var(--color-accent),0.5)]"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>