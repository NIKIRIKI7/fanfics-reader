<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

interface Props {
  variant?: 'text' | 'rect' | 'circle'
  width?: string
  height?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: 'auto',
  class: '',
})

const skeletonRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (skeletonRef.value) {
    // Эффект мерцания (shimmer) через градиент
    gsap.fromTo(
      skeletonRef.value,
      { backgroundPosition: '200% 0' },
      {
        backgroundPosition: '-200% 0',
        duration: 1.5,
        repeat: -1,
        ease: 'linear',
      },
    )
  }
})
</script>

<template>
  <div
    ref="skeletonRef"
    class="bg-background-tertiary bg-gradient-to-r from-transparent via-background-secondary to-transparent bg-[length:200%_100%]"
    :class="[
      variant === 'circle' ? 'rounded-full' : 'rounded-md',
      variant === 'text' ? 'h-4 my-1' : '',
      $props.class,
    ]"
    :style="{ width, height: variant !== 'text' ? height : undefined }"
  ></div>
</template>
