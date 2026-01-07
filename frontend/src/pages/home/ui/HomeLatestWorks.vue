<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { works } from '@/entities/work';
import WorkCard from '@/entities/work/ui/WorkCard.vue';
import { RouterLink } from 'vue-router';
import { useWorkFilterStore } from '@/features/filter-works';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const filterStore = useWorkFilterStore();
const containerRef = ref<HTMLElement | null>(null);

const latestWorks = computed(() => {
  return works
    .filter(w => w.type !== 'Archive')
    .sort((a, b) => new Date(b.stats.date).getTime() - new Date(a.stats.date).getTime())
    .slice(0, 3);
});

const handleTagClick = (tag: string) => {
  filterStore.searchByTag(tag);
  router.push('/works');
};

const triggers: ScrollTrigger[] = [];

onMounted(async () => {
  await nextTick();

  if (containerRef.value && containerRef.value.children.length > 0) {
    const items = containerRef.value.children;

    // 1. Явно скрываем элементы перед анимацией
    gsap.set(items, { y: 50, opacity: 0 });

    // 2. Используем batch для надежного запуска при попадании в viewport
    const batch = ScrollTrigger.batch(items, {
      start: 'top 90%', // Начинаем чуть раньше
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          overwrite: true
        });
      },
      once: true // Анимация проигрывается только один раз
    });

    // Сохраняем триггеры для очистки
    triggers.push(...batch);

    // Обновляем расчеты на случай сдвигов макета
    ScrollTrigger.refresh();
  }
});

onUnmounted(() => {
  triggers.forEach(t => t.kill());
});
</script>

<template>
  <section class="w-full max-w-[1200px] mx-auto px-6 py-20">
    <div class="flex items-center justify-between mb-10">
      <div class="flex flex-col gap-1">
        <h3 class="text-3xl md:text-4xl font-display font-bold italic text-text-primary">Latest Transmissions</h3>
        <p class="text-text-muted font-sans text-sm">Recent signals received from the deep field.</p>
      </div>
      <RouterLink to="/works" class="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>

    <!-- Убедитесь, что здесь нет v-if, который скрывает блок при загрузке -->
    <div ref="containerRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
      <WorkCard
        v-for="work in latestWorks"
        :key="work.id"
        :work="work"
        class="h-full"
        @clickTag="handleTagClick"
      />
    </div>

    <div class="mt-8 flex justify-center md:hidden">
      <RouterLink to="/works" class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
        View All <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
:deep(article) {
  flex-direction: column;
  height: 100%;
}
</style>
