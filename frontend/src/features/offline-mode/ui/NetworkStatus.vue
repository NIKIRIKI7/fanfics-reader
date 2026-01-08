<script setup lang="ts">
import { useOfflineStore } from '../model/store';
import { storeToRefs } from 'pinia';

const store = useOfflineStore();
const { isOnline } = storeToRefs(store);
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="!isOnline"
      class="fixed bottom-0 left-0 w-full bg-red-600 text-white py-1 text-center text-xs font-bold uppercase tracking-widest z-[100]"
    >
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[16px] animate-pulse">wifi_off</span>
        Offline Mode Active
      </div>
    </div>
  </transition>
</template>