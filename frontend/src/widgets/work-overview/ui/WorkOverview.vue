<script setup lang="ts">
import WorkHeader from './WorkHeader.vue'
import ChapterList from './ChapterList.vue'
import type { Work } from '@/entities/work'

defineProps<{ work: Work }>()
defineEmits<{
  (e: 'start-reading'): void
}>()
</script>

<template>
  <div class="w-full">
    <WorkHeader :work="work" @start-reading="$emit('start-reading')" />
    <ChapterList :stats="work.stats" :slug="work.slug" />
  </div>
</template>