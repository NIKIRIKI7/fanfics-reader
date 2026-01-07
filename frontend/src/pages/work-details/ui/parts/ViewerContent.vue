<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useReadingSettingsStore, type Theme } from '@/features/customize-reading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{ content: string }>();

const store = useReadingSettingsStore();
// ДОБАВЛЕНО: isFocusMode в destructuring
const { fontSize, fontFamily, pageWidth, lineHeight, fontWeight, letterSpacing, theme, isFocusMode } = storeToRefs(store);

const contentRef = ref<HTMLElement | null>(null);
let animationContext: gsap.Context | null = null;

defineExpose({
  contentElement: contentRef
});

const themeStyles: Record<Theme, { bg: string; text: string; shadow: string }> = {
  light: { bg: '#ffffff', text: '#1a1a1a', shadow: '0 4px 20px -2px rgba(0,0,0,0.1)' },
  sepia: { bg: '#f4ecd8', text: '#5b4636', shadow: '0 4px 20px -2px rgba(91, 70, 54, 0.1)' },
  dark: { bg: '#27272a', text: '#e4e4e7', shadow: '0 4px 20px -2px rgba(0,0,0,0.3)' },
  black: { bg: '#000000', text: '#a3a3a3', shadow: 'none' }
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

const styles = computed(() => {
  const currentTheme = themeStyles[theme.value];
  return {
    fontSize: `${fontSize.value}px`,
    lineHeight: `${lineHeight.value}`,
    fontWeight: fontWeight.value,
    letterSpacing: `${letterSpacing.value}px`,
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    boxShadow: currentTheme.shadow
  };
});

const animateContent = async () => {
  if (animationContext) {
    animationContext.revert();
  }

  if (!contentRef.value) return;

  await nextTick();

  setTimeout(() => {
    const el = contentRef.value;
    if (!el) return;

    animationContext = gsap.context(() => {
      const targets = el.children;
      if (!targets || targets.length === 0) return;

      // Скрываем элементы
      gsap.set(targets, { opacity: 0, y: 30 });

      ScrollTrigger.batch(targets, {
        start: "top 95%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: true
          });
        },
        once: true
      });

      ScrollTrigger.refresh();

    }, el);
  }, 100);
};

onMounted(() => {
  animateContent();
});

watch(() => props.content, () => {
  animateContent();
});

// Watcher для настроек шрифта
watch([fontSize, lineHeight, pageWidth, fontFamily], async () => {
  await nextTick();
  ScrollTrigger.refresh();
});

// ИСПРАВЛЕНИЕ: Следим за режимом фокусировки
// Когда скрывается header/navbar, весь контент сдвигается.
// ScrollTrigger должен пересчитать позиции, иначе триггеры окажутся в неправильных местах
// и текст может остаться невидимым (opacity: 0).
watch(isFocusMode, async () => {
  // Ждем пока Vue применит классы и исчезнет header (время transitions может влиять)
  // setTimeout нужен, чтобы дать время CSS-анимации исчезновения navbar закончится
  await nextTick();
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 350); // 350ms чуть больше стандартной длительности transition (300ms)
});

onBeforeUnmount(() => {
  if (animationContext) animationContext.revert();
});
</script>

<template>
  <div class="viewer-wrapper">
    <article
      ref="contentRef"
      class="prose prose-invert mx-auto rounded-xl p-6 md:p-12 transition-all duration-300 ease-in-out min-h-[80vh]"
      :class="containerClasses"
      :style="styles"
      v-html="content"
    ></article>

    <div class="mt-16 pt-8 border-t border-border flex justify-center text-text-muted text-sm font-display italic animate-fade-in-delayed">
      <p>End of transmission.</p>
    </div>
  </div>
</template>

<style scoped>
.prose { max-width: 100%; }

:deep(.prose p) { margin-bottom: 1.5em; font-family: inherit; font-weight: inherit; color: inherit; }
:deep(.prose div) { display: flex; justify-content: center; }
:deep(.prose strong), :deep(.prose b) { font-weight: 700; color: inherit; filter: contrast(1.2); }

.animate-fade-in-delayed {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 1.5s;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
</style>
