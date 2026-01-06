<script setup lang="ts">
import { computed, ref } from 'vue';
import { useReadingSettingsStore } from '@/features/customize-reading';
import { storeToRefs } from 'pinia';

defineProps<{ content: string }>();

const store = useReadingSettingsStore();
// Добавляем fontWeight сюда
const { fontSize, fontFamily, pageWidth, lineHeight, fontWeight } = storeToRefs(store);

const contentRef = ref<HTMLElement | null>(null);

defineExpose({
  contentElement: contentRef
});

const containerClasses = computed(() => {
  const widthClass = {
    narrow: '!max-w-[600px]',
    standard: '!max-w-[800px]',
    wide: '!max-w-[1000px]'
  }[pageWidth.value];

  const fontClass = fontFamily.value === 'serif' ? 'font-display' : 'font-sans';

  return [widthClass, fontClass];
});

// Добавляем fontWeight в стили
const styles = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: `${lineHeight.value}`,
  fontWeight: fontWeight.value
}));
</script>

<template>
  <!--
    Убрал max-w-none.
    Добавил mx-auto для центрирования при изменении ширины.
    Добавил ref="contentRef".
  -->
  <article
    ref="contentRef"
    class="prose prose-invert mx-auto text-text-secondary/90 leading-loose selection:bg-accent selection:text-background-primary transition-all duration-300 ease-in-out"
    :class="containerClasses"
    :style="styles"
    v-html="content"
  ></article>

  <div class="mt-16 pt-8 border-t border-border flex justify-center text-text-muted text-sm font-display italic">
    <p>End of transmission.</p>
  </div>
</template>

<style scoped>
.prose {
  max-width: 100%;
}
/* Добавляем наследование жирности для параграфов */
.prose p {
  margin-bottom: 1.5em;
  font-family: inherit;
  font-weight: inherit; /* Важно! */
}
.prose div {
  display: flex;
  justify-content: center;
}
/* Если в тексте есть strong/b теги, они должны быть жирнее основного текста */
.prose strong, .prose b {
  font-weight: 700;
  /* Или можно сделать умнее: calc(v-bind(fontWeight) + 300) если поддерживается */
  color: var(--color-text-primary);
}
</style>
