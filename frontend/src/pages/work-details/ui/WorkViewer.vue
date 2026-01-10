<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Work } from '@/entities/work'
import { getChapterContent } from '@/entities/work/api/mockData' // Импортируем мок-функцию

import ViewerHeader from './parts/ViewerHeader.vue'
import ViewerContent from './parts/ViewerContent.vue'
import ReadingProgress from './parts/ReadingProgress.vue'
import ChapterListModal from './parts/ChapterListModal.vue'
import MobileToolbar from './parts/MobileToolbar.vue'
import ChapterDivider from './parts/ChapterDivider.vue' // Новый компонент

import { ReaderSettings, useReadingSettingsStore, ReadingRuler } from '@/features/customize-reading'
import { useReadingProgressStore, ResumePrompt } from '@/features/reading-progress'
import { useViewHistoryStore } from '@/features/view-history'
import { ShareButton } from '@/features/share-work'
import { AudioReaderWidget } from '@/features/audio-reader'
import { DownloadButton } from '@/features/offline-mode'
import { useContentProtection } from '@/features/content-protection'
import { storeToRefs } from 'pinia'
import {
  onEnterFade,
  onLeaveFade,
  onEnterSlideUp,
  onLeaveSlideUp,
} from '@/shared/lib/gsapTransitions'
import { Minimize, Maximize, Loader2, ArrowDown, ChevronRight } from 'lucide-vue-next'
import { HapticPatterns, vibrate } from '@/shared/lib/haptics'

useContentProtection(true)

const props = defineProps<{ work: Work }>()

const router = useRouter()
const route = useRoute()
const progressStore = useReadingProgressStore()
const settingsStore = useReadingSettingsStore()
const historyStore = useViewHistoryStore()

const { isFocusMode, isInfiniteScrollEnabled } = storeToRefs(settingsStore)

// --- INFINITE SCROLL STATE ---
interface LoadedChapter {
  number: number
  content: string
  key: string // unique key for v-for
}

const loadedChapters = ref<LoadedChapter[]>([])
const isLoadingNext = ref(false)
const currentVisibleChapter = ref(1)
const showResumePrompt = ref(false)
const isChapterListOpen = ref(false)
const savedProgressState = ref<{ chapter: number; scroll: number } | null>(null)

// Для IntersectionObserver
const bottomTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let visibilityObserver: IntersectionObserver | null = null

// --- INITIALIZATION ---

const initChapters = async () => {
  // Определяем стартовую главу из URL или 1
  const queryChapter = Number(route.query.chapter) || 1
  currentVisibleChapter.value = queryChapter

  // Загружаем контент первой отображаемой главы
  const content = await getChapterContent(props.work.slug, queryChapter)

  loadedChapters.value = [{
    number: queryChapter,
    content: content,
    key: `chap-${queryChapter}-${Date.now()}`
  }]
}

// --- LOADING LOGIC ---

const loadNextChapter = async () => {
  // LINTER FIX: Проверка на пустой массив
  if (loadedChapters.value.length === 0) return

  const lastLoaded = loadedChapters.value[loadedChapters.value.length - 1]

  // LINTER FIX: TypeScript check
  if (!lastLoaded) return

  if (lastLoaded.number >= props.work.stats.chapters || isLoadingNext.value) return

  isLoadingNext.value = true
  vibrate(HapticPatterns.soft)

  try {
    const nextNum = lastLoaded.number + 1
    const content = await getChapterContent(props.work.slug, nextNum)

    loadedChapters.value.push({
      number: nextNum,
      content: content,
      key: `chap-${nextNum}-${Date.now()}`
    })

    await nextTick()
    observeChaptersVisibility()

  } catch (e) {
    console.error('Failed to load next chapter', e)
  } finally {
    isLoadingNext.value = false
  }
}

// --- SCROLL & OBSERVER LOGIC ---

const setupInfiniteScroll = () => {
  if (observer) observer.disconnect()

  // Если отключен - не создаем обсервер.
  if (!isInfiniteScrollEnabled.value) return

  observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    // LINTER FIX: Проверка target
    if (target && target.isIntersecting && !isLoadingNext.value) {
      loadNextChapter()
    }
  }, {
    rootMargin: '400px',
    threshold: 0
  })

  if (bottomTrigger.value) {
    observer.observe(bottomTrigger.value)
  }
}

