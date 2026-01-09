<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { works } from '@/entities/work'
import { WorkCard } from '@/entities/work' // Исправлен импорт
import { BookmarkButton } from '@/features/manage-library'
import { RouterLink } from 'vue-router'
import { useWorkFilterStore } from '@/features/filter-works'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const filterStore = useWorkFilterStore()
const containerRef = ref<HTMLElement | null>(null)

const latestWorks = computed(() => {
  return works
    .filter((w) => w.type !== 'Archive')
    .sort((a, b) => new Date(b.stats.date).getTime() - new Date(a.stats.date).getTime())
    .slice(0, 3)
})

const handleTagClick = (tag: string) => {
  filterStore.searchByTag(tag)
  router.push('/works')
}

const triggers: ScrollTrigger[] = []

onMounted(async () => {
  await nextTick()

  if (containerRef.value && containerRef.value.children.length > 0) {
    const items = containerRef.value.children

    const batch = ScrollTrigger.batch(items, {
      start: 'top 85%', // Чуть раньше запускаем
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)', // Эластичность как в библиотеке
          overwrite: true,
        })
      },
      once: true,
    })
    triggers.push(...batch)
  }

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <section class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] py-20">
    <!-- Header -->
    <div class="flex items-center justify-between mb-10">
      <div class="flex flex-col gap-1">
        <h3 class="text-3xl md:text-4xl font-display font-bold italic text-text-primary">
          Latest Transmissions
        </h3>
        <p class="text-text-muted font-sans text-sm">
          Recent signals received from the deep field.
        </p>
      </div>

      <RouterLink
        to="/works"
        class="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
      >
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>

    <!-- Cards Grid -->
    <div
      ref="containerRef"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]"
    >
      <WorkCard
        v-for="work in latestWorks"
        :key="work.id"
        :work="work"
        class="h-full"
        @clickTag="handleTagClick"
      >
        <template #action>
          <BookmarkButton :work="work" size="sm" />
        </template>
      </WorkCard>
    </div>

    <div class="mt-8 flex justify-center md:hidden">
      <RouterLink
        to="/works"
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
      >
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
:deep(article) {
  flex-direction: column;
  height: 100%;
}
</style>
