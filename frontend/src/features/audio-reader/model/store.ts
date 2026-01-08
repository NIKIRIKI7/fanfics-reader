import { defineStore } from 'pinia';
import { ref } from 'vue';
import { stripHtml } from '@/shared/lib/textUtils';

export type AudioMode = 'tts' | 'author';

export const useAudioReaderStore = defineStore('audioReader', () => {
  // --- STATE ---
  const isTtsSupported = 'speechSynthesis' in window;

  // Общее состояние
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const activeMode = ref<AudioMode>('tts');

  // Настройки
  const rate = ref(Number(localStorage.getItem('audio_rate')) || 1);
  const selectedVoiceURI = ref(localStorage.getItem('audio_voice') || '');

  // TTS Internal
  const voices = ref<SpeechSynthesisVoice[]>([]);
  const currentUtterance = ref<SpeechSynthesisUtterance | null>(null);

  // Author Audio Internal
  const authorAudioElement = new Audio();

  // --- INIT VOICES (TTS) ---
  const loadVoices = () => {
    if (!isTtsSupported) return;
    const all = window.speechSynthesis.getVoices();
    voices.value = all.sort((a, b) => a.lang.localeCompare(b.lang));

    // FIX: Исправлена ошибка типизации "Object is possibly undefined"
    // Используем опциональную цепочку (?.voiceURI) и фоллбэк (|| '')
    if (!selectedVoiceURI.value && voices.value.length > 0) {
      const eng = voices.value.find(v => v.lang.startsWith('en'));
      const fallback = voices.value[0];
      selectedVoiceURI.value = eng ? eng.voiceURI : (fallback?.voiceURI || '');
    }
  };

  if (isTtsSupported) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }

  // --- AUDIO EVENT LISTENERS (AUTHOR MODE) ---
  authorAudioElement.addEventListener('ended', () => {
    isPlaying.value = false;
    isPaused.value = false;
  });
  authorAudioElement.addEventListener('pause', () => {
    if (!authorAudioElement.ended) {
      // Логика паузы управляется через actions, здесь просто синхронизация
    }
  });

  // --- ACTIONS ---

  const setMode = (mode: AudioMode) => {
    stop();
    activeMode.value = mode;
  };

  const play = (htmlContent: string, audioUrl?: string) => {
    if (activeMode.value === 'author' && !audioUrl) {
      setMode('tts');
    }

    // 1. RESUME
    if (isPaused.value) {
      if (activeMode.value === 'tts' && isTtsSupported) {
        window.speechSynthesis.resume();
      } else if (activeMode.value === 'author') {
        authorAudioElement.play();
      }
      isPaused.value = false;
      isPlaying.value = true;
      return;
    }

    // 2. START NEW
    stop();

    if (activeMode.value === 'tts' && isTtsSupported) {
      const text = stripHtml(htmlContent);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate.value;

      const voice = voices.value.find(v => v.voiceURI === selectedVoiceURI.value);
      if (voice) utterance.voice = voice;

      utterance.onend = () => { isPlaying.value = false; isPaused.value = false; };
      utterance.onerror = () => { isPlaying.value = false; isPaused.value = false; };

      currentUtterance.value = utterance;
      window.speechSynthesis.speak(utterance);
    }
    else if (activeMode.value === 'author' && audioUrl) {
      authorAudioElement.src = audioUrl;
      authorAudioElement.playbackRate = rate.value;
      authorAudioElement.play().catch(e => console.error("Audio play failed", e));
    }

    isPlaying.value = true;
  };

  const pause = () => {
    if (activeMode.value === 'tts' && isTtsSupported) {
      if (window.speechSynthesis.speaking) window.speechSynthesis.pause();
    } else {
      authorAudioElement.pause();
    }
    isPaused.value = true;
    isPlaying.value = false;
  };

  const stop = () => {
    if (isTtsSupported) window.speechSynthesis.cancel();
    authorAudioElement.pause();
    authorAudioElement.currentTime = 0;

    isPlaying.value = false;
    isPaused.value = false;
    currentUtterance.value = null;
  };

  const setRate = (val: number) => {
    rate.value = val;
    localStorage.setItem('audio_rate', String(val));

    if (activeMode.value === 'author') {
      authorAudioElement.playbackRate = val;
    }
  };

  const setVoice = (uri: string) => {
    selectedVoiceURI.value = uri;
    localStorage.setItem('audio_voice', uri);
  };

  return {
    isTtsSupported,
    isPlaying,
    isPaused,
    activeMode,
    voices,
    rate,
    selectedVoiceURI,
    setMode,
    play,
    pause,
    stop,
    setRate,
    setVoice
  };
});
