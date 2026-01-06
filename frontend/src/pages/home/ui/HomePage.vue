<script setup lang="ts">
import { onMounted } from 'vue';
// Импортируем локальный компонент вместо виджета
import HomeLatestWorks from './HomeLatestWorks.vue';
import HomeHero from './parts/HomeHero.vue';
import { RecentlyViewed } from '@/features/view-history'; // Импорт новой фичи

onMounted(() => {
  console.log('[Page] Home mounted');
});
</script>

<template>
  <div class="flex flex-col">
    <HomeHero />

    <div class="relative z-10 bg-background-primary border-t border-border">
      <HomeLatestWorks />

      <!-- Блок недавно просмотренных -->
      <div class="max-w-[1200px] mx-auto px-6 pb-20">
        <div class="h-px bg-border w-full mb-12"></div>
        <RecentlyViewed />
      </div>
    </div>
  </div>
</template>