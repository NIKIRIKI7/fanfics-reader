<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Импортируем локальный компонент вместо виджета
import HomeLatestWorks from './HomeLatestWorks.vue';
import HomeHero from './parts/HomeHero.vue';
import { RecentlyViewed } from '@/features/view-history';
// FIX: Импортируем зависимости здесь (Page Layer), чтобы передать их вниз
import { useWorkFilterStore } from '@/features/filter-works';
import { BookmarkButton } from '@/features/manage-library';

const router = useRouter();
const filterStore = useWorkFilterStore();

// Логика перехода по тегу теперь здесь
const handleTagClick = (tag: string) => {
  filterStore.searchByTag(tag);
  router.push('/works');
};

onMounted(() => {
  console.log('[Page] Home mounted');
});
</script>

<template>
  <div class="flex flex-col">
    <HomeHero />

    <div class="relative z-10 bg-background-primary border-t border-border">
      <HomeLatestWorks />

      <!-- Блок недавно просмотренных -->
      <div class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] pb-20">
        <div class="h-px bg-border w-full mb-12"></div>

        <!-- Передаем обработчик клика и слот для кнопки -->
        <RecentlyViewed @clickTag="handleTagClick">
            <template #action="{ work }">
                <BookmarkButton :work="work" size="sm" />
            </template>
        </RecentlyViewed>
      </div>
    </div>
  </div>
</template>