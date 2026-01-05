<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  targetElement: HTMLElement | null
}>();

const progress = ref(0);
let rafId: number | null = null;

const calculateProgress = () => {
  if (!props.targetElement) {
    progress.value = 0;
    return;
  }

  const element = props.targetElement;
  // Высота всего окна просмотра
  const windowHeight = window.innerHeight;
  // Текущая прокрутка сверху
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // Позиция элемента относительно начала страницы
  const elementTop = element.offsetTop;
  const elementHeight = element.offsetHeight;

  // Если элемент еще не начался (ниже экрана), прогресс 0
  if (scrollTop + windowHeight < elementTop) {
    progress.value = 0;
    return;
  }

  // Вычисляем позицию "дна" экрана относительно начала элемента
  // Это показывает, сколько пикселей контента пользователь уже "покрыл" взглядом
  const scrolledPastElementTop = (scrollTop + windowHeight) - elementTop;

  // Рассчитываем процент
  const percent = (scrolledPastElementTop / elementHeight) * 100;

  // Ограничиваем от 0 до 100
  progress.value = Math.min(100, Math.max(0, percent));
};

const onScroll = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    calculateProgress();
    rafId = null;
  });
};

watch(() => props.targetElement, () => {
  // Пересчитываем сразу, как только элемент стал доступен (например, при загрузке)
  calculateProgress();
}, { immediate: true });

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Дополнительный вызов для начальной инициализации
  calculateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none">
    <div
      class="h-full bg-accent transition-transform duration-100 ease-linear shadow-[0_0_10px_rgba(var(--color-accent),0.5)] origin-left"
      :style="{ transform: `scaleX(${progress / 100})` }"
    ></div>
  </div>
</template>
