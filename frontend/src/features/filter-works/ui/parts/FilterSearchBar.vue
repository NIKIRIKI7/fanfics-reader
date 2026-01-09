<script setup lang="ts">
import { useWorkFilterStore } from '../../model/store'
import { storeToRefs } from 'pinia'

defineProps<{
  isAdvancedOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleAdvanced'): void
}>()

const store = useWorkFilterStore()
const { searchQuery, activeType, showArchived, activeFiltersCount } = storeToRefs(store)

const mainFilters = ['All', 'Original', 'Fanfic']
</script>

<template>
  <div
    class="bg-background-primary/80 backdrop-blur-md border border-border rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center"
  >
    <!-- Search Input -->
    <div class="w-full lg:w-1/3 relative group">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-text-primary transition-colors"
      >
        search
      </span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search titles, tags, or keywords..."
        class="w-full bg-background-tertiary border-none text-text-primary pl-10 pr-4 py-2.5 rounded-lg focus:ring-1 focus:ring-accent placeholder:text-text-muted text-sm font-sans transition-all outline-hidden"
      />
    </div>

    <!--
      FIX: Изменена структура флекс-контейнера.
      Было: flex items-center ...
      Стало: flex flex-col sm:flex-row items-stretch sm:items-center ...
      Это заставит табы и кнопку фильтров выстраиваться вертикально на самых маленьких экранах,
      устраняя наложение.
    -->
    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto sm:justify-between lg:justify-end"
    >
      <!-- Type Tabs (Visible only if NOT in Archive) -->
      <!-- Добавлен justify-center для мобилок -->
      <div
        v-if="!showArchived"
        class="bg-background-tertiary p-1 rounded-lg flex justify-center sm:justify-start"
      >
        <button
          v-for="filter in mainFilters"
          :key="filter"
          @click="store.setType(filter as any)"
          :class="[
            'px-4 py-1.5 rounded text-sm font-sans font-medium transition-all duration-300 flex-1 sm:flex-none',
            activeType === filter
              ? 'bg-background-primary text-text-primary shadow-sm border border-border'
              : 'text-text-muted hover:text-text-primary',
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Archive Indicator -->
      <div
        v-else
        class="flex items-center justify-center sm:justify-start gap-2 text-text-muted text-sm font-sans px-4"
      >
        <span class="material-symbols-outlined text-[18px]">inventory_2</span>
        Legacy Mode
      </div>

      <!-- Advanced Toggle Button -->
      <button
        @click="emit('toggleAdvanced')"
        :class="[
          'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-sans transition-all',
          isAdvancedOpen || activeFiltersCount > 0
            ? 'border-accent text-text-primary bg-background-tertiary'
            : 'border-border text-text-muted hover:border-text-muted',
        ]"
      >
        <span class="material-symbols-outlined text-[20px]">tune</span>
        <span class="hidden sm:inline">Filters</span>
        <span class="sm:hidden">Filters</span>
        <span
          v-if="activeFiltersCount > 0"
          class="flex items-center justify-center w-5 h-5 bg-accent text-background-primary text-[10px] font-bold rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>
  </div>
</template>
