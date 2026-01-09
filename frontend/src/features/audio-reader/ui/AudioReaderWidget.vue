<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useAudioReaderStore } from '../model/store'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'
import { AudioWaveform, Mic, StopCircle, Play, Pause, ChevronDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    content: string
    authorAudioUrl?: string
    placement?: 'top' | 'bottom'
    variant?: 'default' | 'ghost'
  }>(),
  {
    placement: 'bottom',
    variant: 'default',
  },
)

const store = useAudioReaderStore()
const { isPlaying, isPaused, rate, voices, selectedVoiceURI, isTtsSupported, activeMode } =
  storeToRefs(store)

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

// --- Logic: Click Outside ---
const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return

  const target = event.target as Node
  if (
    panelRef.value &&
    !panelRef.value.contains(target) &&
    triggerRef.value &&
    !triggerRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (ctx) ctx.revert()
  store.stop()
})
// -----------------------------

const togglePlay = () => {
  if (isPlaying.value) {
    store.pause()
  } else {
    store.play(props.content, props.authorAudioUrl)
  }
}

const selectMode = (mode: 'tts' | 'author') => {
  store.setMode(mode)
}

const onEnter = (el: Element, done: () => void) => {
  ctx = gsap.context(() => {
    const yStart = props.placement === 'top' ? 20 : -10
    const origin = props.placement === 'top' ? 'bottom center' : 'top right'
    gsap.fromTo(
      el,
      { opacity: 0, y: yStart, scale: 0.95, transformOrigin: origin },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.2)', onComplete: done },
    )
  }, el)
}

const onLeave = (el: Element, done: () => void) => {
  const yEnd = props.placement === 'top' ? 20 : -10
  gsap.to(el, { opacity: 0, y: yEnd, scale: 0.95, duration: 0.2, onComplete: done })
}

const voiceOptions = computed(() =>
  voices.value.map((v) => ({
    label: v.name.length > 22 ? v.name.slice(0, 20) + '...' : v.name,
    value: v.voiceURI,
  })),
)

const panelClasses = computed(() => {
  if (props.placement === 'top') {
    return 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm origin-bottom'
  }
  return 'absolute top-full mt-3 right-0 origin-top-right w-80 z-30'
})

const triggerClasses = computed(() => {
  if (props.variant === 'ghost') {
    return `w-full h-full flex items-center justify-center transition-colors p-0 border-none bg-transparent outline-none ${
      isPlaying.value || isPaused.value || isOpen.value
        ? 'text-accent'
        : 'text-text-muted hover:text-text-primary'
    }`
  }
  return `flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm group w-full md:w-auto ${
    isPlaying.value || isPaused.value || isOpen.value
      ? 'bg-accent text-background-primary border-accent'
      : 'bg-background-primary border-border text-text-muted hover:text-text-primary hover:border-text-muted'
  }`
})

// Исправление: w-full h-full применяем только для ghost (мобильного) режима
const containerClasses = computed(() => {
  const base = 'relative z-30 font-sans'
  return props.variant === 'ghost' ? `${base} w-full h-full` : base
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Trigger Button -->
    <button
      ref="triggerRef"
      @click="isOpen = !isOpen"
      :class="triggerClasses"
      title="Audio Log Protocol"
    >
      <component
        :is="activeMode === 'author' ? AudioWaveform : Mic"
        :class="[{ 'animate-pulse': isPlaying }]"
        :size="variant === 'ghost' ? 26 : 20"
      />
      <span v-if="variant === 'default'" class="hidden xl:inline">
        {{ activeMode === 'author' ? 'Audio File' : 'Neural Log' }}
      </span>
    </button>

    <!-- Player Panel -->
    <Teleport to="body" :disabled="placement !== 'top'">
      <transition :css="false" @enter="onEnter" @leave="onLeave">
        <div
          v-if="isOpen"
          ref="panelRef"
          class="bg-background-secondary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 flex flex-col gap-4"
          :class="panelClasses"
        >
          <!-- Mode Switcher -->
          <div v-if="authorAudioUrl" class="flex p-1 bg-background-tertiary rounded-lg">
            <button
              @click="selectMode('tts')"
              class="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-300"
              :class="
                activeMode === 'tts'
                  ? 'bg-background-primary text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              "
            >
              Neural TTS
            </button>
            <button
              @click="selectMode('author')"
              class="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-300"
              :class="
                activeMode === 'author'
                  ? 'bg-background-primary text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              "
            >
              Author Record
            </button>
          </div>

          <div class="flex items-center justify-between border-b border-border/50 pb-2">
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full transition-colors"
                :class="isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
              ></div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-text-muted">{{
                activeMode === 'author' ? 'Source: File' : 'Source: Neural'
              }}</span>
            </div>
            <button
              @click="store.stop()"
              class="text-text-muted hover:text-red-500 transition-colors"
              title="Terminate"
            >
              <StopCircle :size="18" />
            </button>
          </div>

          <div class="flex items-center justify-center gap-6 py-2">
            <button
              @click="togglePlay"
              class="w-14 h-14 rounded-full bg-accent text-background-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              <component
                :is="isPlaying ? Pause : Play"
                :size="32"
                class="ml-1"
                fill="currentColor"
              />
            </button>
          </div>

          <div
            class="h-8 flex items-center justify-center gap-[3px] bg-background-tertiary/30 rounded-lg overflow-hidden px-2 relative"
          >
            <span
              v-if="activeMode === 'author' && !authorAudioUrl"
              class="text-[10px] text-red-500 absolute font-bold"
              >FILE NOT FOUND</span
            >
            <div
              v-for="i in 16"
              :key="i"
              class="w-1 bg-accent rounded-full transition-all duration-100"
              :class="isPlaying ? 'animate-wave' : 'h-[2px] opacity-30'"
              :style="{ animationDelay: `${i * 0.05}s` }"
            ></div>
          </div>

          <div class="space-y-3 pt-2 border-t border-border/50">
            <div v-if="activeMode === 'tts' && isTtsSupported" class="flex flex-col gap-1">
              <label class="text-[10px] uppercase text-text-muted font-bold">Voice Module</label>
              <div class="relative">
                <select
                  :value="selectedVoiceURI"
                  @change="store.setVoice(($event.target as HTMLSelectElement).value)"
                  class="w-full bg-background-tertiary border border-border rounded px-2 py-1.5 text-xs text-text-primary outline-none focus:border-accent font-sans appearance-none"
                >
                  <option v-for="v in voiceOptions" :key="v.value" :value="v.value">
                    {{ v.label }}
                  </option>
                </select>
                <ChevronDown
                  class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                  :size="12"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex justify-between">
                <label class="text-[10px] uppercase text-text-muted font-bold">Playback Rate</label>
                <span class="text-[10px] text-text-primary font-mono">{{ rate }}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                :value="rate"
                @input="store.setRate(Number(($event.target as HTMLInputElement).value))"
                class="w-full h-1 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.animate-wave {
  animation: wave 0.8s infinite ease-in-out;
}
@keyframes wave {
  0%,
  100% {
    height: 10%;
    opacity: 0.5;
  }
  50% {
    height: 90%;
    opacity: 1;
  }
}
</style>
