import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type FontFamily = 'serif' | 'sans';
export type PageWidth = 'narrow' | 'standard' | 'wide';
export type Theme = 'light' | 'sepia' | 'dark' | 'black';

export const useReadingSettingsStore = defineStore('readingSettings', () => {
  const getSaved = <T>(key: string, def: T): T => {
    const saved = localStorage.getItem(`reading_${key}`);
    return saved ? (JSON.parse(saved) as T) : def;
  };

  // --- ОБНОВЛЕННЫЕ ДЕФОЛТНЫЕ ЗНАЧЕНИЯ ---

  const fontSize = ref<number>(getSaved('fontSize', 24)); // Было 18 -> Стало 24
  const fontWeight = ref<number>(getSaved('fontWeight', 400)); // 400
  const letterSpacing = ref<number>(getSaved('letterSpacing', 0)); // 0
  const fontFamily = ref<FontFamily>(getSaved('fontFamily', 'serif')); // Serif

  // Rightmost icon selected -> 'wide'
  const pageWidth = ref<PageWidth>(getSaved('pageWidth', 'wide')); // Было 'standard' -> Стало 'wide'

  // Rightmost icon selected -> 2.2 (Loose)
  const lineHeight = ref<number>(getSaved('lineHeight', 2.2)); // Было 1.8 -> Стало 2.2

  // Checkmark on black circle -> 'black'
  const theme = ref<Theme>(getSaved('theme', 'black')); // Было 'dark' -> Стало 'black'

  // НОВОЕ СОСТОЯНИЕ: Focus Mode (не сохраняем в LS)
  const isFocusMode = ref(false);

  // --- ACTIONS ---

  const increaseFont = () => { if (fontSize.value < 32) fontSize.value += 2; };
  const decreaseFont = () => { if (fontSize.value > 12) fontSize.value -= 2; };

  const increaseWeight = () => { if (fontWeight.value < 900) fontWeight.value += 100; };
  const decreaseWeight = () => { if (fontWeight.value > 100) fontWeight.value -= 100; };

  const increaseSpacing = () => { if (letterSpacing.value < 10) letterSpacing.value += 0.5; };
  const decreaseSpacing = () => { if (letterSpacing.value > -2) letterSpacing.value -= 0.5; };

  const setFontFamily = (family: FontFamily) => { fontFamily.value = family; };
  const setPageWidth = (width: PageWidth) => { pageWidth.value = width; };
  const setLineHeight = (height: number) => { lineHeight.value = height; };

  const setTheme = (newTheme: Theme) => { theme.value = newTheme; };

  // Управление Focus Mode
  const setFocusMode = (value: boolean) => { isFocusMode.value = value; };
  const toggleFocusMode = () => { isFocusMode.value = !isFocusMode.value; };

  // --- WATCHER ---
  watch([fontSize, fontWeight, letterSpacing, fontFamily, pageWidth, lineHeight, theme], () => {
    localStorage.setItem('reading_fontSize', JSON.stringify(fontSize.value));
    localStorage.setItem('reading_fontWeight', JSON.stringify(fontWeight.value));
    localStorage.setItem('reading_letterSpacing', JSON.stringify(letterSpacing.value));
    localStorage.setItem('reading_fontFamily', JSON.stringify(fontFamily.value));
    localStorage.setItem('reading_pageWidth', JSON.stringify(pageWidth.value));
    localStorage.setItem('reading_lineHeight', JSON.stringify(lineHeight.value));
    localStorage.setItem('reading_theme', JSON.stringify(theme.value));
  });

  return {
    fontSize,
    fontWeight,
    letterSpacing,
    fontFamily,
    pageWidth,
    lineHeight,
    theme,
    isFocusMode, // Экспорт
    increaseFont,
    decreaseFont,
    increaseWeight,
    decreaseWeight,
    increaseSpacing,
    decreaseSpacing,
    setFontFamily,
    setPageWidth,
    setLineHeight,
    setTheme,
    setFocusMode, // Экспорт
    toggleFocusMode // Экспорт
  };
});
