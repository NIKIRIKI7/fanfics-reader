<script setup lang="ts">
import { type Component } from 'vue'
import type { Collection } from '@/entities/collection'
import { Plus, Book, Heart, Clock, Star, Flame, Skull, HardDrive, Folder } from 'lucide-vue-next'

defineProps<{
  collections: Collection[]
  activeId: string
}>()

defineEmits<{
  (e: 'select', id: string): void
  (e: 'create'): void
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
  <div class="mb-8">
    <!--
      ИЗМЕНЕНО:
      1. Убрали overflow-x-auto и скроллбар.
      2. Добавили flex-wrap, чтобы элементы переносились на новую строку.
      3. Убрали shrink-0 у кнопок.
    -->
    <div class="flex flex-wrap items-center gap-3">
      <button
        v-for="col in collections"
        :key="col.id"
        @click="$emit('select', col.id)"
        class="relative flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 select-none active:scale-95"
        :class="activeId === col.id
          ? 'bg-text-primary text-background-primary border-text-primary shadow-md'
          : 'bg-background-tertiary/30 border-border hover:bg-background-tertiary text-text-muted hover:text-text-primary'"
      >
        <component :is="getIconComponent(col.icon)" :size="16" />
        <span class="text-xs font-bold uppercase tracking-wider whitespace-nowrap">{{ col.title }}</span>
        <span
          v-if="col.workIds.length > 0"
          class="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full"
          :class="activeId === col.id ? 'bg-background-primary/20 text-background-primary' : 'bg-background-primary text-text-muted'"
        >
          {{ col.workIds.length }}
        </span>
      </button>

      <!-- Кнопка создания тоже просто перенесется, если места мало -->
      <button
        @click="$emit('create')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all active:scale-95"
      >
        <Plus :size="16" />
        <span class="text-xs font-bold uppercase tracking-wider whitespace-nowrap">New Shelf</span>
      </button>
    </div>
  </div>
</template>
