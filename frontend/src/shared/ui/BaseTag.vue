<script setup lang="ts">
import { useMagnetic } from '@/shared/lib/useMagnetic';

defineProps<{ label: string }>();

// Подключаем магнетизм
const { elementRef, magneticStyle, handleMouseMove, handleMouseLeave } = useMagnetic({
  strength: 0.3
});
</script>

<template>
  <span
    ref="elementRef"
    class="relative inline-flex items-center justify-center text-xs font-sans font-medium text-text-muted bg-background-tertiary/50 border border-transparent hover:border-border hover:bg-background-tertiary px-2.5 py-1 rounded-md cursor-pointer select-none active:scale-95"
    :style="magneticStyle"
    @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"
  >
    <span class="relative z-10 pointer-events-none">#{{ label }}</span>
  </span>
</template>
