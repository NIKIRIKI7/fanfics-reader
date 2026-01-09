<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/shared/ui/BaseButton.vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (containerRef.value) {
    // Анимация появления контента: элементы всплывают снизу вверх последовательно
    gsap.from(containerRef.value.children, {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2, // задержка между элементами
      ease: 'power3.out',
    })
  }
})
</script>

<template>
  <div class="relative flex flex-col items-center justify-center min-h-[85vh] px-6">
    <!-- Background Effects -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-40 bg-noise mix-blend-overlay"></div>
    <div
      class="fixed top-20 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0"
    ></div>

    <!-- Используем ref для контейнера анимации -->
    <div
      ref="containerRef"
      class="relative z-10 flex flex-col items-center gap-8 max-w-2xl text-center"
    >
      <!-- Avatar -->
      <div
        class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-border shadow-2xl transition-all duration-500 hover:scale-105 grayscale hover:grayscale-0"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDHJDQQ98cpQcyk4NTn7Jt7EZqVnKlP-ySbKKdEkcO6V76TzXt3MMi5VOffUhsUK3E_wdz0ijPlrgLImfsrZEULI03Nd3m0mnHVTYf5p4WVEP9QS7FmZxOR_79w6N49ul46sfDMvLJag99BV99vKweHxtHJrDvts52Mk3YfPky3Nt2bzZ8tckZc6N9FS9kjfiWu4gISWCa9YXn-zaaUouoC1ZTbZK6Sz2QOLTZhxjG5V7pVZyz4IonErgQY6kR0A1CYGJBQWgu618"
          alt="Author"
          class="w-full h-full object-cover"
        />
      </div>
      <!-- Header -->
      <div>
        <h2
          class="text-4xl md:text-6xl font-display italic font-light tracking-tight text-text-primary mb-2"
        >
          Author Pseudonym
        </h2>
        <p class="text-text-muted text-lg font-light font-display italic">est. 2023</p>
      </div>
      <!-- Quote -->
      <p
        class="text-text-secondary text-lg md:text-xl font-normal leading-relaxed font-display border-l-2 border-border pl-4 italic"
      >
        "Between the silent rye and the scattering stars, we find the stories that were never told."
      </p>
      <!-- CTA -->
      <div class="flex gap-4 mt-4">
        <RouterLink to="/works">
          <BaseButton variant="primary">Read Works</BaseButton>
        </RouterLink>
        <RouterLink to="/contacts">
          <BaseButton variant="outline">Contact</BaseButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
