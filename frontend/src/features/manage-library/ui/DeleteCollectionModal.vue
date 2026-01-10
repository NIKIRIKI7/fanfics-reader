<script setup lang="ts">
import { AlertTriangle, Trash2 } from 'lucide-vue-next'
import gsap from 'gsap'

defineProps<{
  isOpen: boolean
  title: string
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)', onComplete: done })
}
const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.2, onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>

      <transition :css="false" @enter="onEnter" @leave="onLeave" appear>
        <div class="relative w-full max-w-[320px] bg-background-secondary border border-red-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col items-center text-center">

          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle :size="24" />
          </div>

          <h3 class="text-lg font-bold text-text-primary mb-2">Delete Shelf?</h3>
          <p class="text-sm text-text-secondary mb-6 font-sans">
            Are you sure you want to delete <span class="font-bold text-text-primary">"{{ title }}"</span>?
            <br/><span class="text-xs text-text-muted mt-2 block">Works will remain in your General Library.</span>
          </p>

          <div class="flex gap-3 w-full">
            <button
              @click="$emit('close')"
              class="flex-1 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-background-tertiary text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase flex items-center justify-center gap-2"
            >
              <Trash2 :size="14" /> Delete
            </button>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>
