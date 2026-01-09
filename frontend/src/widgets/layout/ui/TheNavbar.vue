<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { Infinity, Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const links = [
  { path: '/', label: 'Home' },
  { path: '/works', label: 'Works' },
  { path: '/library', label: 'Library' }, // <--- Добавлено
  { path: '/archive', label: 'Archive' },
  { path: '/contacts', label: 'Contacts' },
]

// --- Underline Animation Logic ---
const onLinkEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const line = target.querySelector('.nav-line')

  if (line) {
    // overwrite: true принудительно останавливает любые текущие анимации (например, исчезновение),
    // предотвращая "залипание" или конфликт твинов.
    gsap.to(line, {
      scaleX: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
      overwrite: true,
    })
  }
}

const onLinkLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const line = target.querySelector('.nav-line')

  if (line) {
    // overwrite: true немедленно прерывает "пружинящий" эффект появления,
    // если пользователь быстро убрал курсор.
    gsap.to(line, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      overwrite: true,
    })
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background-primary/95 backdrop-blur-sm transition-colors duration-300"
  >
    <!-- ИСПОЛЬЗУЕМ ПЕРЕМЕННЫЕ -->
    <div
      class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] h-16 flex items-center justify-between"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 group cursor-pointer">
        <div
          class="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary transition-all duration-500 group-hover:bg-accent group-hover:text-background-primary group-hover:rotate-180"
        >
          <Infinity :size="20" />
        </div>
        <h1
          class="text-sm md:text-base font-bold tracking-tight uppercase text-text-primary font-display group-hover:tracking-wide transition-all duration-300"
        >
          Project: Grey Sky <span class="text-text-muted mx-1">/</span> Deep Field
        </h1>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="relative py-2 text-sm font-sans font-medium text-text-muted hover:text-text-primary transition-colors block"
          @mouseenter="onLinkEnter"
          @mouseleave="onLinkLeave"
        >
          {{ link.label }}
          <!-- Animated Underline -->
          <span
            class="nav-line absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full opacity-0 origin-center scale-x-0 will-change-transform"
          ></span>
        </RouterLink>
      </nav>

      <!-- Mobile Toggle -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden p-2 text-text-primary transition-transform active:scale-90"
      >
        <component :is="isMenuOpen ? X : Menu" :size="24" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      @enter="
        (el, done) =>
          gsap.fromTo(
            el,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.3, onComplete: done },
          )
      "
      @leave="(el, done) => gsap.to(el, { height: 0, opacity: 0, duration: 0.2, onComplete: done })"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden border-t border-border bg-background-primary px-6 py-4 flex flex-col gap-4 overflow-hidden"
      >
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="text-sm font-sans font-medium text-text-primary py-2 border-b border-border/50 last:border-0"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </transition>
  </header>
</template>
