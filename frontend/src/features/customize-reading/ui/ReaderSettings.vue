<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { useReadingSettingsStore, type Theme } from '../model/store';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';

const props = withDefaults(defineProps<{
  placement?: 'bottom' | 'top';
  variant?: 'default' | 'ghost';
  menuId?: string; // ИЗМЕНЕНИЕ: Новый обязательный проп (по дефолту сгенерим, если нет)
}>(), {
  placement: 'bottom',
  variant: 'default',
  menuId: 'default-settings-menu'
});

const store = useReadingSettingsStore();
const {
  fontSize, fontWeight, letterSpacing, fontFamily,
  pageWidth, lineHeight, theme, activeMenuId
} = storeToRefs(store);

// ИЗМЕНЕНИЕ: Проверяем, совпадает ли ID в сторе с ID этого компонента
const isOpen = computed(() => activeMenuId.value === props.menuId);

const lineHeights = [
  { label: 'Compact', value: 1.4, icon: 'density_small' },
  { label: 'Standard', value: 1.8, icon: 'density_medium' },
  { label: 'Loose', value: 2.2, icon: 'density_large' }
];

const themesList: { value: Theme; label: string; colorBg: string; colorText: string }[] = [
  { value: 'light', label: 'Light', colorBg: '#ffffff', colorText: '#1a1a1a' },
  { value: 'sepia', label: 'Sepia', colorBg: '#f4ecd8', colorText: '#5b4636' },
  { value: 'dark', label: 'Dark', colorBg: '#27272a', colorText: '#e4e4e7' },
  { value: 'black', label: 'OLED', colorBg: '#000000', colorText: '#a3a3a3' },
];

const panelClasses = computed(() => {
  if (props.placement === 'top') {
    return 'fixed bottom-20 left-1/2 -translate-x-1/2 origin-bottom z-[60] w-[90vw] max-w-sm';
  }
  return 'absolute top-full mt-2 right-0 origin-top-right w-72 max-w-[calc(100vw-3rem)]';
});

const triggerClasses = computed(() => {
  if (props.variant === 'ghost') {
    return `flex items-center justify-center transition-colors p-0 border-none bg-transparent ${
      isOpen.value ? 'text-accent' : 'text-text-muted hover:text-text-primary'
    }`;
  }
  return `flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm ${
    isOpen.value
      ? 'bg-accent text-background-primary border-accent'
      : 'bg-background-primary border-border text-text-secondary hover:text-text-primary'
  }`;
});

const onEnterPanel = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  const groups = element.querySelectorAll('.setting-group');
  const startScale = props.placement === 'top' ? 0.9 : 0.92;
  const transformOrigin = props.placement === 'top' ? 'bottom center' : 'top right';
  gsap.fromTo(element, { opacity: 0, scale: startScale, transformOrigin: transformOrigin, y: props.placement === 'top' ? 20 : 0 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' });
  if (groups.length > 0) {
    gsap.fromTo(groups, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1, onComplete: done });
  } else { done(); }
};

const onLeavePanel = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.9, y: props.placement === 'top' ? 20 : 0, duration: 0.2, ease: 'power2.in', onComplete: done });
};

const handleThemeChange = async (newTheme: Theme, event: MouseEvent) => {
  if (!document.startViewTransition) { store.setTheme(newTheme); return; }
  const x = event.clientX; const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.documentElement.style.setProperty('--theme-x', `${x}px`); document.documentElement.style.setProperty('--theme-y', `${y}px`); document.documentElement.style.setProperty('--theme-radius', '0px');
  const transition = document.startViewTransition(async () => { store.setTheme(newTheme); await nextTick(); });
  await transition.ready;
  const tween = { val: 0 };
  gsap.to(tween, { val: endRadius, duration: 0.8, ease: 'power1.in', onUpdate: () => { document.documentElement.style.setProperty('--theme-radius', `${tween.val}px`); } });
};
</script>

