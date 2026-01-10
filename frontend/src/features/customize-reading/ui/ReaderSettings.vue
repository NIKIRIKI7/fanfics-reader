<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReadingSettingsStore } from '../model/store'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'
import { Type, Palette, SlidersHorizontal } from 'lucide-vue-next'
import SettingsTabDisplay from './parts/SettingsTabDisplay.vue'
import SettingsTabTune from './parts/SettingsTabTune.vue'

const props = withDefaults(
  defineProps<{
    placement?: 'bottom' | 'top'
    variant?: 'default' | 'ghost'
    menuId?: string
  }>(),
  {
    placement: 'bottom',
    variant: 'default',
    menuId: 'default-settings-menu',
  },
)

const store = useReadingSettingsStore()
const { activeMenuId } = storeToRefs(store)

const isOpen = computed(() => activeMenuId.value === props.menuId)
const activeTab = ref<'style' | 'tune'>('style')

const panelClasses = computed(() => {
  if (props.placement === 'top') {
    return 'fixed bottom-20 left-1/2 -translate-x-1/2 origin-bottom z-[60] w-[90vw] max-w-[340px]'
  }
  return 'absolute top-full mt-2 right-0 origin-top-right w-[320px] max-w-[calc(100vw-2rem)]'
})

const triggerClasses = computed(() => {
  if (props.variant === 'ghost') {
    return `flex items-center justify-center transition-colors p-0 border-none bg-transparent ${
      isOpen.value ? 'text-accent' : 'text-text-muted hover:text-text-primary'
    }`
  }
  return `flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm select-none ${
    isOpen.value
      ? 'bg-accent text-background-primary border-accent'
      : 'bg-background-primary border-border text-text-secondary hover:text-text-primary hover:border-text-muted'
  }`
})

const onEnterPanel = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  const startScale = props.placement === 'top' ? 0.9 : 0.95
  const transformOrigin = props.placement === 'top' ? 'bottom center' : 'top right'

  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: startScale,
      transformOrigin: transformOrigin,
      y: props.placement === 'top' ? 10 : -10,
    },
    { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'back.out(1.2)', onComplete: done },
  )
}

const onLeavePanel = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.95,
    y: props.placement === 'top' ? 10 : -10,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: done,
  })
}
</script>

<template>
  <div class="relative z-40 font-sans">
    <button @click="store.toggleSettings(props.menuId)" :class="triggerClasses">
      <Type :size="variant === 'ghost' ? 24 : 18" />
      <span v-if="variant === 'default'" class="hidden sm:inline">Appearance</span>
    </button>

    <Teleport to="body" :disabled="placement !== 'top'">
      <transition :css="false" @enter="onEnterPanel" @leave="onLeavePanel">
        <div
          v-if="isOpen"
          :class="[
            'bg-background-primary/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl flex flex-col overflow-hidden ring-1 ring-white/5',
            panelClasses,
          ]"
        >
          <!-- Header / Tabs -->
          <div class="flex border-b border-border/40 p-1.5 bg-background-tertiary/20 gap-1.5">
            <button
              v-for="tab in ['style', 'tune'] as const"
              :key="tab"
              @click="activeTab = tab"
              class="flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 select-none"
              :class="
                activeTab === tab
                  ? 'bg-background-primary text-text-primary shadow-sm ring-1 ring-border/50'
                  : 'text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50'
              "
            >
              <component :is="tab === 'style' ? Palette : SlidersHorizontal" :size="14" />
              {{ tab === 'style' ? 'Display' : 'Fine Tune' }}
            </button>
          </div>

          <!-- Content Area -->
          <div class="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div class="relative">
              <SettingsTabDisplay v-if="activeTab === 'style'" />
              <SettingsTabTune v-else />
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}
</style>
