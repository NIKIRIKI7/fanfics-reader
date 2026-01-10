<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { Work } from '@/entities/work'
import ViewerHeader from './parts/ViewerHeader.vue'
import ViewerControls from './parts/ViewerControls.vue'
import ViewerContent from './parts/ViewerContent.vue'
import ReadingProgress from './parts/ReadingProgress.vue'
import ChapterListModal from './parts/ChapterListModal.vue'
import MobileToolbar from './parts/MobileToolbar.vue'

import { ReaderSettings, useReadingSettingsStore, ReadingRuler } from '@/features/customize-reading'
import { useReadingProgressStore, ResumePrompt } from '@/features/reading-progress'
import { useViewHistoryStore } from '@/features/view-history'
import { ShareButton } from '@/features/share-work'
import { AudioReaderWidget } from '@/features/audio-reader'
import { DownloadButton } from '@/features/offline-mode'
import { useContentProtection } from '@/features/content-protection' // <--- IMPORT
import { storeToRefs } from 'pinia'
import {
  onEnterFade,
  onLeaveFade,
  onEnterSlideUp,
  onLeaveSlideUp,
} from '@/shared/lib/gsapTransitions'
import { Minimize, Maximize } from 'lucide-vue-next'

// Активируем защиту контента
useContentProtection(true)

const props = defineProps<{ work: Work }>()
const progressStore = useReadingProgressStore()
const settingsStore = useReadingSettingsStore()
const historyStore = useViewHistoryStore()
const { isFocusMode } = storeToRefs(settingsStore)
const currentChapter = ref(1)
const showResumePrompt = ref(false)
const isChapterListOpen = ref(false)
const savedProgressState = ref<{ chapter: number; scroll: number } | null>(null)
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null)
const contentElement = ref<HTMLElement | null>(null)
let scrollTimeout: number | null = null

const scrollToContentStart = () => {
  if (viewerContentRef.value) {
    contentElement.value = viewerContentRef.value.contentElement
  }
  if (contentElement.value) {
    const rect = contentElement.value.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const absoluteTop = rect.top + scrollTop
    window.scrollTo({ top: absoluteTop - 100, behavior: 'instant' })
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}
const handleScroll = () => {
  if (scrollTimeout) return
  scrollTimeout = window.setTimeout(() => {
    progressStore.saveProgress(props.work.slug, currentChapter.value, window.scrollY)
    scrollTimeout = null
  }, 500)
}
const nextChapter = async () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++
    await nextTick()
    scrollToContentStart()
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0)
  }
}
const prevChapter = async () => {
  if (currentChapter.value > 1) {
    currentChapter.value--
    await nextTick()
    scrollToContentStart()
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0)
  }
}
const toggleChapterList = () => {
  isChapterListOpen.value = !isChapterListOpen.value
}
const selectChapter = async (chapter: number) => {
  if (chapter !== currentChapter.value) {
    currentChapter.value = chapter
    await nextTick()
    scrollToContentStart()
    progressStore.saveProgress(props.work.slug, currentChapter.value, 0)
  }
  isChapterListOpen.value = false
}
const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  if (e.key === 'ArrowLeft') prevChapter()
  if (e.key === 'ArrowRight') nextChapter()
  if (e.key.toLowerCase() === 'm') settingsStore.toggleSettings('desktop-settings') // Тут тоже можно передать ID, но для хоткея не критично
  if (e.key.toLowerCase() === 'f') settingsStore.toggleFocusMode()
  if (e.key === 'Escape') {
    if (isChapterListOpen.value) isChapterListOpen.value = false
    else if (settingsStore.activeMenuId) settingsStore.closeSettings()
    else if (isFocusMode.value) settingsStore.setFocusMode(false)
  }
}
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (touch) {
    touchStartX.value = touch.screenX
    touchStartY.value = touch.screenY
  }
}
const handleTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (touch) {
    touchEndX.value = touch.screenX
    touchEndY.value = touch.screenY
    handleSwipe()
  }
}
const handleSwipe = () => {
  const diffX = touchStartX.value - touchEndX.value
  const diffY = touchStartY.value - touchEndY.value
  if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
    if (diffX > 0) nextChapter()
    else prevChapter()
  }
}
const checkProgress = () => {
  const saved = progressStore.getProgress(props.work.slug)
  if (saved && (saved.chapter > 1 || saved.scroll > 200)) {
    savedProgressState.value = saved
    showResumePrompt.value = true
    setTimeout(() => (showResumePrompt.value = false), 10000)
  }
}
const resumeReading = async () => {
  if (!savedProgressState.value) return
  const { chapter, scroll } = savedProgressState.value
  currentChapter.value = chapter
  showResumePrompt.value = false
  await nextTick()
  setTimeout(() => {
    window.scrollTo({ top: scroll, behavior: 'instant' })
  }, 50)
}
const closePrompt = () => {
  showResumePrompt.value = false
}
onMounted(() => {
  if (viewerContentRef.value) contentElement.value = viewerContentRef.value.contentElement
  checkProgress()
  historyStore.addWork(props.work)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  if (scrollTimeout) clearTimeout(scrollTimeout)
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

    <!-- Reading Ruler -->
    <ReadingRuler />

    <ReadingProgress :target-element="contentElement" />

    <transition :css="false" @enter="onEnterFade" @leave="onLeaveFade">
      <div v-show="!isFocusMode">
        <ViewerHeader :work="work" />
      </div>
    </transition>

    <!-- Top Controls Section -->
    <transition :css="false" @enter="onEnterSlideUp" @leave="onLeaveSlideUp">
      <div
        v-show="!isFocusMode"
        class="flex flex-col items-center gap-4 mb-10 relative z-20 w-full"
      >
        <div class="w-full max-w-2xl mx-auto px-4 md:px-0">
          <ViewerControls
            :current-chapter="currentChapter"
            :total-chapters="work.stats.chapters"
            @next="nextChapter"
            @prev="prevChapter"
            @toggle-list="toggleChapterList"
            class="!mb-0"
          />
        </div>

        <!-- Desktop Toolbar Buttons -->
        <div class="hidden md:flex flex-wrap items-center justify-center gap-3">
          <AudioReaderWidget
            :content="work.content || ''"
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
          <!-- ИЗМЕНЕНИЕ: Передаем уникальный ID для десктопа -->
          <ReaderSettings menu-id="desktop-settings" />
        </div>
      </div>
    </transition>

    <!-- Content -->
    <div class="protected-content">
      <ViewerContent
        ref="viewerContentRef"
        :content="work.content || '<p>Data corrupted. No content available.</p>'"
        :soundtracks="work.soundtracks"
      />
    </div>

    <!-- Mobile Bottom Toolbar -->
    <MobileToolbar :work="work" :is-visible="!isFocusMode" />

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
