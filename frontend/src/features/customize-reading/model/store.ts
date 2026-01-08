import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';

export type FontFamily = 'serif' | 'sans';
export type PageWidth = 'narrow' | 'standard' | 'wide';
export type Theme = 'light' | 'sepia' | 'dark' | 'black';

export const useReadingSettingsStore = defineStore('readingSettings', () => {
  const getSaved = <T>(key: string, def: T): T => {
    const saved = localStorage.getItem(`reading_${key}`);
    return saved ? (JSON.parse(saved) as T) : def;
  };

  const fontSize = ref<number>(getSaved('fontSize', 24));
  const fontWeight = ref<number>(getSaved('fontWeight', 400));
  const letterSpacing = ref<number>(getSaved('letterSpacing', 0));
  const fontFamily = ref<FontFamily>(getSaved('fontFamily', 'serif'));
  const pageWidth = ref<PageWidth>(getSaved('pageWidth', 'wide'));
  const lineHeight = ref<number>(getSaved('lineHeight', 2.2));
  const theme = ref<Theme>(getSaved('theme', 'black'));
  const isFocusMode = ref(false);

  // ИЗМЕНЕНИЕ: Вместо isSettingsOpen (boolean) используем ID активного меню
  const activeMenuId = ref<string | null>(null);

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
  const setFocusMode = (value: boolean) => { isFocusMode.value = value; };
  const toggleFocusMode = () => { isFocusMode.value = !isFocusMode.value; };

  // ИЗМЕНЕНИЕ: Логика переключения принимает ID
  const toggleSettings = (id: string) => {
    if (activeMenuId.value === id) {
      activeMenuId.value = null;
    } else {
      activeMenuId.value = id;
    }
  };

  const closeSettings = () => {
    activeMenuId.value = null;
  };

  // Для совместимости, если где-то нужно проверить, открыто ли хоть что-то
  const isSettingsOpen = computed(() => activeMenuId.value !== null);

  // Закрываем меню при входе в фокус-режим
  watch(isFocusMode, (val) => {
    if (val) closeSettings();
  });

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
    isFocusMode,
    activeMenuId,
    isSettingsOpen,
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
    setFocusMode,
    toggleFocusMode,
    toggleSettings,
    closeSettings // Экспортируем close
  };
});
