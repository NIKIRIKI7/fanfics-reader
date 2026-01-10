<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useLibraryStore } from '../model/store'
import type { Work } from '@/entities/work'
import AddToCollectionModal from './AddToCollectionModal.vue'
import gsap from 'gsap'
import { HapticPatterns, vibrate } from '@/shared/lib/haptics'
import { Bookmark, Library } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    work: Work
    variant?: 'icon' | 'full'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'icon',
    size: 'md',
  }
)

const store = useLibraryStore()
// Вычисляем, сохранена ли работа ХОТЯ БЫ в одной коллекции
const isSaved = computed(() => store.isSavedAnywhere(props.work.id))

const buttonRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)
const isModalOpen = ref(false)

const handleClick = async (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  vibrate(HapticPatterns.medium)

  // Анимация нажатия
  if (buttonRef.value) {
    gsap.to(buttonRef.value, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    })
  }

  // Логика открытия модалки
  if (!isSaved.value) {
    // Если еще не сохранено: Сохраняем в дефолтную и открываем модалку для уточнения
    store.addWorkToCollection(props.work, 'default')
    // Небольшая задержка перед открытием модалки для UX
    setTimeout(() => {
      isModalOpen.value = true
    }, 300)
  } else {
    // Если уже сохранено: Открываем менеджер коллекций
    isModalOpen.value = true
  }
}

watch(isSaved, async (newVal) => {
  await nextTick()
  if (iconRef.value) {
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

const classes = computed(() => {
  const base =
    'group relative flex items-center justify-center rounded-full transition-colors duration-300 border cursor-pointer select-none overflow-hidden'
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
    @click="handleClick"
    :title="isSaved ? 'Manage Collections' : 'Save to Library'"
  >
    <!-- Иконка: используем span вместо div внутри button -->
    <span class="relative w-6 h-6 flex items-center justify-center">
      <span
        ref="iconRef"
        :key="isSaved ? 'saved' : 'unsaved'"
        class="absolute flex items-center justify-center"
      >
        <component
          :is="isSaved ? Library : Bookmark"
          :size="20"
          :class="{ 'font-bold': isSaved }"
          :fill="isSaved ? 'currentColor' : 'none'"
        />
      </span>
    </span>
    <!-- Текст -->
    <span
      v-if="variant === 'full'"
      class="ml-2 text-xs font-bold uppercase tracking-wider hidden sm:inline"
    >
      {{ isSaved ? 'Saved' : 'Library' }}
    </span>
  </button>

  <AddToCollectionModal
    :work="work"
    :is-open="isModalOpen"
    @close="isModalOpen = false"
  />
</template>
