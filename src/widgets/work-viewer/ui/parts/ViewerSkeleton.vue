<script setup lang="ts">
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue';
</script>

<template>
  <div class="w-full max-w-[800px] mx-auto animate-in fade-in duration-500">
    <!-- Header Skeleton -->
    <header class="mb-12 border-b border-border pb-8 flex flex-col items-center">
      <!-- Badges -->
      <div class="flex gap-2 mb-6">
        <BaseSkeleton width="60px" height="24px" />
        <BaseSkeleton width="40px" height="24px" />
      </div>
      
      <!-- Title -->
      <BaseSkeleton height="48px" width="80%" class="mb-4" />
      <BaseSkeleton height="48px" width="60%" class="mb-8" />
      
      <!-- Stats -->
      <BaseSkeleton width="250px" height="20px" class="mb-8" />
      
      <!-- Tags -->
      <div class="flex gap-2 justify-center w-full">
        <BaseSkeleton width="70px" height="24px" />
        <BaseSkeleton width="90px" height="24px" />
        <BaseSkeleton width="60px" height="24px" />
      </div>
    </header>

    <!-- Content Skeleton (Paragraphs) -->
    <div class="space-y-8">
      <!-- Paragraph 1 -->
      <div class="space-y-3">
        <BaseSkeleton width="100%" height="16px" />
        <BaseSkeleton width="98%" height="16px" />
        <BaseSkeleton width="95%" height="16px" />
        <BaseSkeleton width="40%" height="16px" />
      </div>

      <!-- Paragraph 2 -->
      <div class="space-y-3">
        <BaseSkeleton width="100%" height="16px" />
        <BaseSkeleton width="92%" height="16px" />
        <BaseSkeleton width="96%" height="16px" />
        <BaseSkeleton width="85%" height="16px" />
      </div>

      <!-- Paragraph 3 -->
      <div class="space-y-3">
        <BaseSkeleton width="100%" height="16px" />
        <BaseSkeleton width="99%" height="16px" />
        <BaseSkeleton width="30%" height="16px" />
      </div>
    </div>
  </div>
</template>