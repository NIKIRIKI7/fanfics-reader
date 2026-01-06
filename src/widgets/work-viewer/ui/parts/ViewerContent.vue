<script setup lang="ts">
import { computed, ref } from 'vue';
import { useReadingSettingsStore, type Theme } from '@/features/customize-reading/model/store'; // Импортируем тип Theme
import { storeToRefs } from 'pinia';

defineProps<{ content: string }>();

const store = useReadingSettingsStore();
const { fontSize, fontFamily, pageWidth, lineHeight, fontWeight, letterSpacing, theme } = storeToRefs(store);

const contentRef = ref<HTMLElement | null>(null);

defineExpose({
  contentElement: contentRef
});

// Цветовые схемы для тем
const themeStyles: Record<Theme, { bg: string; text: string; shadow: string }> = {
  light: {
    bg: '#ffffff',
    text: '#1a1a1a',
    shadow: '0 4px 20px -2px rgba(0,0,0,0.1)'
  },
  sepia: {
    bg: '#f4ecd8',
    text: '#5b4636',
    shadow: '0 4px 20px -2px rgba(91, 70, 54, 0.1)'
  },
  dark: {
    bg: '#27272a', // Zinc 800
    text: '#e4e4e7', // Zinc 200
    shadow: '0 4px 20px -2px rgba(0,0,0,0.3)'
  },
  black: {
    bg: '#000000',
    text: '#a3a3a3',
    shadow: 'none'
  }
};

const containerClasses = computed(() => {
  const widthClass = {
    narrow: '!max-w-[600px]',
    standard: '!max-w-[800px]',
    wide: '!max-w-[1000px]'
  }[pageWidth.value];

  const fontClass = fontFamily.value === 'serif' ? 'font-display' : 'font-sans';

  return [widthClass, fontClass];
});

// Объединяем все стили в один computed
const styles = computed(() => {
  const currentTheme = themeStyles[theme.value];

  return {
    fontSize: `${fontSize.value}px`,
    lineHeight: `${lineHeight.value}`,
    fontWeight: fontWeight.value,
    letterSpacing: `${letterSpacing.value}px`, // Новое свойство
    // Стили темы
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    boxShadow: currentTheme.shadow
  };
});
</script>

<template>
  <!--
    Добавили padding (p-8 md:p-12), чтобы цвет фона не прилипал к тексту.
    Добавили rounded-xl для красоты.
  -->
  <article
    ref="contentRef"
    class="prose prose-invert mx-auto rounded-xl p-6 md:p-12 transition-all duration-300 ease-in-out"
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
.prose p {
  margin-bottom: 1.5em;
  font-family: inherit;
  font-weight: inherit;
  /* Наследуем цвет, чтобы он менялся вместе с темой */
  color: inherit;
}
.prose div {
  display: flex;
  justify-content: center;
}
.prose strong, .prose b {
  font-weight: 700;
  /* Жирный текст чуть ярче/темнее основного в зависимости от темы, но inherit сработает хорошо */
  color: inherit;
  filter: contrast(1.2); /* Небольшой хак для выделения */
}
</style>
