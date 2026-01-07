<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Work } from '@/entities/work';
import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';
import ChapterListModal from './parts/ChapterListModal.vue'; // Импорт нового компонента
import { ReaderSettings, useReadingSettingsStore } from '@/features/customize-reading';
import { useReadingProgressStore, ResumePrompt } from '@/features/reading-progress';
import { useViewHistoryStore } from '@/features/view-history';
import { ShareButton } from '@/features/share-work';
import { storeToRefs } from 'pinia';

const props = defineProps<{ work: Work }>();
const progressStore = useReadingProgressStore();
const settingsStore = useReadingSettingsStore();
const historyStore = useViewHistoryStore();
const { isFocusMode } = storeToRefs(settingsStore);

const currentChapter = ref(1);
const showResumePrompt = ref(false);
const isChapterListOpen = ref(false); // Состояние для шторки
const savedProgressState = ref<{ chapter: number; scroll: number } | null>(null);
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null);
const contentElement = ref<HTMLElement | null>(null);

let scrollTimeout: number | null = null;

// --- Helper: Scroll to Text Start ---
const scrollToContentStart = () => {
  if (contentElement.value) {
    const rect = contentElement.value.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const absoluteTop = rect.top + scrollTop;

    // Скролл с учетом небольшого отступа
    window.scrollTo({
      top: absoluteTop - 80,
      behavior: 'instant'
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
};

// --- Scroll & Progress Logic ---
const handleScroll = () => {
  if (scrollTimeout) return;
  scrollTimeout = window.setTimeout(() => {
    progressStore.saveProgress(props.work.slug, currentChapter.value, window.scrollY);
    scrollTimeout = null;
  }, 500);
};

// --- Navigation Logic ---
const nextChapter = () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++;
    scrollToContentStart();
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0);
  }
};

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--;
    scrollToContentStart();
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0);
  }
};

// --- Chapter List Logic (New) ---
const toggleChapterList = () => {
  isChapterListOpen.value = !isChapterListOpen.value;
};

const selectChapter = (chapter: number) => {
  if (chapter !== currentChapter.value) {
    currentChapter.value = chapter;
    scrollToContentStart();
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0);
  }
  isChapterListOpen.value = false;
};

// --- Keyboard Shortcuts ---
const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if (e.key === 'ArrowLeft') {
    prevChapter();
  }
  if (e.key === 'ArrowRight') {
    nextChapter();
  }
  if (e.key.toLowerCase() === 'm') {
    settingsStore.toggleSettings();
  }
  if (e.key.toLowerCase() === 'f') {
    settingsStore.toggleFocusMode();
  }
  if (e.key === 'Escape') {
    if (isChapterListOpen.value) {
      isChapterListOpen.value = false;
    } else if (settingsStore.isSettingsOpen) {
      settingsStore.setSettingsOpen(false);
    } else if (isFocusMode.value) {
      settingsStore.setFocusMode(false);
    }
  }
};

// --- Swipe Logic ---
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const touchEndY = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX;
  touchStartY.value = e.changedTouches[0].screenY;
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX;
  touchEndY.value = e.changedTouches[0].screenY;
  handleSwipe();
};

const handleSwipe = () => {
  const diffX = touchStartX.value - touchEndX.value;
  const diffY = touchStartY.value - touchEndY.value;
  const minSwipeDistance = 50;
  const maxVerticalDeviation = 100;

  if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffY) < maxVerticalDeviation) {
    if (diffX > 0) nextChapter();
    else prevChapter();
  }
};

// --- Resume Logic ---
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
  currentChapter.value = chapter;
  showResumePrompt.value = false;
  setTimeout(() => {
    window.scrollTo({ top: scroll, behavior: 'instant' });
  }, 50);
};

const closePrompt = () => { showResumePrompt.value = false; };

// --- Lifecycle ---
onMounted(() => {
  if (viewerContentRef.value) contentElement.value = viewerContentRef.value.contentElement;
  checkProgress();
  historyStore.addWork(props.work);

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);

  if (scrollTimeout) clearTimeout(scrollTimeout);
  settingsStore.setFocusMode(false);
  settingsStore.setSettingsOpen(false);
});
</script>

<template>
  <div class="animate-in fade-in duration-500 relative min-h-screen">
    <!-- Exit Focus Mode -->
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

    <transition name="fade">
      <div v-show="!isFocusMode">
        <ViewerHeader :work="work" />
      </div>
    </transition>

    <transition name="slide-up">
      <div v-show="!isFocusMode" class="flex gap-4 items-start justify-between mb-8 relative z-20">
        <div class="flex-1 max-w-2xl mx-auto w-full">
          <!-- Контролы теперь обрабатывают toggle-list -->
          <ViewerControls
            :current-chapter="currentChapter"
            :total-chapters="work.stats.chapters"
            @next="nextChapter"
            @prev="prevChapter"
            @toggle-list="toggleChapterList"
            class="!mb-0"
          />
        </div>

        <div class="pt-2 hidden md:flex items-center gap-2">
          <ShareButton :work="work" />
          <button
            @click="settingsStore.setFocusMode(true)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background-primary text-text-muted hover:text-text-primary hover:border-text-muted transition-all text-xs uppercase font-bold tracking-wider shadow-sm"
            title="Enter Focus Mode (F)"
          >
            <span class="material-symbols-outlined text-[20px]">open_in_full</span>
            <span class="hidden xl:inline">Focus</span>
          </button>
          <ReaderSettings />
        </div>
      </div>
    </transition>

    <!-- Mobile Controls Float -->
    <div v-show="!isFocusMode" class="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      <ShareButton :work="work" />
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
      @resume="resumeReading"
      @close="closePrompt"
    />

    <ChapterListModal
      :is-open="isChapterListOpen"
      :current-chapter="currentChapter"
      :total-chapters="work.stats.chapters"
      @close="isChapterListOpen = false"
      @select="selectChapter"
    />
  </div>
</template>
