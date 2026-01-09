<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useLibraryStore } from '../model/store'
import type { Work } from '@/entities/work'
import gsap from 'gsap'
import { HapticPatterns, vibrate } from '@/shared/lib/haptics'

const props = withDefaults(
  defineProps<{
    work: Work
    variant?: 'icon' | 'full' // 'icon' для карточки, 'full' для хедера
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'icon',
    size: 'md',
  },
)

const store = useLibraryStore()
const isSaved = computed(() => store.isSaved(props.work.id))

// Refs для GSAP
const buttonRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

const toggle = async (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  // Тактильный отклик: средний, так как это важное действие
  vibrate(HapticPatterns.medium)

  // 1. Анимация нажатия кнопки (Press effect)
  if (buttonRef.value) {
    gsap.to(buttonRef.value, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    })
  }

  // Переключаем состояние в сторе
  store.toggleWork(props.work)
}

// Вотчер для анимации иконки при изменении состояния
watch(isSaved, async (newVal) => {
  await nextTick()
  if (iconRef.value) {
    // Эластичная анимация появления/смены иконки
    gsap.fromTo(
      iconRef.value,
      { scale: 0, rotation: newVal ? -45 : 45 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      },
    )
  }
})

// Вычисляемые классы
const classes = computed(() => {
  const base =
    'group relative flex items-center justify-center rounded-full transition-colors duration-300 border cursor-pointer select-none overflow-hidden'

  // Цвета меняем через CSS transition, а движение через GSAP
  const activeClass = isSaved.value
    ? 'bg-accent border-accent text-background-primary shadow-[0_0_15px_rgba(var(--color-accent),0.4)]'
    : 'bg-background-tertiary/60 backdrop-blur-sm border-transparent hover:border-accent/50 text-text-muted hover:text-text-primary hover:bg-background-tertiary'

  const sizeClass = props.size === 'sm' ? 'h-8 px-2' : 'h-10 px-3'
  const widthClass = props.variant === 'icon' ? (props.size === 'sm' ? 'w-8' : 'w-10') : 'w-auto'

  return [base, activeClass, sizeClass, widthClass].join(' ')
})
</script>

<template>
  <button
    ref="buttonRef"
    :class="classes"
    @click="toggle"
    :title="isSaved ? 'Remove from Library' : 'Save to Library'"
  >
    <!-- Иконка -->
    <div class="relative w-6 h-6 flex items-center justify-center">
      <!-- Используем key, чтобы Vue пересоздавал элемент и GSAP мог его подхватить -->
      <span
        ref="iconRef"
        :key="isSaved ? 'saved' : 'unsaved'"
        class="material-symbols-outlined absolute text-[20px]"
        :class="{ 'font-bold filled-icon': isSaved }"
      >
        {{ isSaved ? 'bookmark' : 'bookmark_add' }}
      </span>
    </div>

    <!-- Текст (для полной версии) -->
    <span
      v-if="variant === 'full'"
      class="ml-2 text-xs font-bold uppercase tracking-wider hidden sm:inline"
    >
      {{ isSaved ? 'Saved' : 'Library' }}
    </span>
  </button>
</template>

<style scoped>
/* Заполнение иконки для filled стиля material symbols */
.filled-icon {
  font-variation-settings:
    'FILL' 1,
    'wght' 700,
    'GRAD' 0,
    'opsz' 24;
}
</style>
