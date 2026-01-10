<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

defineProps<{
  chapter: number
}>()

const lineLeft = ref<HTMLElement | null>(null)
const lineRight = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline()

  if (lineLeft.value && lineRight.value && textRef.value) {
    tl.fromTo(
      [lineLeft.value, lineRight.value],
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.out' }
    ).fromTo(
      textRef.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' },
      '-=0.4'
    )
  }
})
</script>

<template>
  <div class="flex items-center justify-center gap-4 py-16 opacity-80 select-none">
    <div ref="lineLeft" class="h-px bg-gradient-to-r from-transparent to-accent w-24 md:w-48 origin-right"></div>
    <div ref="textRef" class="flex flex-col items-center">
      <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Transmission Continued</span>
      <span class="text-xs font-serif italic text-text-muted">Chapter {{ chapter }}</span>
    </div>
    <div ref="lineRight" class="h-px bg-gradient-to-l from-transparent to-accent w-24 md:w-48 origin-left"></div>
  </div>
</template>
