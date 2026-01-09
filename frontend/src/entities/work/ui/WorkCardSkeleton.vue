<script setup lang="ts">
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue'
</script>

<template>
  <div
    class="flex flex-col rounded-xl border border-border bg-background-tertiary/10 overflow-hidden h-full"
  >
    <!-- Cover Image Skeleton -->
    <BaseSkeleton variant="rect" class="w-full h-64 shrink-0 !rounded-none" />

    <!-- Content Block -->
    <div class="flex-1 flex flex-col p-5">
      <!-- Meta Info Line -->
      <div class="flex items-center gap-3 mb-4 border-b border-border/30 pb-3">
        <BaseSkeleton width="80px" height="14px" />
        <BaseSkeleton width="60px" height="14px" />
        <BaseSkeleton width="70px" height="14px" />
      </div>

      <!-- Fandom -->
      <BaseSkeleton width="30%" height="14px" class="mb-2" />

      <!-- Title -->
      <BaseSkeleton height="32px" width="80%" class="mb-3" />
      <BaseSkeleton height="32px" width="50%" class="mb-4" />

      <!-- Summary -->
      <div class="flex flex-col gap-2 mb-6">
        <BaseSkeleton width="100%" height="16px" />
        <BaseSkeleton width="95%" height="16px" />
        <BaseSkeleton width="90%" height="16px" />
      </div>

      <!-- Tags -->
      <div class="mt-auto flex gap-2">
        <BaseSkeleton width="60px" height="24px" />
        <BaseSkeleton width="80px" height="24px" />
        <BaseSkeleton width="50px" height="24px" />
      </div>
    </div>
  </div>
</template>