<template>
  <div class="relative z-40">
    <button
      @click="store.toggleSettings(props.menuId)"
      :class="triggerClasses"
    >
      <span
        class="material-symbols-outlined"
        :class="variant === 'ghost' ? 'text-[26px]' : 'text-[20px]'"
      >text_fields</span>
      <span v-if="variant === 'default'" class="hidden sm:inline">Appearance</span>
    </button>

    <Teleport to="body" :disabled="placement !== 'top'">
      <!-- ИЗМЕНЕНИЕ: v-if="isOpen" теперь зависит от ID -->
      <transition :css="false" @enter="onEnterPanel" @leave="onLeavePanel">
        <div v-if="isOpen" :class="['bg-background-primary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-5 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar', panelClasses]">

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Theme</span><div class="flex gap-3 justify-between bg-background-tertiary rounded-lg p-3"><button v-for="t in themesList" :key="t.value" @click="handleThemeChange(t.value, $event)" class="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-sm relative overflow-hidden shrink-0" :class="theme === t.value ? 'border-accent scale-110' : 'border-transparent'" :style="{ backgroundColor: t.colorBg }" :title="t.label"><span v-if="theme === t.value" class="material-symbols-outlined absolute inset-0 m-auto text-[20px]" :style="{ color: t.colorText }">check</span></button></div></div>

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Size</span><div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1"><button @click="store.decreaseFont" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button><span class="text-sm font-sans font-medium w-12 text-center">{{ fontSize }}px</span><button @click="store.increaseFont" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"><span class="material-symbols-outlined text-sm">add</span></button></div></div>

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Weight</span><div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1"><button @click="store.decreaseWeight" :disabled="fontWeight <= 100" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50"><span class="material-symbols-outlined text-sm">remove</span></button><span class="text-sm font-sans font-medium w-20 text-center">{{ fontWeight }}</span><button @click="store.increaseWeight" :disabled="fontWeight >= 900" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50"><span class="material-symbols-outlined text-sm">add</span></button></div></div>

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Tracking</span><div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1"><button @click="store.decreaseSpacing" :disabled="letterSpacing <= -2" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50"><span class="material-symbols-outlined text-sm">remove</span></button><span class="text-sm font-sans font-medium w-20 text-center">{{ letterSpacing }}px</span><button @click="store.increaseSpacing" :disabled="letterSpacing >= 10" class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors disabled:opacity-50"><span class="material-symbols-outlined text-sm">add</span></button></div></div>

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Typeface</span><div class="flex bg-background-tertiary rounded-lg p-1"><button @click="store.setFontFamily('serif')" :class="['flex-1 py-1.5 text-sm rounded transition-all font-display', fontFamily === 'serif' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary']">Serif</button><button @click="store.setFontFamily('sans')" :class="['flex-1 py-1.5 text-sm rounded transition-all font-sans', fontFamily === 'sans' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-secondary']">Sans</button></div></div>

          <div class="flex flex-col gap-2 setting-group"><span class="text-xs text-text-muted font-bold uppercase tracking-widest">Layout</span><div class="grid grid-cols-2 gap-2"><div class="flex bg-background-tertiary rounded-lg p-1"><button v-for="lh in lineHeights" :key="lh.value" @click="store.setLineHeight(lh.value)" :class="['flex-1 flex items-center justify-center rounded transition-all', lineHeight === lh.value ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-secondary']"><span class="material-symbols-outlined text-[16px]">{{ lh.icon }}</span></button></div><div class="flex bg-background-tertiary rounded-lg p-1"><button v-for="width in ['narrow', 'standard', 'wide'] as const" :key="width" @click="store.setPageWidth(width)" :class="['flex-1 flex items-center justify-center rounded transition-all', pageWidth === width ? 'bg-background-primary text-text-primary shadow-sm' : 'text-text-muted hover:text-secondary']"><span class="material-symbols-outlined text-[16px]" v-if="width === 'narrow'">align_justify_center</span><span class="material-symbols-outlined text-[16px]" v-else-if="width === 'standard'">format_align_justify</span><span class="material-symbols-outlined text-[16px]" v-else>format_align_left</span></button></div></div></div>

        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
</style>
