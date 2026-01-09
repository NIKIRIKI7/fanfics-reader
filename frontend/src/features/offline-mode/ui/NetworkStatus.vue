<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOfflineStore } from '../model/store'
import { storeToRefs } from 'pinia'

const store = useOfflineStore()
const { isOnline } = storeToRefs(store)

// Локальное состояние для скрытия
const isDismissed = ref(false)

// Если статус сети меняется (например, интернет появился, а потом снова пропал),
// мы сбрасываем скрытие, чтобы снова уведомить пользователя.
watch(isOnline, (online) => {
  if (online) {
    isDismissed.value = false
  }
})

const dismiss = () => {
  isDismissed.value = true
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div
      v-if="!isOnline && !isDismissed"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[110] pointer-events-none"
    >
      <button
        @click="dismiss"
        class="pointer-events-auto cursor-pointer bg-red-600/90 backdrop-blur-sm text-white w-9 h-9 rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.4)] flex items-center justify-center border border-red-500/50 transition-all hover:bg-red-700 active:scale-95"
        title="Offline Mode Active (Click to dismiss)"
      >
        <span class="material-symbols-outlined text-[20px] animate-pulse">wifi_off</span>
      </button>
    </div>
  </transition>
</template>
