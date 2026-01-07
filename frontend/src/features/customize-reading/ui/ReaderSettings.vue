<script setup lang="ts">
import { computed } from 'vue'; // ref больше не нужен для открытия
import { useReadingSettingsStore, type Theme } from '../model/store';
import { storeToRefs } from 'pinia';
import { onEnterScale, onLeaveScale } from '@/shared/lib/gsapTransitions';

const props = withDefaults(defineProps<{
  placement?: 'bottom' | 'top'
}>(), {
  placement: 'bottom'
});

const store = useReadingSettingsStore();
const {
  fontSize, fontWeight, letterSpacing, fontFamily,
  pageWidth, lineHeight, theme, isSettingsOpen // Достаем isSettingsOpen
} = storeToRefs(store);

// Убрали локальный const isOpen = ref(false);

const lineHeights = [
  { label: 'Compact', value: 1.4, icon: 'density_small' },
  { label: 'Standard', value: 1.8, icon: 'density_medium' },
  { label: 'Loose', value: 2.2, icon: 'density_large' }
];

// Конфигурация тем для отображения кнопок
const themesList: { value: Theme; label: string; colorBg: string; colorText: string }[] = [
  { value: 'light', label: 'Light', colorBg: '#ffffff', colorText: '#1a1a1a' },
  { value: 'sepia', label: 'Sepia', colorBg: '#f4ecd8', colorText: '#5b4636' },
  { value: 'dark', label: 'Dark', colorBg: '#27272a', colorText: '#e4e4e7' },
  { value: 'black', label: 'OLED', colorBg: '#000000', colorText: '#a3a3a3' },
];

const panelPositionClasses = computed(() => {
  return props.placement === 'top'
    ? 'bottom-full mb-3 right-0 origin-bottom-right'
    : 'top-full mt-2 right-0 origin-top-right';
});
</script>

<template>
  <div class="relative z-40">
    <!-- ИЗМЕНЕНИЕ: @click вызывает store.toggleSettings -->
    <button
      @click="store.toggleSettings"
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm',
        isSettingsOpen
          ? 'bg-accent text-background-primary border-accent'
          : 'bg-background-primary border-border text-text-secondary hover:text-text-primary'
      ]"
    >
      <span class="material-symbols-outlined text-[20px]">text_fields</span>
      <span class="hidden sm:inline">Appearance</span>
    </button>

    <!-- Заменили <transition name="fade-scale"> на хуки GSAP -->
    <transition
      :css="false"
      @enter="onEnterScale" @leave="onLeaveScale"
    >
      <!-- ИЗМЕНЕНИЕ: v-if зависит от isSettingsOpen -->
      <div
        v-if="isSettingsOpen"
        :class="[
          'absolute w-72 max-w-[calc(100vw-3rem)] bg-background-primary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-5 flex flex-col gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar',
          panelPositionClasses
        ]"
      >
        <!-- 1. Theme (Background) - NEW -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Theme</span>
          <div class="flex gap-3 justify-between bg-background-tertiary rounded-lg p-3">
            <button
              v-for="t in themesList"
              :key="t.value"
              @click="store.setTheme(t.value)"
              class="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-sm relative"
              :class="theme === t.value ? 'border-accent scale-110' : 'border-transparent'"
              :style="{ backgroundColor: t.colorBg }"
              :title="t.label"
            >
              <!-- Галочка активной темы -->
              <span
                v-if="theme === t.value"
                class="material-symbols-outlined absolute inset-0 m-auto text-[20px]"
                :style="{ color: t.colorText }"
              >check</span>
            </button>
          </div>
        </div>

        <!-- 2. Font Size -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Size</span>
          <div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1">
            <button @click="store.decreaseFont" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors">
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>
            <span class="text-sm font-sans font-medium w-12 text-center">{{ fontSize }}px</span>
            <button @click="store.increaseFont" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors">
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        <!-- 3. Font Weight -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Weight</span>
          <div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1">
            <button @click="store.decreaseWeight" :disabled="fontWeight <= 100" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50">
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>
            <span class="text-sm font-sans font-medium w-20 text-center">{{ fontWeight }}</span>
            <button @click="store.increaseWeight" :disabled="fontWeight >= 900" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50">
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        <!-- 4. Letter Spacing - NEW -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Tracking</span>
          <div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1">
            <button @click="store.decreaseSpacing" :disabled="letterSpacing <= -2" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50">
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>
            <span class="text-sm font-sans font-medium w-20 text-center">{{ letterSpacing }}px</span>
            <button @click="store.increaseSpacing" :disabled="letterSpacing >= 10" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50">
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        <!-- 5. Typeface -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Typeface</span>
          <div class="flex bg-background-tertiary rounded-lg p-1">
            <button @click="store.setFontFamily('serif')" :class="['flex-1 py-1.5 text-sm rounded transition-all font-display', fontFamily === 'serif' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary']">Serif</button>
            <button @click="store.setFontFamily('sans')" :class="['flex-1 py-1.5 text-sm rounded transition-all font-sans', fontFamily === 'sans' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-secondary']">Sans</button>
          </div>
        </div>

        <!-- 6. Line Height & Width -->
         <!-- (Можно объединить в одну строку для экономии места, если меню слишком длинное) -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Layout</span>
          <div class="grid grid-cols-2 gap-2">
             <!-- Height -->
             <div class="flex bg-background-tertiary rounded-lg p-1">
                <button v-for="lh in lineHeights" :key="lh.value" @click="store.setLineHeight(lh.value)" :class="['flex-1 flex items-center justify-center rounded transition-all', lineHeight === lh.value ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-secondary']">
                   <span class="material-symbols-outlined text-[16px]">{{ lh.icon }}</span>
                </button>
             </div>
             <!-- Width -->
             <div class="flex bg-background-tertiary rounded-lg p-1">
                <button v-for="width in ['narrow', 'standard', 'wide'] as const" :key="width" @click="store.setPageWidth(width)" :class="['flex-1 flex items-center justify-center rounded transition-all', pageWidth === width ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-secondary']">
                   <span class="material-symbols-outlined text-[16px]" v-if="width === 'narrow'">align_justify_center</span>
                   <span class="material-symbols-outlined text-[16px]" v-else-if="width === 'standard'">format_align_justify</span>
                   <span class="material-symbols-outlined text-[16px]" v-else>format_align_left</span>
                </button>
             </div>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
</style>