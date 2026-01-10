import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export type FontFamily = 'serif' | 'sans'
export type PageWidth = 'narrow' | 'standard' | 'wide'
export type Theme = 'light' | 'sepia' | 'dark' | 'black'

export const useReadingSettingsStore = defineStore('readingSettings', () => {
  const getSaved = <T>(key: string, def: T): T => {
    const saved = localStorage.getItem(`reading_${key}`)
    return saved ? (JSON.parse(saved) as T) : def
  }

  const fontSize = ref<number>(getSaved('fontSize', 24))
  const fontWeight = ref<number>(getSaved('fontWeight', 400))
  const letterSpacing = ref<number>(getSaved('letterSpacing', 0))
  const fontFamily = ref<FontFamily>(getSaved('fontFamily', 'serif'))
  const pageWidth = ref<PageWidth>(getSaved('pageWidth', 'wide'))
  const lineHeight = ref<number>(getSaved('lineHeight', 2.2))
  const theme = ref<Theme>(getSaved('theme', 'black'))

  // Новая настройка: Haptics (по умолчанию true)
  const enableHaptics = ref<boolean>(getSaved('enableHaptics', true))

  const isFocusMode = ref(false)

  // ИЗМЕНЕНИЕ: Вместо isSettingsOpen (boolean) используем ID активного меню
  const activeMenuId = ref<string | null>(null)

  // Новые настройки для Reading Ruler
  const isRulerEnabled = ref<boolean>(getSaved('isRulerEnabled', false))
  const rulerHeight = ref<number>(getSaved('rulerHeight', 120)) // Высота "окна" в пикселях
  const rulerIntensity = ref<number>(getSaved('rulerIntensity', 0.6)) // Прозрачность затемнения (0-1)

  // NEW: Infinite Scroll Setting
  const isInfiniteScrollEnabled = ref<boolean>(getSaved('isInfiniteScrollEnabled', true))

  const increaseFont = () => {
    if (fontSize.value < 32) fontSize.value += 2
  }
  const decreaseFont = () => {
    if (fontSize.value > 12) fontSize.value -= 2
  }
  const increaseWeight = () => {
    if (fontWeight.value < 900) fontWeight.value += 100
  }
  const decreaseWeight = () => {
    if (fontWeight.value > 100) fontWeight.value -= 100
  }
  const increaseSpacing = () => {
    if (letterSpacing.value < 10) letterSpacing.value += 0.5
  }
  const decreaseSpacing = () => {
    if (letterSpacing.value > -2) letterSpacing.value -= 0.5
  }
  const setFontFamily = (family: FontFamily) => {
    fontFamily.value = family
  }
  const setPageWidth = (width: PageWidth) => {
    pageWidth.value = width
  }
  const setLineHeight = (height: number) => {
    lineHeight.value = height
  }
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }
  const setFocusMode = (value: boolean) => {
    isFocusMode.value = value
  }
  const toggleFocusMode = () => {
    isFocusMode.value = !isFocusMode.value
  }

  // Toggle Haptics
  const toggleHaptics = () => {
    enableHaptics.value = !enableHaptics.value
  }

  // ИЗМЕНЕНИЕ: Логика переключения принимает ID
  const toggleSettings = (id: string) => {
    if (activeMenuId.value === id) {
      activeMenuId.value = null
    } else {
      activeMenuId.value = id
    }
  }

  const closeSettings = () => {
    activeMenuId.value = null
  }

  // Методы для Ruler
  const toggleRuler = () => { isRulerEnabled.value = !isRulerEnabled.value }
  const setRulerHeight = (h: number) => { rulerHeight.value = h }
  const setRulerIntensity = (i: number) => { rulerIntensity.value = i }

  // NEW
  const toggleInfiniteScroll = () => {
    isInfiniteScrollEnabled.value = !isInfiniteScrollEnabled.value
  }

  // Для совместимости, если где-то нужно проверить, открыто ли хоть что-то
  const isSettingsOpen = computed(() => activeMenuId.value !== null)

  // Закрываем меню при входе в фокус-режим
  watch(isFocusMode, (val) => {
    if (val) closeSettings()
  })

  watch(
    [
      fontSize, fontWeight, letterSpacing, fontFamily, pageWidth, lineHeight, theme, enableHaptics,
      isRulerEnabled, rulerHeight, rulerIntensity, isInfiniteScrollEnabled
    ],
    () => {
      localStorage.setItem('reading_fontSize', JSON.stringify(fontSize.value))
      localStorage.setItem('reading_fontWeight', JSON.stringify(fontWeight.value))
      localStorage.setItem('reading_letterSpacing', JSON.stringify(letterSpacing.value))
      localStorage.setItem('reading_fontFamily', JSON.stringify(fontFamily.value))
      localStorage.setItem('reading_pageWidth', JSON.stringify(pageWidth.value))
      localStorage.setItem('reading_lineHeight', JSON.stringify(lineHeight.value))
      localStorage.setItem('reading_theme', JSON.stringify(theme.value))
      localStorage.setItem('reading_enableHaptics', JSON.stringify(enableHaptics.value))
      localStorage.setItem('reading_isRulerEnabled', JSON.stringify(isRulerEnabled.value))
      localStorage.setItem('reading_rulerHeight', JSON.stringify(rulerHeight.value))
      localStorage.setItem('reading_rulerIntensity', JSON.stringify(rulerIntensity.value))
      localStorage.setItem('reading_isInfiniteScrollEnabled', JSON.stringify(isInfiniteScrollEnabled.value))
    },
  )

  return {
    fontSize,
    fontWeight,
    letterSpacing,
    fontFamily,
    pageWidth,
    lineHeight,
    theme,
    enableHaptics,
    isFocusMode,
    activeMenuId,
    isSettingsOpen,
    isRulerEnabled,
    rulerHeight,
    rulerIntensity,
    isInfiniteScrollEnabled, // Export
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
    toggleHaptics,
    setFocusMode,
    toggleFocusMode,
    toggleSettings,
    closeSettings,
    toggleRuler,
    setRulerHeight,
    setRulerIntensity,
    toggleInfiniteScroll // Export
  }
})
