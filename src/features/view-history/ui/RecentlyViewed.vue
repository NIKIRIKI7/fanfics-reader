<script setup lang="ts">
import { useViewHistoryStore } from '../model/store';
import { WorkCard } from '@/entities/work'; // Feature может использовать Entity
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useWorkFilterStore } from '@/features/filter-works';

const historyStore = useViewHistoryStore();
const { history } = storeToRefs(historyStore);
const router = useRouter();
const filterStore = useWorkFilterStore();

const handleTagClick = (tag: string) => {
  filterStore.searchByTag(tag);
  router.push('/works');
};
</script>

<template>
  <section v-if="history.length > 0" class="w-full">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-2xl font-display font-bold italic text-text-primary">Recently Decoded</h3>
      <button 
        @click="historyStore.clearHistory" 
        class="text-xs text-text-muted hover:text-red-500 uppercase tracking-wider font-bold transition-colors"
      >
        Clear History
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkCard
        v-for="work in history"
        :key="work.id"
        :work="work"
        @clickTag="handleTagClick"
      />
    </div>
  </section>
</template>