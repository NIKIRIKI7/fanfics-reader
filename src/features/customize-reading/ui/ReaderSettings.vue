<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReadingSettingsStore } from '../model/store';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{
  placement?: 'bottom' | 'top'
}>(), {
  placement: 'bottom'
});

const store = useReadingSettingsStore();
const { fontSize, fontWeight, fontFamily, pageWidth, lineHeight } = storeToRefs(store);

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);

const lineHeights = [
  { label: 'Compact', value: 1.4, icon: 'density_small' },
  { label: 'Standard', value: 1.8, icon: 'density_medium' },
  { label: 'Loose', value: 2.2, icon: 'density_large' }
];

const panelPositionClasses = computed(() => {
  return props.placement === 'top'
    ? 'bottom-full mb-3 right-0 origin-bottom-right'
    : 'top-full mt-2 right-0 origin-top-right';
});
</script>

<template>
  <div class="relative z-40">
    <!-- Toggle Button -->
    <button
      @click="toggle"
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider shadow-sm',
        isOpen
          ? 'bg-accent text-background-primary border-accent'
          : 'bg-background-primary border-border text-text-secondary hover:text-text-primary'
      ]"
    >
      <span class="material-symbols-outlined text-[20px]">text_fields</span>
      <span class="hidden sm:inline">Appearance</span>
    </button>

    <!-- Dropdown Panel -->
    <transition name="fade-scale">
      <div
        v-if="isOpen"
        :class="[
          'absolute w-72 max-w-[calc(100vw-3rem)] bg-background-primary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-5 flex flex-col gap-6',
          panelPositionClasses
        ]"
      >
        <!-- 1. Font Size -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Size</span>
          <div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1">
            <button
              @click="store.decreaseFont"
              class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"
            >
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>
            <span class="text-sm font-sans font-medium w-12 text-center">{{ fontSize }}px</span>
            <button
              @click="store.increaseFont"
              class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"
            >
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        <!-- 2. Font Weight (Изменено на цифры) -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Weight</span>
          <div class="flex items-center justify-between bg-background-tertiary rounded-lg p-1">
            <button
              @click="store.decreaseWeight"
              class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"
              :disabled="fontWeight <= 100"
              :class="{ 'opacity-50 cursor-not-allowed': fontWeight <= 100 }"
            >
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>

            <!-- ЗДЕСЬ ИЗМЕНЕНИЕ: просто fontWeight вместо weightLabel -->
            <span class="text-sm font-sans font-medium w-20 text-center">{{ fontWeight }}</span>

            <button
              @click="store.increaseWeight"
              class="w-10 h-8 flex items-center justify-center hover:bg-background-primary rounded transition-colors"
              :disabled="fontWeight >= 900"
              :class="{ 'opacity-50 cursor-not-allowed': fontWeight >= 900 }"
            >
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        <!-- 3. Font Family (Typeface) -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Typeface</span>
          <div class="flex bg-background-tertiary rounded-lg p-1">
            <button
              @click="store.setFontFamily('serif')"
              :class="[
                'flex-1 py-1.5 text-sm rounded transition-all font-display',
                fontFamily === 'serif' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary'
              ]"
            >
              Serif
            </button>
            <button
              @click="store.setFontFamily('sans')"
              :class="[
                'flex-1 py-1.5 text-sm rounded transition-all font-sans',
                fontFamily === 'sans' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-secondary'
              ]"
            >
              Sans
            </button>
          </div>
        </div>

        <!-- Line Height -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Spacing</span>
          <div class="flex gap-2">
            <button
              v-for="lh in lineHeights"
              :key="lh.value"
              @click="store.setLineHeight(lh.value)"
              :class="[
                'flex-1 py-2 rounded border transition-all flex items-center justify-center',
                lineHeight === lh.value
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border text-text-muted hover:border-text-muted'
              ]"
              :title="lh.label"
            >
              <span class="material-symbols-outlined text-[16px]">{{ lh.icon }}</span>
            </button>
          </div>
        </div>

        <!-- Width -->
        <div class="flex flex-col gap-2">
          <span class="text-xs text-text-muted font-bold uppercase tracking-widest">Width</span>
          <div class="flex gap-2">
            <button
              v-for="width in ['narrow', 'standard', 'wide'] as const"
              :key="width"
              @click="store.setPageWidth(width)"
              :class="[
                'flex-1 py-2 rounded border transition-all flex items-center justify-center',
                pageWidth === width
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border text-text-muted hover:border-text-muted'
              ]"
              :title="width"
            >
              <span class="material-symbols-outlined text-[16px]" v-if="width === 'narrow'">align_justify_center</span>
              <span class="material-symbols-outlined text-[16px]" v-else-if="width === 'standard'">format_align_justify</span>
              <span class="material-symbols-outlined text-[16px]" v-else>format_align_left</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>