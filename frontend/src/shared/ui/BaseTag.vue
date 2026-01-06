<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <span 
    class="text-xs font-sans text-text-muted bg-background-tertiary/50 border border-transparent hover:border-border px-2 py-1 rounded cursor-pointer transition-colors duration-300 hover:text-text-primary"
  >
    #{{ label }}
  </span>
</template>