const observeChaptersVisibility = () => {
  if (visibilityObserver) visibilityObserver.disconnect()

  visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rawIndex = (entry.target as HTMLElement).dataset.chapterIndex
        if (rawIndex) {
            const chapNum = Number(rawIndex)
            if (!isNaN(chapNum) && currentVisibleChapter.value !== chapNum) {
              updateActiveChapter(chapNum)
            }
        }
      }
    })
  }, {
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  })

  const chapterElements = document.querySelectorAll('.chapter-wrapper')
  chapterElements.forEach(el => visibilityObserver?.observe(el))
}

const updateActiveChapter = (chapter: number) => {
  currentVisibleChapter.value = chapter

  // Обновляем URL без перезагрузки (Shallow)
  router.replace({
    query: { ...route.query, chapter: chapter.toString() }
  })

  // Сохраняем прогресс
  progressStore.saveProgress(props.work.slug, chapter, 0) // scroll 0 условно, т.к. мы внутри главы
}

// --- NAVIGATION HANDLERS ---

const selectChapterFromMenu = async (chapter: number) => {
  isChapterListOpen.value = false

  // Если глава уже загружена, скроллим к ней
  const existing = loadedChapters.value.find(c => c.number === chapter)
  if (existing) {
    const el = document.querySelector(`[data-chapter-index="${chapter}"]`)
    el?.scrollIntoView({ behavior: 'smooth' })
    return
  }

  // Если нет - сбрасываем список и грузим выбранную (Hard Navigation)
  isLoadingNext.value = true
  loadedChapters.value = []
  const content = await getChapterContent(props.work.slug, chapter)
  loadedChapters.value = [{
    number: chapter,
    content,
    key: `chap-${chapter}-${Date.now()}`
  }]
  currentVisibleChapter.value = chapter
  window.scrollTo({ top: 0, behavior: 'instant' })
  isLoadingNext.value = false

  await router.replace({ query: { ...route.query, chapter: chapter.toString() } })
}

// --- LIFECYCLE ---

const checkProgress = () => {
  const saved = progressStore.getProgress(props.work.slug)
  // Если есть сохраненный прогресс и он отличается от 1 главы
  if (saved && (saved.chapter > 1 || saved.scroll > 200)) {
    // Если мы уже открыли эту главу через URL, то промпт не нужен
    if (saved.chapter !== currentVisibleChapter.value) {
      savedProgressState.value = saved
      showResumePrompt.value = true
    }
  }
}

const resumeReading = () => {
  if (savedProgressState.value) {
    selectChapterFromMenu(savedProgressState.value.chapter)
    showResumePrompt.value = false
  }
}

