<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Work } from '@/entities/work';
import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';
import { ReaderSettings } from '@/features/customize-reading';

const props = defineProps<{ work: Work }>();

const currentChapter = ref(1);
// Ссылка на компонент ViewerContent
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null);
// Реактивная ссылка на сам DOM-элемент
const contentElement = ref<HTMLElement | null>(null);

// Синхронизируем ref после монтирования
onMounted(() => {
  if (viewerContentRef.value) {
    contentElement.value = viewerContentRef.value.contentElement;
  }
});

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
    <!-- 1. Progress Bar (передаем конкретный элемент для отслеживания) -->
    <ReadingProgress :target-element="contentElement" />

    <!-- 2. Header Info -->
    <ViewerHeader :work="work" />

    <!-- 3. Toolbar: Controls + Settings -->
    <div class="sticky top-4 z-30 flex gap-4 items-start justify-between mb-8 pointer-events-none">
      <div class="pointer-events-auto flex-1 max-w-2xl mx-auto w-full">
        <ViewerControls
          :current-chapter="currentChapter"
          :total-chapters="work.stats.chapters"
          @next="nextChapter"
          @prev="prevChapter"
          class="!mb-0 !sticky !top-0 shadow-lg"
        />
      </div>
      <div class="pointer-events-auto pt-2 hidden md:block">
        <ReaderSettings />
      </div>
    </div>

    <!-- Mobile Settings (Fixed Button) -->
    <div class="md:hidden fixed bottom-6 right-6 z-40">
      <!-- Передаем placement="top", чтобы меню открывалось ВВЕРХ -->
      <ReaderSettings placement="top" />
    </div>

    <!-- 4. Main Content (привязываем ref) -->
    <ViewerContent
      ref="viewerContentRef"
      :content="work.content || '<p>Data corrupted. No content available.</p>'"
    />
  </div>
</template>
