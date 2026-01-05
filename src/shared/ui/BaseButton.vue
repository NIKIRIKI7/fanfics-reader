<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'outline' | 'ghost';
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  block: false
});

const classes = computed(() => {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-accent text-background-primary hover:opacity-90 border border-transparent",
    outline: "border border-border text-text-secondary hover:text-text-primary hover:border-text-primary bg-transparent",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-background-tertiary/20"
  };

  const width = props.block ? "w-full" : "";

  return [base, variants[props.variant], width].join(" ");
});
</script>

<template>
  <button :class="classes">
    <slot />
  </button>
</template>