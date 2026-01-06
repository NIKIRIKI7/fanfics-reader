<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import type { Work } from '@/entities/work';

import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';

// Features
import { ReaderSettings } from '@/features/customize-reading';
// НОВАЯ ФИЧА
import { useReadingProgressStore, ResumePrompt } from '@/features/reading-progress';

const props = defineProps<{ work: Work }>();

// Stores & State
const progressStore = useReadingProgressStore();
const currentChapter = ref(1);
const showResumePrompt = ref(false);
const savedProgressState = ref<{ chapter: number; scroll: number } | null>(null);

// Refs for DOM
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null);
const contentElement = ref<HTMLElement | null>(null);

// --- SCROLL TRACKING LOGIC ---
let scrollTimeout: number | null = null;

const handleScroll = () => {
  if (scrollTimeout) return;

  // Throttle saving (сохраняем не чаще чем раз в 500мс)
  scrollTimeout = window.setTimeout(() => {
    // Сохраняем текущую позицию и главу
    progressStore.saveProgress(
      props.work.slug,
      currentChapter.value,
      window.scrollY
    );
    scrollTimeout = null;
  }, 500);
};

// --- NAVIGATION LOGIC ---

const nextChapter = () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++;
    // При смене главы скролл сбрасывается на 0
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Принудительно сохраняем новую главу с 0 скроллом
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0);
  }
};

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0);
  }
};

// --- RESUME LOGIC ---

const checkProgress = () => {
  const saved = progressStore.getProgress(props.work.slug);

  // Если есть сохранение И (глава > 1 ИЛИ скролл > 200px)
  if (saved && (saved.chapter > 1 || saved.scroll > 200)) {
    savedProgressState.value = saved;
    showResumePrompt.value = true;

    // Авто-скрытие плашки через 10 секунд
    setTimeout(() => {
      showResumePrompt.value = false;
    }, 10000);
  }
};

const resumeReading = async () => {
  if (!savedProgressState.value) return;

  const { chapter, scroll } = savedProgressState.value;

  // 1. Устанавливаем главу
  currentChapter.value = chapter;
  showResumePrompt.value = false;

  // 2. Ждем ре-рендера контента
  await nextTick();

  // 3. Восстанавливаем скролл
  window.scrollTo({
    top: scroll,
    behavior: 'smooth'
  });
};

const closePrompt = () => {
  showResumePrompt.value = false;
};

// --- LIFECYCLE ---

onMounted(() => {
  if (viewerContentRef.value) {
    contentElement.value = viewerContentRef.value.contentElement;
  }

  // Проверяем наличие сохранений
  checkProgress();

  // Начинаем слушать скролл
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<template>
  <div class="animate-in fade-in duration-500 relative">
    <ReadingProgress :target-element="contentElement" />
    <ViewerHeader :work="work" />

    <div class="flex gap-4 items-start justify-between mb-8 relative z-20">
      <div class="flex-1 max-w-2xl mx-auto w-full">
        <ViewerControls
          :current-chapter="currentChapter"
          :total-chapters="work.stats.chapters"
          @next="nextChapter" @prev="prevChapter"
          class="!mb-0"
        />
      </div>

      <div class="pt-2 hidden md:block">
        <ReaderSettings />
      </div>
    </div>

    <div class="md:hidden fixed bottom-6 right-6 z-40">
      <ReaderSettings placement="top" />
    </div>

    <ViewerContent
      ref="viewerContentRef"
      :content="work.content || '<p>Data corrupted. No content available.</p>'"
    />

    <!-- НОВЫЙ КОМПОНЕНТ: Подсказка о восстановлении -->
    <ResumePrompt
      :is-visible="showResumePrompt"
      :chapter="savedProgressState?.chapter || 1"
      @resume="resumeReading" @close="closePrompt"
    />
  </div>
</template>
