<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Work } from '@/entities/work'
import ShareModal from './ShareModal.vue'
import { Share2 } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    work: Work
    variant?: 'default' | 'ghost'
  }>(),
  {
    variant: 'default',
  },
)

const isModalOpen = ref(false)

const buttonClasses = computed(() => {
  const base = 'flex items-center justify-center transition-all group cursor-pointer'

  if (props.variant === 'ghost') {
    return `${base} text-text-muted hover:text-text-primary p-0 bg-transparent border-none`
  }

  return `${base} gap-2 px-3 py-2 rounded-lg border border-border bg-background-primary text-text-secondary hover:text-text-primary hover:border-text-muted text-xs uppercase font-bold tracking-wider shadow-sm`
})
</script>

<template>
  <button
    v-bind="$attrs"
    @click="isModalOpen = true"
    :class="buttonClasses"
    title="Share Transmission"
  >
    <Share2
      class="transition-transform"
      :class="variant === 'default' ? 'group-hover:scale-110' : ''"
      :size="variant === 'ghost' ? 24 : 20"
    />
    <!-- Текст показываем только в дефолтном варианте и на десктопе -->
    <span v-if="variant === 'default'" class="hidden md:inline">Share</span>
  </button>

  <ShareModal :work="work" :is-open="isModalOpen" @close="isModalOpen = false" />
</template>
