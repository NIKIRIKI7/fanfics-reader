<script setup lang="ts">
import { useWorkFilterStore } from '../../model/store';
import { storeToRefs } from 'pinia';

const store = useWorkFilterStore();
const { selectedStatuses } = storeToRefs(store);

const statuses = ['Complete', 'In Progress', 'One-Shot'];
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-2">Status</h4>
    <div class="flex flex-col gap-2">
      <label 
        v-for="stat in statuses" 
        :key="stat"
        class="flex items-center gap-3 cursor-pointer group"
      >
        <div 
          class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
          :class="selectedStatuses.includes(stat as any) ? 'bg-accent border-accent' : 'border-text-muted group-hover:border-text-primary'"
        >
          <span v-if="selectedStatuses.includes(stat as any)" class="material-symbols-outlined text-[12px] text-background-primary">check</span>
        </div>
        
        <input 
          type="checkbox" 
          class="hidden" 
          @change="store.toggleStatus(stat as any)" 
          :checked="selectedStatuses.includes(stat as any)"
        >
        
        <span 
          :class="selectedStatuses.includes(stat as any) ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'" 
          class="text-sm transition-colors font-sans"
        >
          {{ stat }}
        </span>
      </label>
    </div>
  </div>
</template>