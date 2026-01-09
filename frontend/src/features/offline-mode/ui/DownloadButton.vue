<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useOfflineStore } from '../model/store'
import type { Work } from '@/entities/work'
import gsap from 'gsap'
import { HapticPatterns, vibrate } from '@/shared/lib/haptics'
import { CheckCircle, Download } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    work: Work
    variant?: 'default' | 'ghost' // Новый проп
  }>(),
  {
    variant: 'default',
  },
)

const store = useOfflineStore()
const isDownloaded = computed(() => store.isDownloaded(props.work.id))
const buttonRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

const handleToggle = async () => {
  // Тактильный отклик
  vibrate(HapticPatterns.medium)

  if (buttonRef.value) {
    gsap.to(buttonRef.value, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    })
  }
  store.toggleDownload(props.work)
}

watch(isDownloaded, async () => {
  await nextTick()
  if (iconRef.value) {
    gsap.fromTo(
      iconRef.value,
      { rotation: -180, scale: 0.5, opacity: 0 },
      { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
    )
  }
})

const buttonClasses = computed(() => {
  if (props.variant === 'ghost') {
    return `flex items-center justify-center transition-colors p-0 border-none bg-transparent ${
      isDownloaded.value ? 'text-green-500' : 'text-text-muted hover:text-text-primary'
    }`
  }

  // Default styling
  return `flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm group ${
    isDownloaded.value
      ? 'bg-green-500/10 border-green-500 text-green-500'
      : 'bg-background-primary border-border text-text-muted hover:text-text-primary hover:border-text-muted'
  }`
})
</script>

<template>
  <button
    ref="buttonRef"
    @click="handleToggle"
    :class="buttonClasses"
    :title="isDownloaded ? 'Remove from Offline' : 'Download for Offline'"
  >
    <div
      class="relative flex items-center justify-center"
      :class="variant === 'ghost' ? 'w-6 h-6' : 'w-5 h-5'"
    >
      <span ref="iconRef" :key="isDownloaded ? 'check' : 'download'" class="absolute">
        <component
          :is="isDownloaded ? CheckCircle : Download"
          :size="variant === 'ghost' ? 26 : 20"
        />
      </span>
    </div>
    <span v-if="variant === 'default'" class="hidden xl:inline">
      {{ isDownloaded ? 'Downloaded' : 'Offline' }}
    </span>
  </button>
</template>
