<script setup lang="ts">
import { type Work } from '@/entities/work'
import { useReadingSettingsStore, ReaderSettings } from '@/features/customize-reading'
import { AudioReaderWidget } from '@/features/audio-reader'
import { DownloadButton } from '@/features/offline-mode'
import { ShareButton } from '@/features/share-work'
import gsap from 'gsap'

defineProps<{
  work: Work
  isVisible: boolean
}>()

const settingsStore = useReadingSettingsStore()

// Анимации
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power3.out', onComplete: done })
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { y: '100%', duration: 0.3, ease: 'power3.in', onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="isVisible"
        class="fixed bottom-0 left-0 w-full z-[50] pointer-events-none md:hidden"
      >
        <!-- Container -->
        <div
          class="pointer-events-auto bg-background-secondary/95 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)]"
        >
          <div class="relative px-2 h-16 w-full max-w-lg mx-auto">
            <!-- Grid Layout -->
            <div class="grid grid-cols-5 h-full items-center justify-items-center">
              <!-- 1. Offline Mode -->
              <DownloadButton
                :work="work"
                variant="ghost"
                class="w-12 h-12 flex items-center justify-center"
              />

              <!-- 2. Audio -->
              <AudioReaderWidget
                :content="work.content || ''"
                :author-audio-url="work.authorAudioUrl"
                placement="top"
                variant="ghost"
                class="w-12 h-12 flex items-center justify-center"
              />

              <!-- 3. Focus Mode -->
              <div class="relative -top-6">
                <button
                  @click="settingsStore.setFocusMode(true)"
                  class="w-14 h-14 rounded-full bg-accent text-background-primary flex items-center justify-center shadow-xl shadow-accent/30 active:scale-95 transition-all border-4 border-background-secondary"
                  title="Enter Focus Mode"
                >
                  <span class="material-symbols-outlined text-[28px]">open_in_full</span>
                </button>
              </div>

              <!-- 4. Settings -->
              <!-- ИЗМЕНЕНИЕ: Передаем уникальный ID для мобильного меню -->
              <ReaderSettings
                placement="top"
                variant="ghost"
                menu-id="mobile-settings"
                class="w-12 h-12 flex items-center justify-center"
              />

              <!-- 5. Share -->
              <ShareButton
                :work="work"
                variant="ghost"
                class="w-12 h-12 flex items-center justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
:deep(.material-symbols-outlined) {
  font-size: 26px;
}
</style>
