<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Work } from '@/entities/work';
// Локальные импорты частей
import ViewerHeader from './parts/ViewerHeader.vue';
import ViewerControls from './parts/ViewerControls.vue';
import ViewerContent from './parts/ViewerContent.vue';
import ReadingProgress from './parts/ReadingProgress.vue';

// ВАЖНО: Вот этот импорт связывает фичу со страницей
import { ReaderSettings } from '@/features/customize-reading';

const props = defineProps<{ work: Work }>();

const currentChapter = ref(1);
const viewerContentRef = ref<InstanceType<typeof ViewerContent> | null>(null);
const contentElement = ref<HTMLElement | null>(null);

onMounted(() => {
  if (viewerContentRef.value) {
    contentElement.value = viewerContentRef.value.contentElement;
  }
});

const nextChapter = () => {
  if (currentChapter.value < props.work.stats.chapters) {
    currentChapter.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="animate-in fade-in duration-500 relative">
    <ReadingProgress :target-element="contentElement" />
    <ViewerHeader :work="work" />

    <div class="flex gap-4 items-start justify-between mb-8 relative z-20">
      <div class="flex-1 max-w-2xl mx-auto w-full">
        <ViewerControls
          :current-chapter="currentChapter"
          :total-chapters="work.stats.chapters"
          @next="nextChapter"
          @prev="prevChapter"
          class="!mb-0"
        />
      </div>

      <div class="pt-2 hidden md:block">
        <ReaderSettings />
      </div>
    </div>

    <div class="md:hidden fixed bottom-6 right-6 z-40">
      <ReaderSettings placement="top" />
    </div>

    <ViewerContent
      ref="viewerContentRef"
      :content="work.content || '<p>Data corrupted. No content available.</p>'"
    />
  </div>
</template>
