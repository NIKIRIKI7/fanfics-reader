<script setup lang="ts">
import { ref } from 'vue';
// FIX: Импорт через Public API
import type { SceneSoundtrack, Track } from '@/entities/work';
import { useSceneSoundtrackStore } from '../model/store';
import { storeToRefs } from 'pinia';
import { onEnterAccordion, onLeaveAccordion } from '@/shared/lib/gsapTransitions';

const props = defineProps<{
  playlist: SceneSoundtrack
}>();

const store = useSceneSoundtrackStore();
const { currentTrack, isPlaying, activeWidgetId } = storeToRefs(store);

const isOpen = ref(false);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const play = (track: Track) => {
  store.playTrack(track, props.playlist.id);
};

const isTrackActive = (trackId: string) => {
  return currentTrack.value?.id === trackId && activeWidgetId.value === props.playlist.id;
};
</script>

<template>
  <div class="my-8 font-sans select-none max-w-md">
    <!-- Main Button (Sketch Style) -->
    <div 
      @click="toggleOpen"
      class="group inline-flex flex-col cursor-pointer transition-all duration-300"
    >
      <div 
        class="relative border-2 px-6 py-3 rounded-lg flex items-center gap-4 transition-all duration-300 bg-background-primary z-10"
        :class="[
          isOpen || (activeWidgetId === playlist.id && isPlaying)
            ? 'border-accent text-accent shadow-[4px_4px_0px_0px_rgba(var(--color-accent),0.2)] translate-x-[-2px] translate-y-[-2px]' 
            : 'border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
        ]"
      >
        <span class="material-symbols-outlined text-[24px] animate-pulse" v-if="activeWidgetId === playlist.id && isPlaying">
          graphic_eq
        </span>
        <span class="material-symbols-outlined text-[24px]" v-else>
          music_note
        </span>
        
        <div class="flex flex-col">
          <span class="text-xs uppercase font-bold tracking-[0.2em] leading-none mb-1">Atmosphere</span>
          <span class="text-lg font-display font-bold italic leading-none">
            {{ playlist.title || 'Soundtrack' }}
          </span>
        </div>

        <span 
          class="material-symbols-outlined ml-2 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
        >
          expand_more
        </span>
      </div>
    </div>

    <!-- Dropdown List -->
    <transition
      :css="false"
      @enter="onEnterAccordion" @leave="onLeaveAccordion"
    >
      <div 
        v-if="isOpen"
        class="mt-2 ml-4 border-l-2 border-border pl-4 flex flex-col gap-2 overflow-hidden"
      >
        <div 
          v-for="track in playlist.tracks" 
          :key="track.id"
          @click="play(track)"
          class="p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 border border-transparent hover:border-border hover:bg-background-tertiary/30 group"
          :class="{ 'bg-accent/5 border-accent/20': isTrackActive(track.id) }"
        >
          <div class="flex items-center gap-3 overflow-hidden">
             <!-- Play/Pause Icon -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0"
              :class="isTrackActive(track.id) ? 'bg-accent text-background-primary' : 'bg-background-tertiary text-text-secondary group-hover:bg-text-secondary group-hover:text-background-primary'"
            >
              <span class="material-symbols-outlined text-[16px]">
                {{ isTrackActive(track.id) && isPlaying ? 'pause' : 'play_arrow' }}
              </span>
            </div>

            <div class="flex flex-col overflow-hidden">
              <span 
                class="text-sm font-bold truncate transition-colors"
                :class="isTrackActive(track.id) ? 'text-accent' : 'text-text-primary'"
              >
                {{ track.title }}
              </span>
              <span class="text-xs text-text-muted truncate">{{ track.artist }}</span>
            </div>
          </div>

          <!-- Equalizer Animation (active) -->
          <div v-if="isTrackActive(track.id) && isPlaying" class="flex items-end gap-[2px] h-3 ml-2">
            <div class="w-1 bg-accent animate-music-bar-1"></div>
            <div class="w-1 bg-accent animate-music-bar-2"></div>
            <div class="w-1 bg-accent animate-music-bar-3"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@keyframes music-bar {
  0%, 100% { height: 20%; }
  50% { height: 100%; }
}
.animate-music-bar-1 { animation: music-bar 0.6s infinite ease-in-out; }
.animate-music-bar-2 { animation: music-bar 0.8s infinite ease-in-out 0.1s; }
.animate-music-bar-3 { animation: music-bar 0.5s infinite ease-in-out 0.2s; }
</style>