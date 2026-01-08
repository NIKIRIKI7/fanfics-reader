<script setup lang="ts">
import { useViewHistoryStore } from '../model/store';
import { WorkCard } from '@/entities/work';
import { storeToRefs } from 'pinia';
import { onMounted, ref, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const historyStore = useViewHistoryStore();
const { history } = storeToRefs(historyStore);
const containerRef = ref<HTMLElement | null>(null);

// FIX: Вместо использования filterStore напрямую, эмитим событие наверх
const emit = defineEmits<{
  (e: 'clickTag', tag: string): void
}>();

const handleTagClick = (tag: string) => {
  emit('clickTag', tag);
};

onMounted(async () => {
  await nextTick();
  if (containerRef.value) {
    const items = containerRef.value.querySelectorAll('.history-item');
    gsap.set(items, { opacity: 0, y: 20 });

    ScrollTrigger.batch(items, {
      start: 'top 95%',
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out'
        });
      },
      once: true
    });
  }
});
</script>

<template>
  <section v-if="history.length > 0" class="w-full">
    <!-- Header -->
    <div class="flex items-end justify-between mb-8 border-b border-border/50 pb-4">
      <div class="flex flex-col gap-1">
        <h3 class="text-2xl font-display font-bold italic text-text-primary">Recently Decoded</h3>
        <p class="text-xs text-text-muted font-sans">Your personal reading logs from the Deep Field.</p>
      </div>

      <button
        @click="historyStore.clearHistory"
        class="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
      >
        <span class="material-symbols-outlined text-[16px] text-text-muted group-hover:text-red-500 transition-colors">delete_history</span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-red-500 transition-colors">Clear</span>
      </button>
    </div>

    <!-- Grid -->
    <div ref="containerRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 history-grid">
      <WorkCard
        v-for="work in history"
        :key="work.id"
        :work="work"
        @clickTag="handleTagClick"
        class="h-full history-item"
      >
        <!-- FIX: Слот для кнопки, чтобы избежать кросс-импорта -->
        <template #action>
           <slot name="action" :work="work"></slot>
        </template>
      </WorkCard>
    </div>
  </section>
</template>

<style scoped>
/* Стиль для более компактного вида в истории, если нужно, или просто убрать */
.history-grid :deep(article) {
  background-color: rgba(var(--bg-tertiary), 0.3);
}
</style>
