<script setup lang="ts">
import { ref } from 'vue';
import type { Work } from '@/entities/work';
import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';
import { ReaderSettings } from '@/features/customize-reading';

const props = defineProps<{ work: Work }>();

// Simple local state for chapter simulation
const currentChapter = ref(1);

const nextChapter = () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="animate-in fade-in duration-500 relative">
    <!-- 1. Progress Bar (Global for page) -->
    <ReadingProgress />

    <!-- 2. Header Info -->
    <ViewerHeader :work="work" />

    <!-- 3. Toolbar: Controls + Settings -->
    <!-- Делаем sticky контейнер, который держит и навигацию по главам, и настройки -->
    <div class="sticky top-4 z-30 flex gap-4 items-start justify-between mb-8 pointer-events-none">

      <!-- Левая часть: Навигация (включаем pointer-events обратно) -->
      <div class="pointer-events-auto flex-1 max-w-2xl mx-auto w-full">
         <!-- Переиспользуем ViewerControls, но нужно убедиться, что он хорошо выглядит внутри -->
         <ViewerControls
            :current-chapter="currentChapter"
            :total-chapters="work.stats.chapters"
            @next="nextChapter" @prev="prevChapter"
            class="!mb-0 !sticky !top-0 shadow-lg"
          />
      </div>

      <!-- Правая часть: Настройки (включаем pointer-events обратно) -->
      <div class="pointer-events-auto pt-2 hidden md:block">
        <ReaderSettings />
      </div>
    </div>

    <!-- Для мобильных устройств настройки можно вынести отдельно или оставить плавающими -->
    <div class="md:hidden fixed bottom-6 right-6 z-40">
       <ReaderSettings />
    </div>

    <!-- 4. Main Content -->
    <ViewerContent :content="work.content || '<p>Data corrupted. No content available.</p>'" />
  </div>
</template>