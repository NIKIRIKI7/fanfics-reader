<script setup lang="ts">
import { onEnterFade, onLeaveFade } from '@/shared/lib/gsapTransitions'
import gsap from 'gsap'
import { X, CheckCircle, ArrowRight } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  currentChapter: number
  totalChapters: number
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'select', chapter: number): void
}>()

// Custom transition for the sheet specifically
const onEnterSheet = (el: Element, done: () => void) => {
  gsap.fromTo(el, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power3.out', onComplete: done })
}

const onLeaveSheet = (el: Element, done: () => void) => {
  gsap.to(el, { y: '100%', duration: 0.3, ease: 'power3.in', onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition :css="false" @enter="onEnterFade" @leave="onLeaveFade">
      <div
        v-if="isOpen"
        @click="$emit('close')"
        class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      ></div>
    </transition>

    <!-- Sheet -->
    <transition :css="false" @enter="onEnterSheet" @leave="onLeaveSheet">
      <div
        v-if="isOpen"
        class="fixed bottom-0 left-0 right-0 z-[70] bg-background-secondary border-t border-border rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col w-full max-w-2xl mx-auto"
      >
        <!-- Header / Handle -->
        <div class="flex-none p-4 border-b border-border flex items-center justify-between">
          <span class="text-sm font-bold uppercase tracking-widest text-text-muted"
            >Table of Contents</span
          >
          <button
            @click="$emit('close')"
            class="p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-background-tertiary"
          >
            <X :size="24" />
          </button>
        </div>

        <!-- Scrollable List -->
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="i in totalChapters"
              :key="i"
              @click="$emit('select', i)"
              class="flex items-center justify-between p-4 rounded-lg transition-all border text-left group"
              :class="[
                currentChapter === i
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-background-primary border-border text-text-secondary hover:border-text-muted hover:text-text-primary',
              ]"
            >
              <span class="font-sans font-bold text-sm">Chapter {{ i }}</span>

              <CheckCircle v-if="currentChapter === i" :size="20" />
              <ArrowRight
                v-else
                class="opacity-0 group-hover:opacity-100 text-text-muted transition-opacity"
                :size="20"
              />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}
</style>
