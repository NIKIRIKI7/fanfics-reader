<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import type { Work } from '@/entities/work';

// Local Parts
import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';

// Features
import { ReaderSettings, useReadingSettingsStore } from '@/features/customize-reading';
import { useReadingProgressStore, ResumePrompt } from '@/features/reading-progress';
import { storeToRefs } from 'pinia';

const props = defineProps<{ work: Work }>();

// Stores
const progressStore = useReadingProgressStore();
const settingsStore = useReadingSettingsStore();
const { isFocusMode } = storeToRefs(settingsStore);

// State
const currentChapter = ref(1);
const showResumePrompt = ref(false);
const savedProgressState = ref<{ chapter: number; scroll: number } | null>(null);

// Refs
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null);
const contentElement = ref<HTMLElement | null>(null);

// Scroll Logic
let scrollTimeout: number | null = null;
const handleScroll = () => {
  if (scrollTimeout) return;
  scrollTimeout = window.setTimeout(() => {
    progressStore.saveProgress(props.work.slug, currentChapter.value, window.scrollY);
    scrollTimeout = null;
  }, 500);
};

// Focus Mode Logic (ESC Key)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFocusMode.value) {
    settingsStore.setFocusMode(false);
  }
};

// Navigation
const nextChapter = () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Resume Logic
const checkProgress = () => {
  const saved = progressStore.getProgress(props.work.slug);
  if (saved && (saved.chapter > 1 || saved.scroll > 200)) {
    savedProgressState.value = saved;
    showResumePrompt.value = true;
    setTimeout(() => showResumePrompt.value = false, 10000);
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
const closePrompt = () => { showResumePrompt.value = false; };

// Lifecycle
onMounted(() => {
  if (viewerContentRef.value) contentElement.value = viewerContentRef.value.contentElement;
  checkProgress();
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Слушаем ESC
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeydown);
  if (scrollTimeout) clearTimeout(scrollTimeout);
  // При уходе со страницы выключаем режим фокуса, чтобы он не сломал другие страницы
  settingsStore.setFocusMode(false);
});
</script>

<template>
  <div class="animate-in fade-in duration-500 relative min-h-screen">

    <!-- Кнопка выхода из Zen Mode (Видна только когда isFocusMode = true) -->
    <transition name="fade">
      <button
        v-if="isFocusMode"
        @click="settingsStore.setFocusMode(false)"
        class="fixed top-6 right-6 z-50 p-3 rounded-full bg-background-secondary/10 hover:bg-background-secondary/80 text-text-muted hover:text-text-primary backdrop-blur transition-all duration-300 group"
        title="Exit Focus Mode (Esc)"
      >
        <span class="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">close_fullscreen</span>
      </button>
    </transition>

    <ReadingProgress :target-element="contentElement" />

    <!-- Скрываем заголовок в режиме фокуса для максимального погружения -->
    <transition name="fade">
      <div v-show="!isFocusMode">
        <ViewerHeader :work="work" />
      </div>
    </transition>

    <!-- Toolbar: Скрываем в режиме фокуса -->
    <transition name="slide-up">
      <div v-show="!isFocusMode" class="flex gap-4 items-start justify-between mb-8 relative z-20">
        <div class="flex-1 max-w-2xl mx-auto w-full">
          <ViewerControls
            :current-chapter="currentChapter"
            :total-chapters="work.stats.chapters"
            @next="nextChapter" @prev="prevChapter"
            class="!mb-0"
          />
        </div>

        <div class="pt-2 hidden md:flex items-center gap-2">
          <!-- Кнопка включения Zen Mode -->
          <button
            @click="settingsStore.setFocusMode(true)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background-primary text-text-muted hover:text-text-primary hover:border-text-muted transition-all text-xs uppercase font-bold tracking-wider shadow-sm"
            title="Enter Focus Mode"
          >
            <span class="material-symbols-outlined text-[20px]">open_in_full</span>
            <span class="hidden xl:inline">Focus</span>
          </button>

          <ReaderSettings />
        </div>
      </div>
    </transition>

    <!-- Mobile Settings -->
    <div v-show="!isFocusMode" class="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
       <!-- Кнопка Zen Mode для мобильных -->
      <button
        @click="settingsStore.setFocusMode(true)"
        class="p-3 rounded-full bg-background-primary border border-border shadow-lg text-text-secondary"
      >
        <span class="material-symbols-outlined text-[20px]">open_in_full</span>
      </button>
      <ReaderSettings placement="top" />
    </div>

    <ViewerContent
      ref="viewerContentRef"
      :content="work.content || '<p>Data corrupted. No content available.</p>'"
    />

    <ResumePrompt
      :is-visible="showResumePrompt"
      :chapter="savedProgressState?.chapter || 1"
      @resume="resumeReading" @close="closePrompt"
    />
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
