<script setup lang="ts">
interface Props {
  variant?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  class?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: 'auto',
  class: ''
});
</script>

<template>
  <div
    class="animate-pulse bg-background-tertiary/60 rounded-md"
    :class="[
      variant === 'circle' ? 'rounded-full' : 'rounded-md',
      variant === 'text' ? 'h-4 my-1' : '',
      $props.class
    ]"
    :style="{ width, height: variant !== 'text' ? height : undefined }"
  ></div>
</template>