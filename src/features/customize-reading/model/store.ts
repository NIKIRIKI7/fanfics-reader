import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type FontFamily = 'serif' | 'sans';
export type PageWidth = 'narrow' | 'standard' | 'wide';

export const useReadingSettingsStore = defineStore('readingSettings', () => {
  // Инициализируем из localStorage или значениями по умолчанию
  const getSaved = <T>(key: string, def: T): T => {
    const saved = localStorage.getItem(`reading_${key}`);
    return saved ? (JSON.parse(saved) as T) : def;
  };

  const fontSize = ref<number>(getSaved('fontSize', 18)); // px
  const fontFamily = ref<FontFamily>(getSaved('fontFamily', 'serif'));
  const pageWidth = ref<PageWidth>(getSaved('pageWidth', 'standard'));

  // Действия
  const increaseFont = () => {
    if (fontSize.value < 32) fontSize.value += 2;
  };

  const decreaseFont = () => {
    if (fontSize.value > 12) fontSize.value -= 2;
  };

  const setFontFamily = (family: FontFamily) => {
    fontFamily.value = family;
  };

  const setPageWidth = (width: PageWidth) => {
    pageWidth.value = width;
  };

  // Сохранение в LocalStorage при изменении
  watch([fontSize, fontFamily, pageWidth], () => {
    localStorage.setItem('reading_fontSize', JSON.stringify(fontSize.value));
    localStorage.setItem('reading_fontFamily', JSON.stringify(fontFamily.value));
    localStorage.setItem('reading_pageWidth', JSON.stringify(pageWidth.value));
  });

  return {
    fontSize,
    fontFamily,
    pageWidth,
    increaseFont,
    decreaseFont,
    setFontFamily,
    setPageWidth,
  };
});