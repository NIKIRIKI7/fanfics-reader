<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isMenuOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background-primary/95 backdrop-blur-sm transition-colors duration-300">
    <div class="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 group cursor-pointer">
        <div class="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary transition-colors group-hover:bg-accent group-hover:text-background-primary">
          <span class="material-symbols-outlined text-[20px]">all_inclusive</span>
        </div>
        <h1 class="text-sm md:text-base font-bold tracking-tight uppercase text-text-primary font-display">
          Project: Grey Sky <span class="text-text-muted mx-1">/</span> Deep Field
        </h1>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink to="/" class="text-sm font-sans font-medium text-text-muted hover:text-text-primary transition-colors">Home</RouterLink>
        <RouterLink to="/works" class="text-sm font-sans font-medium text-text-muted hover:text-text-primary transition-colors">Works</RouterLink>
        <RouterLink to="/archive" class="text-sm font-sans font-medium text-text-muted hover:text-text-primary transition-colors">Archive</RouterLink>
        <RouterLink to="/contacts" class="text-sm font-sans font-medium text-text-muted hover:text-text-primary transition-colors">Contacts</RouterLink>
      </nav>

      <!-- Mobile Toggle -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-text-primary">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden border-t border-border bg-background-primary px-6 py-4 flex flex-col gap-4">
      <RouterLink to="/" class="text-sm font-sans font-medium text-text-primary" @click="isMenuOpen = false">Home</RouterLink>
      <RouterLink to="/works" class="text-sm font-sans font-medium text-text-primary" @click="isMenuOpen = false">Works</RouterLink>
      <RouterLink to="/archive" class="text-sm font-sans font-medium text-text-primary" @click="isMenuOpen = false">Archive</RouterLink>
      <RouterLink to="/contacts" class="text-sm font-sans font-medium text-text-primary" @click="isMenuOpen = false">Contacts</RouterLink>
    </div>
  </header>
</template>