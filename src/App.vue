<script setup lang="ts">
import { RouterView } from 'vue-router';
import { TheNavbar, TheFooter } from '@/widgets/layout';
// Импортируем стор, чтобы следить за состоянием
import { useReadingSettingsStore } from '@/features/customize-reading';

const store = useReadingSettingsStore();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Скрываем Navbar в режиме фокуса -->
    <transition name="slide-down">
      <div v-show="!store.isFocusMode" class="z-50 relative">
        <TheNavbar />
      </div>
    </transition>

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Скрываем Footer в режиме фокуса -->
    <transition name="fade">
      <TheFooter v-show="!store.isFocusMode" />
    </transition>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0; }
</style>
