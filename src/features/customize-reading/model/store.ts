import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type FontFamily = 'serif' | 'sans';
export type PageWidth = 'narrow' | 'standard' | 'wide';

export const useReadingSettingsStore = defineStore('readingSettings', () => {
  const getSaved = <T>(key: string, def: T): T => {
    const saved = localStorage.getItem(`reading_${key}`);
    return saved ? (JSON.parse(saved) as T) : def;
  };

  const fontSize = ref<number>(getSaved('fontSize', 18));
  const fontFamily = ref<FontFamily>(getSaved('fontFamily', 'serif'));
  const pageWidth = ref<PageWidth>(getSaved('pageWidth', 'standard'));
  const lineHeight = ref<number>(getSaved('lineHeight', 1.8));

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

  const setLineHeight = (height: number) => {
    lineHeight.value = height;
  };

  watch([fontSize, fontFamily, pageWidth, lineHeight], () => {
    localStorage.setItem('reading_fontSize', JSON.stringify(fontSize.value));
    localStorage.setItem('reading_fontFamily', JSON.stringify(fontFamily.value));
    localStorage.setItem('reading_pageWidth', JSON.stringify(pageWidth.value));
    localStorage.setItem('reading_lineHeight', JSON.stringify(lineHeight.value));
  });

  return {
    fontSize,
    fontFamily,
    pageWidth,
    lineHeight,
    increaseFont,
    decreaseFont,
    setFontFamily,
    setPageWidth,
    setLineHeight
  };
});