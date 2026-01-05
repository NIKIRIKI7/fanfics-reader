<script setup lang="ts">
import { computed } from 'vue';
import { useReadingSettingsStore } from '@/features/customize-reading';
import { storeToRefs } from 'pinia';

defineProps<{ content: string }>();

const store = useReadingSettingsStore();
const { fontSize, fontFamily, pageWidth } = storeToRefs(store);

// Вычисляем классы контейнера на основе настроек
const containerClasses = computed(() => {
  const widthClass = {
    narrow: 'max-w-[600px]',
    standard: 'max-w-[800px]',
    wide: 'max-w-[1000px]'
  }[pageWidth.value];

  const fontClass = fontFamily.value === 'serif' ? 'font-display' : 'font-sans';

  return [widthClass, fontClass];
});

// Динамические стили для размера шрифта
const styles = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: '1.6' // Относительный интерлиньяж для читаемости
}));
</script>

<template>
  <!-- Добавляем transition-all для плавного изменения ширины -->
  <article
    class="prose prose-invert max-w-none text-text-secondary/90 leading-loose selection:bg-accent selection:text-background-primary mx-auto transition-[max-width] duration-300 ease-in-out"
    :class="containerClasses"
    :style="styles"
    v-html="content"
  ></article>

  <div class="mt-16 pt-8 border-t border-border flex justify-center text-text-muted text-sm font-display italic">
    <p>End of transmission.</p>
  </div>
</template>

<style>
/* Переопределяем базовые стили prose, так как мы управляем ими динамически */
.prose p {
  margin-bottom: 1.5em;
  font-family: inherit; /* Наследуем от контейнера */
}
/* Центрирование разделителей внутри текста */
.prose div {
    display: flex;
    justify-content: center;
}
</style>