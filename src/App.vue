<script setup lang="ts">
import { RouterView } from 'vue-router';
import { TheNavbar, TheFooter } from '@/widgets/layout';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheNavbar />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <TheFooter />
  </div>
</template>
