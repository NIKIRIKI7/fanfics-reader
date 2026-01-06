<script setup lang="ts">
import { useWorkFilterStore } from '../../model/store';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { selectedTags, availableTags } = storeToRefs(store);
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-2">
      Tags
    </h4>
    <div v-if="availableTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in availableTags"
        :key="tag"
        @click="store.toggleTag(tag)"
        :class="[
          'px-2 py-1 rounded text-xs font-sans transition-all border',
          selectedTags.includes(tag)
            ? 'bg-accent/10 border-accent text-accent font-bold'
            : 'bg-transparent border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
        ]"
      >
        #{{ tag }}
      </button>
    </div>
    <p v-else class="text-xs text-text-muted italic">No tags found.</p>
  </div>
</template>