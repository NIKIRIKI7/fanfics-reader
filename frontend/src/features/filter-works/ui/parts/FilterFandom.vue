<script setup lang="ts">
import { useWorkFilterStore } from '../../model/store';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { selectedFandoms, availableFandoms } = storeToRefs(store);
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-2">Fandoms</h4>
    
    <div v-if="availableFandoms.length > 0" class="flex flex-wrap gap-2">
      <button 
        v-for="fandom in availableFandoms"
        :key="fandom"
        @click="store.toggleFandom(fandom)"
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium transition-all border font-sans',
          selectedFandoms.includes(fandom)
            ? 'bg-background-primary text-text-primary border-text-primary shadow-sm'
            : 'bg-transparent text-text-muted border-transparent hover:bg-background-tertiary'
        ]"
      >
        {{ fandom }}
      </button>
    </div>
    
    <p v-else class="text-xs text-text-muted italic">No fandoms available in current selection.</p>
  </div>
</template>