<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useReadingSettingsStore } from '../model/store'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'

const store = useReadingSettingsStore()
const { isRulerEnabled, rulerHeight, rulerIntensity } = storeToRefs(store)

const cursorY = ref(0)
const isMobile = ref(false)

const updateMousePosition = (e: MouseEvent) => {
  if (isMobile.value) return
  cursorY.value = e.clientY
}

const checkMobile = () => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
  if (isMobile.value) {
    cursorY.value = window.innerHeight / 2
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('mousemove', updateMousePosition, { passive: true })
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
  window.removeEventListener('resize', checkMobile)
})

const topCurtainStyle = computed(() => ({
  height: `${Math.max(0, cursorY.value - rulerHeight.value / 2)}px`,
  backgroundColor: `rgba(0, 0, 0, ${rulerIntensity.value})`,
}))

const bottomCurtainStyle = computed(() => ({
  top: `${cursorY.value + rulerHeight.value / 2}px`,
  backgroundColor: `rgba(0, 0, 0, ${rulerIntensity.value})`,
}))

const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out', onComplete: done })
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="isRulerEnabled"
        class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full transition-[height] duration-75 ease-linear will-change-[height]"
          :style="topCurtainStyle"
        ></div>

        <div
          class="absolute left-0 w-full border-y border-red-500/20 transition-[top,height] duration-75 ease-linear will-change-[top,height]"
          :style="{
            top: `${cursorY - rulerHeight.value / 2}px`,
            height: `${rulerHeight.value}px`
          }"
        >
          <div class="absolute top-1/2 left-0 w-full h-px bg-red-500/20"></div>
        </div>

        <div
          class="absolute bottom-0 left-0 w-full transition-[top] duration-75 ease-linear will-change-[top]"
          :style="bottomCurtainStyle"
        ></div>
      </div>
    </transition>
  </Teleport>
</template>