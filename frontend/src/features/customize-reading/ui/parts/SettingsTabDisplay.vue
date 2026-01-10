<script setup lang="ts">
import { useReadingSettingsStore, type Theme } from '../../model/store'
import { storeToRefs } from 'pinia'
import { Check, AlignJustify, AlignLeft, AlignCenter } from 'lucide-vue-next'

const store = useReadingSettingsStore()
const { fontSize, fontFamily, pageWidth, theme } = storeToRefs(store)

const themesList: { value: Theme; label: string; colorBg: string; colorText: string }[] = [
  { value: 'light', label: 'Light', colorBg: '#ffffff', colorText: '#1a1a1a' },
  { value: 'sepia', label: 'Sepia', colorBg: '#f4ecd8', colorText: '#5b4636' },
  { value: 'dark', label: 'Dark', colorBg: '#27272a', colorText: '#e4e4e7' },
  { value: 'black', label: 'OLED', colorBg: '#000000', colorText: '#a3a3a3' },
]
</script>

<template>
  <div class="flex flex-col gap-5 animate-in slide-in-from-left-4 fade-in duration-300">

    <!-- Theme Colors -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest pl-1">Theme</span>
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="t in themesList"
          :key="t.value"
          @click="store.setTheme(t.value)"
          class="h-10 w-full rounded-full border transition-transform active:scale-95 hover:scale-105 relative flex items-center justify-center"
          :class="theme === t.value ? 'border-accent ring-2 ring-accent/20 shadow-sm' : 'border-border/50'"
          :style="{ backgroundColor: t.colorBg }"
          :title="t.label"
        >
          <Check
            v-if="theme === t.value"
            class="transition-all scale-100 opacity-100"
            :style="{ color: t.colorText }"
            :size="18"
          />
        </button>
      </div>
    </div>

    <!-- Font Family -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest pl-1">Typeface</span>
      <div class="flex bg-background-tertiary rounded-lg p-1 gap-1">
        <button
          @click="store.setFontFamily('serif')"
          class="flex-1 py-1.5 text-sm rounded transition-all font-display border border-transparent"
          :class="fontFamily === 'serif' ? 'bg-background-primary shadow-sm text-text-primary font-bold border-border/10' : 'text-text-muted hover:text-text-primary'"
        >
          Serif
        </button>
        <button
          @click="store.setFontFamily('sans')"
          class="flex-1 py-1.5 text-sm rounded transition-all font-sans border border-transparent"
          :class="fontFamily === 'sans' ? 'bg-background-primary shadow-sm text-text-primary font-bold border-border/10' : 'text-text-muted hover:text-text-primary'"
        >
          Sans
        </button>
      </div>
    </div>

    <!-- Font Size Slider -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-end pl-1 pr-1">
        <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Size</span>
        <span class="text-sm font-bold text-text-primary tabular-nums leading-none">{{ fontSize }}px</span>
      </div>
      <div class="flex items-center gap-3 bg-background-tertiary/40 p-2 rounded-xl border border-border/30">
        <span class="text-[10px] font-serif text-text-muted font-bold px-1">A</span>
        <input
          type="range"
          min="12"
          max="32"
          step="1"
          v-model.number="fontSize"
          class="w-full h-1.5 bg-background-tertiary rounded-full appearance-none cursor-pointer accent-accent"
        />
        <span class="text-base font-serif text-text-primary font-bold px-1">A</span>
      </div>
    </div>

    <!-- Page Width -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest pl-1">Width</span>
      <div class="flex bg-background-tertiary rounded-lg p-1 gap-1">
        <button
          v-for="width in ['narrow', 'standard', 'wide'] as const"
          :key="width"
          @click="store.setPageWidth(width)"
          :class="[
            'flex-1 flex items-center justify-center rounded transition-all h-9 border border-transparent',
            pageWidth === width
                ? 'bg-background-primary text-text-primary shadow-sm border-border/10'
                : 'text-text-muted hover:text-text-secondary',
            ]"
        >
          <component
            :is="width === 'narrow' ? AlignCenter : width === 'standard' ? AlignJustify : AlignLeft"
            :size="18"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--color-accent);
  margin-top: -8px; /* выравнивание по центру трека */
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.1s;
}
input[type=range]:active::-webkit-slider-thumb {
  transform: scale(1.1);
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px; /* Тонкий трек */
  cursor: pointer;
  background: var(--bg-tertiary);
  border-radius: 2px;
}
</style>
