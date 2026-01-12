<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/entities/user' // 1. Импорт стора
import gsap from 'gsap'
import { Infinity, Menu, X, ScanFace } from 'lucide-vue-next' // Заменили User на ScanFace для кибер-эстетики

const userStore = useUserStore() // 2. Инициализация стора
const isMenuOpen = ref(false)

// 3. Убрали 'Profile' из текстовых ссылок
const links = [
  { path: '/', label: 'Home' },
  { path: '/works', label: 'Works' },
  { path: '/library', label: 'Library' },
  // Profile удален отсюда
  { path: '/archive', label: 'Archive' },
  { path: '/contacts', label: 'Contacts' },
]

const onLinkEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const line = target.querySelector('.nav-line')
  if (line) {
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
    gsap.to(line, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      overwrite: true,
    })
  }
}

// Новая анимация для аватара
const onAvatarEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const img = target.querySelector('img')
  const border = target.querySelector('.avatar-border')

  // Эффект "напряжения" рамки
  if (border) {
    gsap.to(border, {
      borderColor: 'var(--color-accent)',
      boxShadow: '0 0 15px rgba(var(--color-accent), 0.4)',
      duration: 0.3
    })
  }
  // Легкий зум изображения
  if (img) {
    gsap.to(img, { scale: 1.1, duration: 0.5, ease: 'power2.out' })
  }
}

const onAvatarLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const img = target.querySelector('img')
  const border = target.querySelector('.avatar-border')

  if (border) {
    gsap.to(border, {
      borderColor: 'rgba(var(--color-border), 0.5)', // Возврат к полупрозрачному бордеру
      boxShadow: 'none',
      duration: 0.3
    })
  }
  if (img) {
    gsap.to(img, { scale: 1, duration: 0.3, ease: 'power2.in' })
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background-primary/95 backdrop-blur-sm transition-colors duration-300"
  >
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

      <!-- Right Side Actions Wrapper -->
      <div class="flex items-center gap-4 md:gap-8">
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

        <!-- Divider (Desktop only) -->
        <div class="hidden md:block w-px h-6 bg-border"></div>

        <!-- Profile Icon (Updated Aesthetic) -->
        <RouterLink
          to="/profile"
          class="relative group block shrink-0 outline-none"
          title="Operative Profile"
          @mouseenter="onAvatarEnter" @mouseleave="onAvatarLeave"
        >
          <!-- Контейнер аватара -->
          <div
            class="avatar-border w-9 h-9 rounded-full overflow-hidden border transition-all duration-300 bg-background-tertiary relative z-10"
            style="border-color: rgba(var(--color-border), 0.5)"
          >
            <img
              v-if="userStore.profile.avatarUrl"
              :src="userStore.profile.avatarUrl"
              alt="Profile"
              class="w-full h-full object-cover transition-transform will-change-transform grayscale group-hover:grayscale-0"
            />
            <!-- Fallback Icon (Techno Vibe) -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-text-muted group-hover:text-accent transition-colors"
            >
              <ScanFace :size="18" stroke-width="1.5" />
            </div>
          </div>

          <!-- Декоративное свечение (Status Indicator) -->
          <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-background-primary rounded-full flex items-center justify-center z-20">
             <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </RouterLink>

        <!-- Mobile Toggle -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 -mr-2 text-text-primary transition-transform active:scale-90"
        >
          <component :is="isMenuOpen ? X : Menu" :size="24" />
        </button>
      </div>
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
