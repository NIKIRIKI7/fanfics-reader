<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useInteractionStore } from '../model/store'
import { ThumbsUp, Heart } from 'lucide-vue-next'
import gsap from 'gsap'
import { vibrate, HapticPatterns } from '@/shared/lib/haptics'

const props = withDefaults(defineProps<{
  workId: string
  initialCount: number
  variant?: 'default' | 'large' // Добавили вариант
}>(), {
  variant: 'default'
})

const store = useInteractionStore()
const iconRef = ref<HTMLElement | null>(null)
const countRef = ref<HTMLElement | null>(null)

const isLiked = computed(() => store.isLiked(props.workId))
const count = computed(() => store.getLikesCount(props.workId, props.initialCount))

const handleClick = async () => {
  vibrate(HapticPatterns.soft)
  store.toggleLike(props.workId, props.initialCount)
}

// Анимация
watch(isLiked, async (val) => {
  await nextTick()
  if (!iconRef.value) return

  if (val) {
    // Jump and Rotate
    gsap.timeline()
      .to(iconRef.value, { scale: 1.5, rotation: -15, duration: 0.1, ease: 'back.out(2)' })
      .to(iconRef.value, { scale: 1, rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' })

    // Count Flash (только для default, в large цвет меняется через CSS классы)
    if(countRef.value && props.variant === 'default') {
      gsap.fromTo(countRef.value,
        { color: 'var(--color-accent)', y: -5 },
        { color: 'var(--color-text-primary)', y: 0, duration: 0.5 }
      )
    }
  } else {
    // Unlike shrink
    gsap.to(iconRef.value, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
  }
})

// Классы для разных вариантов
const containerClasses = computed(() => {
  if (props.variant === 'large') {
    return `
      flex items-center justify-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 group
      ${isLiked.value
      ? 'bg-accent border-accent text-background-primary shadow-[0_0_20px_rgba(var(--color-accent),0.4)]'
      : 'bg-background-tertiary/30 border-border hover:border-accent hover:bg-background-tertiary text-text-secondary hover:text-text-primary'
    }
    `
  }
  // Default (Header style)
  return 'flex flex-col gap-1 group cursor-pointer select-none items-start'
})

const iconContainerClass = computed(() => {
  if (props.variant === 'large') return 'origin-center'
  return 'flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-muted transition-colors group-hover:text-text-primary'
})
</script>

<template>
  <button
    @click="handleClick"
    :class="containerClasses"
    :title="isLiked ? 'Retract Kudos' : 'Give Kudos'"
  >
    <!-- VARIANT: LARGE (Bottom CTA) -->
    <template v-if="variant === 'large'">
      <div ref="iconRef" class="relative">
        <component
          :is="isLiked ? Heart : ThumbsUp"
          :size="24"
          :class="{ 'fill-current': isLiked }"
          class="transition-transform"
        />
      </div>
      <div class="flex flex-col items-start leading-none">
        <span class="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
          {{ isLiked ? 'Signal Received' : 'Leave Kudos' }}
        </span>
        <span class="font-mono text-lg font-bold">
          {{ count }}
        </span>
      </div>
    </template>

    <!-- VARIANT: DEFAULT (Header Mini) -->
    <template v-else>
      <div :class="iconContainerClass">
        <div ref="iconRef" class="origin-center">
          <ThumbsUp
            :size="14"
            :class="isLiked ? 'text-accent fill-accent' : 'text-text-muted group-hover:text-accent'"
            class="transition-colors duration-300"
          />
        </div>
        <span>Kudos</span>
      </div>

      <span
        ref="countRef"
        class="text-lg font-mono font-bold transition-colors duration-300"
        :class="isLiked ? 'text-accent' : 'text-text-primary'"
      >
        {{ count }}
      </span>
    </template>
  </button>
</template>
