<script setup lang="ts">
import WorkHeader from './WorkHeader.vue'
import ChapterList from './ChapterList.vue'
import { CommentSection, LikeButton } from '@/features/interact-with-work'
import type { Work } from '@/entities/work'

defineProps<{ work: Work }>()
defineEmits<{
  (e: 'start-reading'): void
}>()
</script>

<template>
  <div class="w-full flex flex-col gap-12 pb-12">
    <WorkHeader :work="work" @start-reading="$emit('start-reading')" />

    <div class="flex flex-col gap-16">
      <!-- Chapters -->
      <ChapterList :stats="work.stats" :slug="work.slug" />

      <!-- Like CTA Section (Bottom) -->
      <div class="flex flex-col items-center justify-center gap-4 py-8 border-t border-border/30">
        <p class="text-sm text-text-muted font-display italic">
          Enjoyed the transmission? Send a signal to the author.
        </p>

        <!-- Large Variant Here -->
        <LikeButton
          :work-id="work.id"
          :initial-count="work.stats.kudos"
          variant="large"
        />
      </div>

      <!-- Comments Section -->
      <div class="border-t border-border/50 pt-8">
        <CommentSection :work-id="work.id" />
      </div>
    </div>
  </div>
</template>
