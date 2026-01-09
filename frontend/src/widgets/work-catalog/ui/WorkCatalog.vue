<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWorkFilterStore, WorkFilter } from '@/features/filter-works'
import { WorkCard, WorkCardSkeleton } from '@/entities/work'
import { BookmarkButton } from '@/features/manage-library'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SearchX } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const store = useWorkFilterStore()
const { filteredWorks } = storeToRefs(store)

const isLoading = ref(false)
const filterRef = ref<HTMLElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null

const handleTagClick = (tag: string) => {
  store.searchByTag(tag)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Анимация входа для отдельного элемента (при фильтрации)
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.9, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'back.out(1.2)',
      onComplete: done,
      delay: (el as HTMLElement).dataset.index
        ? Number((el as HTMLElement).dataset.index) * 0.05
        : 0,
    },
  )
}

// Анимация выхода для отдельного элемента
const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done,
  })
}

// Анимация при первой загрузке страницы
onMounted(() => {
  if (!rootRef.value) return

  ctx = gsap.context(() => {
    // 1. Анимируем появление фильтров (один раз)
    if (filterRef.value) {
      gsap.fromTo(
        filterRef.value,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 },
      )
    }

    // 2. ScrollTrigger нужен только для глобального появления,
    // но TransitionGroup с appear обработает это лучше.
    // Оставим ScrollTrigger refresh на всякий случай для корректного расчета позиций.
    ScrollTrigger.refresh()
  }, rootRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section ref="rootRef">
    <!-- Фильтры анимируются только один раз при маунте -->
    <div ref="filterRef" class="opacity-0">
      <WorkFilter class="mb-8" />
    </div>

    <!-- Skeletons -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Data List -->
    <div v-else class="min-h-[200px] relative">
      <TransitionGroup
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        :css="false"
        @enter="onEnter"
        @leave="onLeave"
        appear
      >
        <WorkCard
          v-for="(work, index) in filteredWorks"
          :key="work.id"
          :work="work"
          class="work-item h-full"
          :data-index="index"
          @clickTag="handleTagClick"
        >
          <template #action>
            <BookmarkButton :work="work" size="sm" />
          </template>
        </WorkCard>
      </TransitionGroup>

      <!-- Empty State -->
      <transition
        @enter="
          (el, done) =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, onComplete: done },
            )
        "
        @leave="(el, done) => gsap.to(el, { opacity: 0, duration: 0.2, onComplete: done })"
      >
        <div
          v-if="filteredWorks.length === 0"
          class="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-background-tertiary/5 absolute inset-0 h-fit"
        >
          <div
            class="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4 text-text-muted"
          >
            <SearchX :size="32" />
          </div>
          <p class="text-text-muted font-display italic text-lg mb-2">Signal lost.</p>
          <p class="text-text-secondary text-sm mb-6">No records match your current parameters.</p>
          <button
            @click="store.resetFilters"
            class="px-6 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-background-primary rounded-full transition-all text-sm font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.work-item {
  backface-visibility: hidden;
}
</style>
