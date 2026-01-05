<script setup lang="ts">
import { ref } from 'vue';
import { useReadingSettingsStore } from '../model/store';
import { storeToRefs } from 'pinia';

const store = useReadingSettingsStore();
const { fontSize, fontFamily, pageWidth } = storeToRefs(store);
const isOpen = ref(false);

const toggle = () => (isOpen.value = !isOpen.value);
</script>

<template>
  <div class="relative z-40">
    <!-- Toggle Button -->
    <button
      @click="toggle"
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs uppercase font-bold tracking-wider',
        isOpen
          ? 'bg-accent text-background-primary border-accent'
          : 'bg-background-primary border-border text-text-secondary hover:text-text-primary'
      ]"
    >
      <span class="material-symbols-outlined text-[18px]">text_fields</span>
      <span class="hidden sm:inline">Appearance</span>
    </button>

    <!-- Dropdown Panel -->
    <transition name="fade-slide">
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-2 w-72 bg-background-primary/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-5 flex flex-col gap-6"
      >
        <!-- Font Size -->
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

        <!-- Font Family -->
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
                fontFamily === 'sans' ? 'bg-background-primary shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary'
              ]"
            >
              Sans
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>