<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { TheNavbar, TheFooter } from '@/widgets/layout';
import { useReadingSettingsStore } from '@/features/customize-reading';
import { NetworkStatus } from '@/features/offline-mode'; // <--- IMPORT
import { onEnterFade, onLeaveFade, onEnterSlideDown, onLeaveSlideDown } from '@/shared/lib/gsapTransitions';

const store = useReadingSettingsStore();
const route = useRoute(); // Импортируем useRoute
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Network Indicator -->
    <NetworkStatus /> <!-- <--- INSERT -->

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
          <!--
            ДОБАВЛЕН :key="route.path"
            Это гарантирует, что при смене роута старый компонент уничтожается,
            а новый создается с нуля. GSAP Context будет работать корректно.
          -->
          <component :is="Component" :key="route.path" />
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
