<script setup lang="ts">
import { computed } from 'vue';
import { works } from '@/entities/work/api/mockData';
import WorkCard from '@/entities/work/ui/WorkCard.vue';
import { RouterLink } from 'vue-router';

// Получаем 3 последние работы, исключая 'Archive'
const latestWorks = computed(() => {
  return works
    .filter(w => w.type !== 'Archive')
    .sort((a, b) => new Date(b.stats.date).getTime() - new Date(a.stats.date).getTime())
    .slice(0, 3);
});
</script>

<template>
  <section class="w-full max-w-[1200px] mx-auto px-6 py-20">
    <div class="flex items-center justify-between mb-10">
      <div class="flex flex-col gap-1">
        <h3 class="text-3xl md:text-4xl font-display font-bold italic text-text-primary">Latest Transmissions</h3>
        <p class="text-text-muted font-sans text-sm">Recent signals received from the deep field.</p>
      </div>
      <RouterLink to="/works" class="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkCard 
        v-for="work in latestWorks" 
        :key="work.id" 
        :work="work"
        class="h-full" 
      />
    </div>

    <div class="mt-8 flex justify-center md:hidden">
      <RouterLink to="/works" class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
/* Slight modification to WorkCard styles via parent for Grid layout if needed */
:deep(article) {
  flex-direction: column; /* Force column on grid */
  height: 100%;
}
:deep(article .w-full.lg\:w-48) {
  width: 100%; /* Force image full width in grid */
  height: 200px;
}
</style>