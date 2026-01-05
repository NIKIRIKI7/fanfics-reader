<script setup lang="ts">
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue';
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 p-6 rounded-xl border border-border bg-background-tertiary/10">
    <!-- Cover Image Skeleton -->
    <BaseSkeleton
      variant="rect"
      class="w-full lg:w-48 h-32 lg:h-auto shrink-0 !rounded-lg"
    />

    <!-- Content Block -->
    <div class="flex-1 flex flex-col justify-between gap-4">
      <div>
        <!-- Meta Info (Date, Words, Status) -->
        <div class="flex items-center gap-3 mb-3">
          <BaseSkeleton width="80px" />
          <BaseSkeleton width="6px" height="6px" variant="circle" class="!h-1.5 !w-1.5" />
          <BaseSkeleton width="60px" />
          <BaseSkeleton width="6px" height="6px" variant="circle" class="!h-1.5 !w-1.5" />
          <BaseSkeleton width="70px" />
        </div>

        <!-- Title -->
        <BaseSkeleton height="32px" width="70%" class="mb-3" />

        <!-- Rating & Warnings -->
        <div class="flex gap-3 mb-4">
          <BaseSkeleton width="40px" height="24px" />
          <BaseSkeleton width="120px" height="24px" />
        </div>

        <!-- Summary (3 lines) -->
        <div class="flex flex-col gap-2 mb-4">
          <BaseSkeleton width="100%" />
          <BaseSkeleton width="95%" />
          <BaseSkeleton width="60%" />
        </div>
      </div>

      <!-- Tags -->
      <div class="flex gap-2">
        <BaseSkeleton width="60px" height="24px" />
        <BaseSkeleton width="80px" height="24px" />
        <BaseSkeleton width="50px" height="24px" />
      </div>
    </div>
  </div>
</template>