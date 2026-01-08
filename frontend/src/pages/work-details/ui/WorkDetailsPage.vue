<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { works } from '@/entities/work';
import BaseButton from '@/shared/ui/BaseButton.vue';
import WorkViewer from './WorkViewer.vue';
import ViewerSkeleton from './parts/ViewerSkeleton.vue';
import { useOfflineStore } from '@/features/offline-mode'; // <--- IMPORT

const route = useRoute();
const offlineStore = useOfflineStore();
const isLoading = ref(true); // Ставим true по умолчанию для имитации загрузки

// Логика получения данных
const work = computed(() => {
  const slug = route.params.slug as string;

  // 1. Сначала ищем в основном источнике (mockData / API)
  const fromApi = works.find(w => w.slug === slug);
  if (fromApi) return fromApi;

  // 2. Если не нашли (или мы офлайн и API упал), ищем в офлайн-хранилище
  return offlineStore.getOfflineWork(slug);
});

// Имитация асинхронности
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto px-6 py-12 min-h-screen font-display">
    <!-- Navigation Back -->
    <div class="mb-8">
      <RouterLink to="/works" class="text-text-muted hover:text-text-primary flex items-center gap-2 text-sm transition-colors">
        <span class="material-symbols-outlined text-lg">arrow_back</span> Back to Catalog
      </RouterLink>
    </div>

    <!-- 1. Loading State -->
    <ViewerSkeleton v-if="isLoading" />

    <!-- 2. Data State -->
    <div v-else-if="work">
      <!-- Если читаем из офлайн стора и нет сети, можно добавить бейдж "Offline View" -->
      <div v-if="!offlineStore.isOnline" class="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
         <span class="material-symbols-outlined text-sm">cloud_off</span>
         You are reading a saved copy
      </div>

      <WorkViewer :work="work" />
    </div>

    <!-- 3. 404 State -->
    <div v-else class="flex flex-col items-center justify-center h-[50vh] text-center">
      <h2 class="text-2xl font-bold text-text-primary mb-2">Signal Lost</h2>
      <p class="text-text-muted mb-4">The narrative you are looking for does not exist in this sector.</p>
      <RouterLink to="/works">
        <BaseButton>Return to Works</BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
