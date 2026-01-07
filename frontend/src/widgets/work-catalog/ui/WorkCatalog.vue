<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works';
import { WorkCard, WorkCardSkeleton } from '@/entities/work';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const store = useWorkFilterStore();
const { filteredWorks } = storeToRefs(store);
const isLoading = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const handleTagClick = (tag: string) => {
  store.searchByTag(tag);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Функция запуска анимации списка
const animateItems = () => {
  if (!containerRef.value) return;

  // Убиваем старые триггеры
  ScrollTrigger.getAll().forEach(t => t.kill());

  // Выбираем карточки внутри контейнера
  const items = containerRef.value.querySelectorAll('.work-item');

  if (items.length > 0) {
    // Скрываем перед анимацией
    gsap.set(items, { opacity: 0, y: 30 });

    ScrollTrigger.batch(items, {
      start: 'top 90%',
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true
        });
      },
      once: true
    });
  }
};

// Следим за изменениями в списке работ (фильтрация)
watch(filteredWorks, async () => {
  await nextTick();
  animateItems();
});

onMounted(async () => {
  await nextTick();
  animateItems();
});
</script>

<template>
  <section>
    <!-- Feature: Filter -->
    <WorkFilter class="mb-8" />

    <!-- Loading State: Skeletons -->
    <div v-if="isLoading" class="grid grid-cols-1 gap-6">
      <WorkCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Data State: Real Cards -->
    <div v-else ref="containerRef" class="grid grid-cols-1 gap-6">
      <!-- Добавили класс work-item для селектора GSAP -->
      <WorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
        class="work-item"
        @clickTag="handleTagClick"
      />

      <!-- Empty State -->
      <div
        v-if="filteredWorks.length === 0"
        class="py-12 text-center border border-dashed border-border rounded-xl work-item"
      >
        <p class="text-text-muted font-display italic text-lg">Signal lost. No records match your parameters.</p>
        <button
          @click="store.resetFilters"
          class="mt-4 text-accent hover:underline text-sm font-bold"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </section>
</template>
