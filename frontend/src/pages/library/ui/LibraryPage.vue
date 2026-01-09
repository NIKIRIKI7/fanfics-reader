<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore, BookmarkButton } from '@/features/manage-library'
import { WorkCard } from '@/entities/work'

const store = useLibraryStore()
const router = useRouter()

const savedWorks = computed(() => store.savedWorks)

const handleTagClick = (tag: string) => {
  router.push({ name: 'works', query: { tag } })
}
</script>

<template>
  <div
    class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] py-12 min-h-screen"
  >
    <!-- Header -->
    <div
      class="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div>
        <h2
          class="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2 font-display italic"
        >
          Data Cache
        </h2>
        <p class="text-lg text-text-secondary font-light font-display">
          Local repository. {{ store.savedCount }} encrypted transmissions stored.
        </p>
      </div>

      <!-- Decor -->
      <div
        class="flex items-center gap-3 bg-background-tertiary/30 px-4 py-2 rounded-lg border border-border"
      >
        <div class="flex flex-col items-end">
          <span class="text-[10px] uppercase font-bold text-text-muted tracking-widest"
            >Memory Usage</span
          >
          <span class="text-xs font-mono text-accent"
            >{{ Math.min(store.savedCount * 2.4, 100).toFixed(1) }}%</span
          >
        </div>
        <div
          class="w-10 h-10 rounded-full border-2 border-border relative flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-text-secondary text-[20px]">hard_drive</span>
          <svg class="absolute inset-0 -rotate-90 transform" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="transparent"
              stroke="currentColor"
              stroke-width="2"
              class="text-accent/20"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="transparent"
              stroke="currentColor"
              stroke-width="2"
              class="text-accent"
              stroke-dasharray="113"
              :stroke-dashoffset="113 - (113 * Math.min(store.savedCount * 2.4, 100)) / 100"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div
      v-if="savedWorks.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
    >
      <WorkCard
        v-for="work in savedWorks"
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

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-xl bg-background-tertiary/5 animate-fade-in"
    >
      <div
        class="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center mb-6 text-text-muted relative overflow-hidden group"
      >
        <span class="material-symbols-outlined text-4xl relative z-10">bookmark_border</span>
        <div
          class="absolute inset-0 bg-accent/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"
        ></div>
      </div>
      <h3 class="text-2xl font-bold text-text-primary mb-2 font-display">Cache Empty</h3>
      <p class="text-text-secondary max-w-md mb-8 font-light">
        No narratives have been saved to your local terminal yet.
      </p>
      <router-link to="/works">
        <button
          class="px-8 py-3 bg-accent text-background-primary rounded-lg font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-[0_4px_14px_0_rgba(var(--color-accent),0.39)]"
        >
          Browse Catalog
        </button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Обеспечиваем одинаковую высоту карточек */
:deep(article) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
