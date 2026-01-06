<script setup lang="ts">
import { useViewHistoryStore } from '../model/store';
import { WorkCard } from '@/entities/work';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useWorkFilterStore } from '@/features/filter-works';

const historyStore = useViewHistoryStore();
const { history } = storeToRefs(historyStore);
const router = useRouter();
const filterStore = useWorkFilterStore();

const handleTagClick = (tag: string) => {
  filterStore.searchByTag(tag);
  router.push('/works');
};
</script>

<template>
  <section v-if="history.length > 0" class="w-full animate-in fade-in duration-700">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 history-grid">
      <WorkCard
        v-for="work in history"
        :key="work.id"
        :work="work"
        @clickTag="handleTagClick"
        class="h-full"
      />
    </div>
  </section>
</template>

<style scoped>
/*
  ВАЖНО: Переопределяем стили WorkCard только внутри этого компонента.
  Мы заставляем карточки быть вертикальными (картинка сверху, текст снизу)
  независимо от ширины экрана. Это исправляет проблему сплющивания.
*/
.history-grid :deep(article) {
  flex-direction: column !important; /* Всегда колонка */
  height: 100%;
  padding: 1rem; /* Чуть меньше паддинги */
  background-color: rgba(var(--bg-tertiary), 0.3); /* Более прозрачный фон */
}

/* Настраиваем размер картинки */
.history-grid :deep(article > div:first-child) {
  width: 100% !important;
  height: 220px !important; /* Фиксированная высота обложки */
  margin-bottom: 1rem;
}

/* Скрываем саммари (описание), чтобы карточки были компактными,
   или ограничиваем его одной строкой */
.history-grid :deep(article p.line-clamp-2),
.history-grid :deep(article p.line-clamp-3) {
  -webkit-line-clamp: 2 !important; /* Ограничиваем описание */
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Уменьшаем размер заголовка */
.history-grid :deep(article h3) {
  font-size: 1.25rem; /* text-xl вместо 2xl */
  margin-bottom: 0.5rem;
}

/* Убираем лишние отступы у тегов */
.history-grid :deep(article .mt-2) {
  margin-top: auto !important; /* Теги прижимаем к низу */
  padding-top: 1rem;
}
</style>