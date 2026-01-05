<script setup lang="ts">
import { computed, ref } from 'vue';
import { useReadingSettingsStore } from '@/features/customize-reading';
import { storeToRefs } from 'pinia';

defineProps<{ content: string }>();

const store = useReadingSettingsStore();
const { fontSize, fontFamily, pageWidth, lineHeight } = storeToRefs(store);

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

const styles = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: `${lineHeight.value}`
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
/* Дополнительные переопределения для вложенных элементов, если Tailwind Typography будет упрямиться */
.prose {
  max-width: 100%; /* Разрешаем контейнеру занимать доступную ширину до ограничения max-w-[...] */
}

.prose p {
  margin-bottom: 1.5em;
  font-family: inherit;
}

.prose div {
  display: flex;
  justify-content: center;
}
</style>
