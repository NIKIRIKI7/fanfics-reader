<script setup lang="ts">
import { onMounted } from 'vue'
import { Bot, Film, Megaphone } from 'lucide-vue-next'

onMounted(() => console.log('[Page] Contacts mounted'))
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-20 min-h-screen">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2 border-l-2 border-border pl-6">
        <p class="text-accent text-xs font-bold tracking-[0.2em] uppercase font-sans">
          Status: Online
        </p>
        <h1
          class="text-text-primary text-4xl md:text-5xl font-medium italic leading-tight font-display"
        >
          Transmission Channels
        </h1>
      </div>
      <p
        class="text-text-secondary text-lg font-normal leading-relaxed max-w-2xl pl-6 font-display"
      >
        Select a frequency below to transmit data, observe visual logs, or receive status updates
        from the Deep Field.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <!-- Card 1 -->
      <a
        href="#"
        class="group relative flex flex-col gap-4 rounded-xl border border-border bg-background-tertiary/30 p-6 hover:border-accent hover:bg-background-tertiary transition-all duration-300"
      >
        <div
          class="size-12 rounded-full bg-background-primary border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent text-text-primary transition-colors"
        >
          <Bot :size="24" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-text-primary font-display mb-1">The Bot</h2>
          <p class="text-sm text-text-secondary font-sans">Anonymous Transmissions.</p>
        </div>
      </a>

      <!-- Card 2 -->
      <a
        href="#"
        class="group relative flex flex-col gap-4 rounded-xl border border-border bg-background-tertiary/30 p-6 hover:border-accent hover:bg-background-tertiary transition-all duration-300"
      >
        <div
          class="size-12 rounded-full bg-background-primary border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent text-text-primary transition-colors"
        >
          <Film :size="24" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-text-primary font-display mb-1">Visual Logs</h2>
          <p class="text-sm text-text-secondary font-sans">TikTok Visualizers.</p>
        </div>
      </a>

      <!-- Card 3 -->
      <a
        href="#"
        class="group relative flex flex-col gap-4 rounded-xl border border-border bg-background-tertiary/30 p-6 hover:border-accent hover:bg-background-tertiary transition-all duration-300"
      >
        <div
          class="size-12 rounded-full bg-background-primary border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent text-text-primary transition-colors"
        >
          <Megaphone :size="24" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-text-primary font-display mb-1">High Command</h2>
          <p class="text-sm text-text-secondary font-sans">Telegram Channel.</p>
        </div>
      </a>
    </div>
  </div>
</template>
