<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works';
import { WorkCard, WorkCardSkeleton } from '@/entities/work';
import { BookmarkButton } from '@/features/manage-library';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const store = useWorkFilterStore();
const { filteredWorks } = storeToRefs(store);

const isLoading = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const filterRef = ref<HTMLElement | null>(null);
const rootRef = ref<HTMLElement | null>(null); // Для контекста

let ctx: gsap.Context;

const handleTagClick = (tag: string) => {
  store.searchByTag(tag);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const animateItems = () => {
  // 1. Если контекст уже был, делаем revert.
  // Это очищает ВСЕ анимации и триггеры, созданные ВНУТРИ этого контекста.
  // Не трогая глобальные триггеры других компонентов.
  if (ctx) ctx.revert();

  // 2. Создаем новый контекст, привязанный к rootRef
  ctx = gsap.context(() => {

    // Анимация фильтра
    if (filterRef.value) {
      gsap.fromTo(filterRef.value,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }

    // Анимация карточек
    if (containerRef.value) {
      const items = containerRef.value.querySelectorAll('.work-item');
      if (items.length > 0) {
        // Устанавливаем начальное состояние
        gsap.set(items, { opacity: 0, y: 30 });

        // Создаем Batch
        ScrollTrigger.batch(items, {
          start: 'top 95%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: 'back.out(1.2)',
              overwrite: true
            });
          },
          once: true
        });
      }
    }
  }, rootRef.value); // <--- ВАЖНО: Scope
};

watch(filteredWorks, async () => {
  await nextTick();
  animateItems();
  ScrollTrigger.refresh(); // Важно при изменении контента
});

onMounted(async () => {
  await nextTick();
  // Небольшая задержка, чтобы убедиться, что Vue Transition закончился
  setTimeout(() => {
    animateItems();
    ScrollTrigger.refresh();
  }, 100);
});

onUnmounted(() => {
  if (ctx) ctx.revert(); // Полная очистка при уходе со страницы
});
</script>

<template>
  <section ref="rootRef">
    <!-- Feature: Filter (Анимируем появление) -->
    <div ref="filterRef" class="opacity-0">
      <WorkFilter class="mb-8" />
    </div>

    <!-- Skeletons -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Data -->
    <div v-else ref="containerRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
      <WorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
        class="work-item"
        @clickTag="handleTagClick"
      >
        <template #action>
          <BookmarkButton :work="work" size="sm" />
        </template>
      </WorkCard>

      <!-- Empty State -->
      <div
        v-if="filteredWorks.length === 0"
        class="col-span-full py-12 text-center border border-dashed border-border rounded-xl work-item bg-background-tertiary/5"
      >
        <div class="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4 text-text-muted">
           <span class="material-symbols-outlined text-3xl">search_off</span>
        </div>
        <p class="text-text-muted font-display italic text-lg mb-2">Signal lost.</p>
        <p class="text-text-secondary text-sm mb-6">No records match your current parameters.</p>
        <button
          @click="store.resetFilters"
          class="px-6 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-background-primary rounded-full transition-all text-sm font-bold uppercase tracking-wider"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </section>
</template>
