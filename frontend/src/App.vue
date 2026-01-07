<script setup lang="ts">
import { RouterView } from 'vue-router';
import { TheNavbar, TheFooter } from '@/widgets/layout';
import { useReadingSettingsStore } from '@/features/customize-reading';
import { onEnterFade, onLeaveFade, onEnterSlideDown, onLeaveSlideDown } from '@/shared/lib/gsapTransitions';

const store = useReadingSettingsStore();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar с GSAP анимацией -->
    <transition
      :css="false"
      @enter="onEnterSlideDown" @leave="onLeaveSlideDown"
    >
      <div v-show="!store.isFocusMode" class="z-50 relative">
        <TheNavbar />
      </div>
    </transition>

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition
          :css="false"
          mode="out-in"
          @enter="onEnterFade" @leave="onLeaveFade"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer с GSAP анимацией -->
    <transition
      :css="false"
      @enter="onEnterFade" @leave="onLeaveFade"
    >
      <TheFooter v-show="!store.isFocusMode" />
    </transition>
  </div>
</template>
