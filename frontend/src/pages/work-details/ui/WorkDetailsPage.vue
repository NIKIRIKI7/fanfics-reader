<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { works } from '@/entities/work'
import { useOfflineStore } from '@/features/offline-mode'
import ViewerSkeleton from './parts/ViewerSkeleton.vue'
import WorkViewer from './WorkViewer.vue'
import { WorkOverview } from '@/widgets/work-overview' // Импорт нового виджета
import { ArrowLeft, CloudOff } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { onEnterFade, onLeaveFade } from '@/shared/lib/gsapTransitions'

const route = useRoute()
const router = useRouter()
const offlineStore = useOfflineStore()
const isLoading = ref(true)

// Mode: 'overview' (карточка) or 'reading' (читалка)
const mode = ref<'overview' | 'reading'>('overview')

const work = computed(() => {
  const slug = route.params.slug as string
  const fromApi = works.find((w) => w.slug === slug)
  if (fromApi) return fromApi
  return offlineStore.getOfflineWork(slug)
})

// Если в URL есть query параметр chapter, сразу включаем режим чтения
watch(
  () => route.query.chapter,
  (newChapter) => {
    if (newChapter) {
      mode.value = 'reading'
    } else {
      mode.value = 'overview'
    }
  },
  { immediate: true }
)

const startReading = () => {
  // Начинаем с 1 главы или продолжаем
  router.push({ query: { ...route.query, chapter: '1' } })
}

onMounted(() => {
  // Имитация загрузки
  setTimeout(() => {
    isLoading.value = false
  }, 400)
})
</script>

<template>
  <div class="min-h-screen font-display pb-20">
    <!-- Navigation Back (Only visible in overview for cleaner look) -->
    <div v-if="mode === 'overview'" class="max-w-[1200px] mx-auto px-6 pt-8 mb-6">
      <RouterLink
        to="/works"
        class="text-text-muted hover:text-text-primary flex items-center gap-2 text-sm transition-colors uppercase tracking-widest font-bold"
      >
        <ArrowLeft :size="18" /> Back to Catalog
      </RouterLink>
    </div>

    <!-- 1. Loading State -->
    <div v-if="isLoading" class="max-w-[1000px] mx-auto px-6 py-12">
      <ViewerSkeleton />
    </div>

    <!-- 2. Data State -->
    <div v-else-if="work">
      <!-- Offline Badge -->
      <div
        v-if="!offlineStore.isOnline && mode === 'overview'"
        class="max-w-[1200px] mx-auto px-6 mb-4"
      >
        <div class="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-fit">
          <CloudOff :size="14" />
          Offline Copy
        </div>
      </div>

      <!-- MAIN CONTENT SWITCHER -->
      <transition mode="out-in" :css="false" @enter="onEnterFade" @leave="onLeaveFade">

        <!-- VIEW 1: OVERVIEW (Like Screenshot) -->
        <div v-if="mode === 'overview'" key="overview" class="max-w-[1200px] mx-auto px-6">
          <WorkOverview :work="work" @start-reading="startReading" />
        </div>

        <!-- VIEW 2: READER (Existing Viewer) -->
        <div v-else key="reading" class="max-w-[1000px] mx-auto px-4 md:px-6">
           <!-- Кнопка назад к описанию внутри читалки -->
           <div class="mb-4 pt-4">
             <RouterLink
               :to="{ name: 'work-details', params: { slug: work.slug } }"
               class="inline-flex items-center gap-2 text-xs text-text-muted hover:text-accent transition-colors"
             >
               <ArrowLeft :size="14" /> Return to Work Details
             </RouterLink>
           </div>
           <WorkViewer :work="work" />
        </div>

      </transition>
    </div>

    <!-- 3. 404 State -->
    <div v-else class="flex flex-col items-center justify-center h-[50vh] text-center px-6">
      <h2 class="text-3xl font-display font-bold text-text-primary mb-2">Signal Lost</h2>
      <p class="text-text-muted mb-6">
        The narrative you are looking for does not exist in this sector.
      </p>
      <RouterLink to="/works">
        <BaseButton>Return to Catalog</BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
