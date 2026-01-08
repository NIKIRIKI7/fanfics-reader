import { defineStore } from 'pinia';
import { ref } from 'vue';
// FIX: Импорт через Public API
import type { Track } from '@/entities/work';

export const useSceneSoundtrackStore = defineStore('sceneSoundtrack', () => {
  const currentTrack = ref<Track | null>(null);
  const isPlaying = ref(false);
  const activeWidgetId = ref<string | null>(null); // ID виджета, который сейчас открыт/играет
  
  // HTML5 Audio элемент (синглтон)
  const audio = new Audio();

  // Слушатели событий аудио
  audio.addEventListener('ended', () => {
    isPlaying.value = false;
  });
  
  audio.addEventListener('pause', () => {
    isPlaying.value = false;
  });

  audio.addEventListener('play', () => {
    isPlaying.value = true;
  });

  const playTrack = (track: Track, widgetId: string) => {
    // Если нажат тот же трек
    if (currentTrack.value?.id === track.id) {
      togglePlay();
      return;
    }

    // Новый трек
    currentTrack.value = track;
    activeWidgetId.value = widgetId;
    audio.src = track.url;
    audio.load();
    audio.play().catch(e => console.error("Audio play error:", e));
    isPlaying.value = true;
  };

  const togglePlay = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    isPlaying.value = false;
    currentTrack.value = null;
    activeWidgetId.value = null;
  };

  const setVolume = (val: number) => {
    audio.volume = Math.max(0, Math.min(1, val));
  };

  return {
    currentTrack,
    isPlaying,
    activeWidgetId,
    playTrack,
    togglePlay,
    stop,
    setVolume
  };
});