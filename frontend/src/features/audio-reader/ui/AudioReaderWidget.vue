<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useAudioReaderStore } from '../model/store';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';

const props = defineProps<{
  content: string;
  authorAudioUrl?: string; // Пропс для ссылки на файл
}>();

const store = useAudioReaderStore();
const { isPlaying, isPaused, rate, voices, selectedVoiceURI, isTtsSupported, activeMode } = storeToRefs(store);

const isOpen = ref(false);
const panelRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context;

// Переключение воспроизведения
const togglePlay = () => {
  if (isPlaying.value) {
    store.pause();
  } else {
    store.play(props.content, props.authorAudioUrl);
  }
};

// Выбор режима
const selectMode = (mode: 'tts' | 'author') => {
  store.setMode(mode);
};

// GSAP Animations
const onEnter = (el: Element, done: () => void) => {
  ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.2)', onComplete: done }
    );
  }, el);
};

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, y: 10, scale: 0.95, duration: 0.2, onComplete: done });
};

onUnmounted(() => {
  if (ctx) ctx.revert();
  store.stop(); // Останавливаем звук при уходе со страницы
});

const voiceOptions = computed(() => voices.value.map(v => ({
  label: v.name.length > 22 ? v.name.slice(0, 20) + '...' : v.name,
  value: v.voiceURI
})));
</script>

<template>
  <div class="relative z-30 font-sans">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm group"
      :class="[
        isPlaying || isPaused || isOpen
          ? 'bg-accent text-background-primary border-accent'
          : 'bg-background-primary border-border text-text-muted hover:text-text-primary hover:border-text-muted'
      ]"
      title="Audio Log Protocol"
    >
      <span class="material-symbols-outlined text-[20px]" :class="{'animate-pulse': isPlaying}">
        {{ activeMode === 'author' ? 'graphic_eq' : 'record_voice_over' }}
      </span>
      <span class="hidden xl:inline">
        {{ activeMode === 'author' ? 'Audio File' : 'Neural Log' }}
      </span>
    </button>

    <!-- Player Panel -->
    <transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="absolute top-full right-0 mt-3 w-80 bg-background-secondary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 flex flex-col gap-4 origin-top-right"
      >
        <!-- Mode Switcher (Tabs) -->
        <!-- Показываем табы только если есть авторская озвучка -->
        <div v-if="authorAudioUrl" class="flex p-1 bg-background-tertiary rounded-lg">
          <button
            @click="selectMode('tts')"
            class="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-300"
            :class="activeMode === 'tts' ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
          >
            Neural TTS
          </button>
          <button
            @click="selectMode('author')"
            class="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-300"
            :class="activeMode === 'author' ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
          >
            Author Record
          </button>
        </div>

        <!-- Header Status -->
        <div class="flex items-center justify-between border-b border-border/50 pb-2">
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 rounded-full transition-colors" :class="isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
             <span class="text-[10px] font-bold uppercase tracking-widest text-text-muted">
               {{ activeMode === 'author' ? 'Source: File' : 'Source: Neural' }}
             </span>
          </div>
          <button @click="store.stop()" class="text-text-muted hover:text-red-500 transition-colors" title="Terminate">
            <span class="material-symbols-outlined text-[18px]">stop_circle</span>
          </button>
        </div>

        <!-- Main Controls -->
        <div class="flex items-center justify-center gap-6 py-2">
           <button
             @click="togglePlay"
             class="w-14 h-14 rounded-full bg-accent text-background-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
           >
             <span class="material-symbols-outlined text-[32px] ml-1">
               {{ isPlaying ? 'pause' : 'play_arrow' }}
             </span>
           </button>
        </div>

        <!-- Visualizer -->
        <div class="h-8 flex items-center justify-center gap-[3px] bg-background-tertiary/30 rounded-lg overflow-hidden px-2 relative">
          <!-- Надпись если файл недоступен -->
          <span v-if="activeMode === 'author' && !authorAudioUrl" class="text-[10px] text-red-500 absolute font-bold">FILE NOT FOUND</span>

          <div
            v-for="i in 16" :key="i"
            class="w-1 bg-accent rounded-full transition-all duration-100"
            :class="isPlaying ? 'animate-wave' : 'h-[2px] opacity-30'"
            :style="{ animationDelay: `${i * 0.05}s` }"
          ></div>
        </div>

        <!-- Settings -->
        <div class="space-y-3 pt-2 border-t border-border/50">
          <!-- Voice (Only for TTS) -->
          <div v-if="activeMode === 'tts' && isTtsSupported" class="flex flex-col gap-1">
             <label class="text-[10px] uppercase text-text-muted font-bold">Voice Module</label>
             <div class="relative">
               <select
                 :value="selectedVoiceURI"
                 @change="store.setVoice(($event.target as HTMLSelectElement).value)"
                 class="w-full bg-background-tertiary border border-border rounded px-2 py-1.5 text-xs text-text-primary outline-none focus:border-accent font-sans appearance-none"
               >
                 <option v-for="v in voiceOptions" :key="v.value" :value="v.value">{{ v.label }}</option>
               </select>
               <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-text-muted">expand_more</span>
             </div>
          </div>

          <!-- Speed (For both modes) -->
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
             >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.animate-wave {
  animation: wave 0.8s infinite ease-in-out;
}
 @keyframes wave {
  0%, 100% { height: 10%; opacity: 0.5; }
  50% { height: 90%; opacity: 1; }
}
</style>