onMounted(async () => {
  // LINTER FIX: await добавлен
  await initChapters()
  checkProgress()
  historyStore.addWork(props.work)

  await nextTick()
  setupInfiniteScroll()
  observeChaptersVisibility()

  watch(() => loadedChapters.value.length, () => {
    setupInfiniteScroll()
  })

  watch(isInfiniteScrollEnabled, () => {
    setupInfiniteScroll()
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (visibilityObserver) visibilityObserver.disconnect()
  settingsStore.setFocusMode(false)
  settingsStore.closeSettings()
})
</script>

<template>
  <div class="relative min-h-screen pb-32 md:pb-0 transition-all duration-300">
    <!-- Exit Focus Mode -->
    <transition :css="false" @enter="onEnterFade" @leave="onLeaveFade">
      <button
        v-if="isFocusMode"
        @click="settingsStore.setFocusMode(false)"
        class="fixed top-6 right-6 z-50 p-3 rounded-full bg-background-secondary/10 hover:bg-background-secondary/80 text-text-muted hover:text-text-primary backdrop-blur transition-all duration-300 group"
        title="Exit Focus Mode (Esc)"
      >
        <Minimize class="group-hover:scale-110 transition-transform" :size="30" />
      </button>
    </transition>

    <!-- Reading Ruler & Progress (Global) -->
    <ReadingRuler />
    <ReadingProgress :target-element="null" /> <!-- Progress bar можно доработать под total scroll height, пока оставим -->

    <transition :css="false" @enter="onEnterFade" @leave="onLeaveFade">
      <div v-show="!isFocusMode">
        <ViewerHeader :work="work" />
      </div>
    </transition>

    <!-- Top Controls Section (Only visible at start) -->
    <transition :css="false" @enter="onEnterSlideUp" @leave="onLeaveSlideUp">
      <div
        v-show="!isFocusMode"
        class="flex flex-col items-center gap-4 mb-10 relative z-20 w-full"
      >
        <div class="w-full max-w-2xl mx-auto px-4 md:px-0 flex justify-center">
             <button
                @click="isChapterListOpen = true"
                class="flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-background-tertiary/50 hover:bg-background-tertiary hover:border-accent/50 transition-all group"
              >
                <span class="text-sm font-bold font-sans text-text-primary">
                   Reading Chapter {{ currentVisibleChapter }} of {{ work.stats.chapters }}
                </span>
                <ArrowDown class="text-text-muted group-hover:text-accent" :size="16" />
             </button>
        </div>

        <!-- Desktop Toolbar Buttons -->
        <div class="hidden md:flex flex-wrap items-center justify-center gap-3">
          <AudioReaderWidget
            :content="loadedChapters[0]?.content || ''"
            :author-audio-url="work.authorAudioUrl"
          />
          <DownloadButton :work="work" />
          <ShareButton :work="work" />
          <button
            @click="settingsStore.setFocusMode(true)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background-primary text-text-muted hover:text-text-primary hover:border-text-muted transition-all text-xs uppercase font-bold tracking-wider shadow-sm"
            title="Enter Focus Mode (F)"
          >
            <Maximize :size="20" />
            <span class="hidden xl:inline">Focus</span>
          </button>
          <ReaderSettings menu-id="desktop-settings" />
        </div>
      </div>
    </transition>

    <!-- INFINITE CONTENT STREAM -->
    <div class="protected-content flex flex-col min-h-[50vh]">

      <div
        v-for="(chapter, index) in loadedChapters"
        :key="chapter.key"
        class="chapter-container"
      >
        <!-- Divider if not first -->
        <ChapterDivider v-if="index > 0" :chapter="chapter.number" />

        <!-- Chapter Content Wrapper (Observed) -->
        <div class="chapter-wrapper" :data-chapter-index="chapter.number">
            <ViewerContent
              :content="chapter.content"
              :soundtracks="work.soundtracks"
            />
        </div>
      </div>

      <!-- Loading Trigger / Footer -->
      <div ref="bottomTrigger" class="min-h-[160px] flex flex-col items-center justify-center py-12 pb-24 md:pb-12 px-6">

        <!-- Case 1: Loading -->
        <div v-if="isLoadingNext" class="flex items-center gap-3 text-accent animate-pulse">
            <Loader2 class="animate-spin" :size="28" />
            <span class="text-xs font-bold uppercase tracking-[0.2em]">Decrypting Signal...</span>
        </div>

        <!-- Case 2: End of Work -->
        <div v-else-if="currentVisibleChapter >= work.stats.chapters" class="text-text-muted text-sm font-display italic text-center">
            <div class="mb-4 text-text-primary text-xl font-bold not-italic">End of Narrative</div>
            Waiting for further transmissions from {{ work.author }}.
        </div>

        <!-- Case 3: Load Next (Manual or Fallback) -->
        <!-- Отображаем кнопку, если Infinite Scroll отключен ИЛИ если мы не грузимся -->
        <button
           v-else
           @click="loadNextChapter"
           class="group relative overflow-hidden rounded-full border border-border bg-background-tertiary/30 px-8 py-4 md:px-6 md:py-2 transition-all duration-300 hover:border-accent hover:bg-background-tertiary active:scale-95 w-full md:w-auto flex items-center justify-center gap-3"
        >
           <!-- Mobile-friendly large button content -->
           <span class="text-sm md:text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
              {{ isInfiniteScrollEnabled ? 'Load Next Chapter' : 'Next Chapter' }}
           </span>
           <ChevronRight class="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" :size="20" />

           <!-- Hint for infinite scroll disabled -->
           <span v-if="!isInfiniteScrollEnabled" class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-text-muted/50 font-mono hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              MANUAL LOAD
           </span>
        </button>

      </div>

    </div>

    <!-- Mobile Bottom Toolbar -->
    <MobileToolbar :work="work" :is-visible="!isFocusMode" />

    <ResumePrompt
      :is-visible="showResumePrompt"
      :chapter="savedProgressState?.chapter || 1"
      @resume="resumeReading" @close="showResumePrompt = false"
    />

    <ChapterListModal
      :is-open="isChapterListOpen"
      :current-chapter="currentVisibleChapter"
      :total-chapters="work.stats.chapters"
      @close="isChapterListOpen = false"
      @select="selectChapterFromMenu"
    />
  </div>
</template>
