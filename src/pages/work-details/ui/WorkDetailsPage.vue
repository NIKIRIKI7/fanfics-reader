<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { works } from '@/entities/work';
import BaseButton from '@/shared/ui/BaseButton.vue';
import { WorkViewer } from '@/widgets/work-viewer';
import ViewerSkeleton from '@/widgets/work-viewer/ui/parts/ViewerSkeleton.vue';

const route = useRoute();

// Сразу false для мгновенного отображения
const isLoading = ref(false);

const work = computed(() => works.find(w => w.slug === route.params.slug));
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
