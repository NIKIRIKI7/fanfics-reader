<script setup lang="ts">
import { onMounted } from 'vue';
import { HomeLatestWorks } from '@/widgets/home-latest';
import HomeHero from './parts/HomeHero.vue';

onMounted(() => {
  console.log('[Page] Home mounted');
});
</script>

<template>
  <div class="flex flex-col">
    <HomeHero />

    <div class="relative z-10 bg-background-primary border-t border-border">
      <HomeLatestWorks />
    </div>
  </div>
</template>