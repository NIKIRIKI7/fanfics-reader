<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import { useOfflineStore } from '../model/store';
import type { Work } from '@/entities/work';
import gsap from 'gsap';

const props = defineProps<{ work: Work }>();
const store = useOfflineStore();

const isDownloaded = computed(() => store.isDownloaded(props.work.id));
const buttonRef = ref<HTMLElement | null>(null);
const iconRef = ref<HTMLElement | null>(null);

const handleToggle = async () => {
  // Анимация нажатия
  if (buttonRef.value) {
    gsap.to(buttonRef.value, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  }
  store.toggleDownload(props.work);
};

// Анимация иконки при изменении статуса
watch(isDownloaded, async (newVal) => {
  await nextTick();
  if (iconRef.value) {
    gsap.fromTo(iconRef.value,
      { rotation: -180, scale: 0.5, opacity: 0 },
      { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
    );
  }
});
</script>

<template>
  <button
    ref="buttonRef"
    @click="handleToggle"
    class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm group"
    :class="[
      isDownloaded
        ? 'bg-green-500/10 border-green-500 text-green-500'
        : 'bg-background-primary border-border text-text-muted hover:text-text-primary hover:border-text-muted'
    ]"
    :title="isDownloaded ? 'Remove from Offline' : 'Download for Offline'"
  >
    <div class="relative w-5 h-5 flex items-center justify-center">
      <span
        ref="iconRef"
        :key="isDownloaded ? 'check' : 'download'"
        class="material-symbols-outlined text-[20px] absolute"
      >
        {{ isDownloaded ? 'offline_pin' : 'download' }}
      </span>
    </div>
    <span class="hidden xl:inline">
      {{ isDownloaded ? 'Downloaded' : 'Offline' }}
    </span>
  </button>
</template>