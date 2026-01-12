<script setup lang="ts">
import { computed } from 'vue'
import type { Work } from '@/entities/work'
import { BookmarkButton } from '@/features/manage-library'
import { ShareButton } from '@/features/share-work'
import { DownloadButton } from '@/features/offline-mode'
import {
  ThumbsUp, MessageSquare, BookOpen, Clock,
  AlertTriangle, Hash
} from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseTag from '@/shared/ui/BaseTag.vue'

const props = defineProps<{ work: Work }>()
defineEmits<{
  (e: 'start-reading'): void
}>()

const formattedDate = computed(() => new Date(props.work.stats.date).toLocaleDateString())
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Left Column: Cover & Actions -->
    <div class="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
      <div class="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 group">
        <img
          :src="props.work.coverUrl"
          :alt="props.work.title"
          class="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <!-- Type Badge -->
        <div class="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase rounded">
          {{ props.work.type }}
        </div>
        <!-- Rating Badge -->
        <div class="absolute top-2 right-2 px-2 py-1 bg-accent text-background-primary text-[10px] font-bold uppercase rounded shadow-lg shadow-accent/20">
          {{ props.work.rating }}
        </div>
      </div>

      <!-- Action Buttons Stack -->
      <div class="flex flex-col gap-3">
        <BaseButton
          variant="primary"
          block
          @click="$emit('start-reading')"
          class="h-12 text-sm font-bold uppercase tracking-wider shadow-lg shadow-accent/10"
        >
          <BookOpen :size="18" /> Start Reading
        </BaseButton>

        <div class="grid grid-cols-3 gap-3">
          <BookmarkButton :work="work" variant="icon" class="w-full h-10 rounded-lg" />
          <DownloadButton :work="work" variant="ghost" class="w-full h-10 border border-border rounded-lg" />
          <ShareButton :work="work" variant="ghost" class="w-full h-10 border border-border rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Right Column: Meta Info -->
    <div class="flex-1 flex flex-col gap-6 min-w-0">
      <!-- Breadcrumbs / Series -->
      <div v-if="work.series" class="text-xs text-text-muted font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
        <Hash :size="12" /> Series: <span class="text-accent underline cursor-pointer">{{ work.series }}</span>
      </div>

      <!-- Header -->
      <div>
        <h1 class="text-3xl md:text-5xl font-display font-bold italic text-text-primary leading-tight mb-2">
          {{ work.title }}
        </h1>
        <div class="flex items-center gap-2 text-text-secondary text-lg">
          <span>by</span>
          <span class="font-bold text-text-primary border-b border-accent/30 hover:border-accent cursor-pointer transition-colors">
            {{ work.author }}
          </span>
        </div>
      </div>

      <!-- Fandom & Pairings -->
      <div class="p-4 rounded-xl bg-background-tertiary/20 border border-border/50 flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Fandom</span>
          <span class="text-sm font-bold text-text-primary">{{ work.fandom }}</span>
        </div>
        <div v-if="work.pairings?.length" class="flex flex-col gap-1">
          <span class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Pairings</span>
          <div class="flex flex-wrap gap-x-4 gap-y-1">
            <span v-for="pair in work.pairings" :key="pair" class="text-sm text-accent hover:underline cursor-pointer">
              {{ pair }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detailed Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border/50">
        <div class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-muted">
            <ThumbsUp :size="12" /> Likes
          </span>
          <span class="text-lg font-mono font-bold text-text-primary">{{ work.stats.kudos }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-muted">
            <MessageSquare :size="12" /> Comments
          </span>
          <span class="text-lg font-mono font-bold text-text-primary">{{ work.stats.comments || 0 }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-muted">
            <BookOpen :size="12" /> Pages
          </span>
          <span class="text-lg font-mono font-bold text-text-primary">{{ work.stats.chapters }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-muted">
            <Clock :size="12" /> Updated
          </span>
          <span class="text-lg font-mono font-bold text-text-primary">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Tags Cloud -->
      <div class="flex flex-wrap gap-2">
        <div v-if="work.warnings?.length" class="flex flex-wrap gap-2 mr-2">
          <span
            v-for="warn in work.warnings"
            :key="warn"
            class="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-500/30 bg-red-500/5 text-red-500 text-xs font-bold uppercase tracking-wider"
          >
            <AlertTriangle :size="10" /> {{ warn }}
          </span>
        </div>
        <BaseTag v-for="tag in work.tags" :key="tag" :label="tag" />
      </div>

      <!-- Summary -->
      <div class="prose prose-invert prose-sm max-w-none text-text-secondary font-display leading-relaxed">
        <h3 class="text-text-primary text-xs font-bold uppercase tracking-widest mb-2 not-prose">Summary</h3>
        <p>{{ work.summary }}</p>
      </div>

       <!-- Notes -->
       <div v-if="work.notes" class="bg-background-tertiary/10 p-4 rounded-lg border-l-2 border-accent text-sm text-text-muted italic">
        <span class="block text-[10px] font-bold text-text-primary uppercase not-italic mb-1">Author's Notes</span>
        {{ work.notes }}
      </div>

    </div>
  </div>
</template>
