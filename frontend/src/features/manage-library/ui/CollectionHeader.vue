<script setup lang="ts">
import { type Component } from 'vue'
import type { Collection } from '@/entities/collection'
import { Pencil, Trash2, HardDrive, Book, Heart, Clock, Star, Flame, Skull, Folder } from 'lucide-vue-next'

defineProps<{
  collection: Collection
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const getIconComponent = (iconName: string) => {
  const map: Record<string, Component> = {
    book: Book, heart: Heart, clock: Clock,
    star: Star, flame: Flame, skull: Skull, default: HardDrive
  }
  return map[iconName] || Folder
}
</script>

<template>
  <div class="flex items-end justify-between mb-6 pb-2 border-b border-border/40 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div class="flex items-center gap-3 md:gap-4">
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-background-tertiary flex items-center justify-center text-accent shadow-inner">
        <component :is="getIconComponent(collection.icon)" :size="24" />
      </div>
      <div class="flex flex-col">
        <span class="text-[10px] uppercase text-text-muted font-bold tracking-widest mb-0.5">Current Shelf</span>
        <h3 class="text-2xl md:text-3xl font-bold font-display leading-none text-text-primary">
          {{ collection.title }}
        </h3>
      </div>
    </div>

    <div v-if="!collection.isSystem" class="flex items-center gap-1 md:gap-2">
      <button
        @click="$emit('edit')"
        class="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
        title="Rename / Edit"
      >
        <Pencil :size="18" />
      </button>
      <button
        @click="$emit('delete')"
        class="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Delete Shelf"
      >
        <Trash2 :size="18" />
      </button>
    </div>
    <div v-else class="flex items-center gap-2 px-3 py-1 bg-background-tertiary/30 rounded text-[10px] font-mono text-text-muted select-none">
      <HardDrive :size="12" /> SYSTEM
    </div>
  </div>
</template>
