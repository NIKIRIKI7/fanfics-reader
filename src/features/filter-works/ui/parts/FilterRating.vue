<script setup lang="ts">
import { useWorkFilterStore } from '../../model/store';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();

// 1. Реактивные данные (выбранные рейтинги) берем через storeToRefs, чтобы не потерять реактивность
const { selectedRatings } = storeToRefs(store);

// 2. Статичные данные (список доступных рейтингов) берем напрямую из стора
const { availableRatings } = store;
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-2">Age Rating</h4>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="rate in availableRatings"
        :key="rate"
        @click="store.toggleRating(rate)"
        :class="[
          'px-3 py-1 rounded-md text-xs font-bold transition-all border font-sans uppercase',
          selectedRatings.includes(rate)
            ? 'bg-accent text-background-primary border-accent'
            : 'bg-transparent text-text-secondary border-border hover:border-text-secondary'
        ]"
      >
        {{ rate }}
      </button>
    </div>
  </div>
</template>
