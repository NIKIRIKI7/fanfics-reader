<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/entities/user'
import { Camera, Loader2 } from 'lucide-vue-next'
import gsap from 'gsap'

const userStore = useUserStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Простая валидация (только картинки, макс 5МБ)
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large (max 5MB)')
      return
    }

    isUploading.value = true
    
    // Имитация асинхронной загрузки и чтение файла
    const reader = new FileReader()
    reader.onload = (e) => {
      // Имитируем задержку сети для UX
      setTimeout(() => {
        if (e.target?.result) {
          userStore.setAvatar(e.target.result as string)
        }
        isUploading.value = false
      }, 800)
    }
    reader.readAsDataURL(file)
  }
}

// GSAP анимации для ховера
const onEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const overlay = target.querySelector('.overlay')
  const icon = target.querySelector('.icon-anim')
  
  if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 })
  if (icon) gsap.to(icon, { scale: 1.1, rotate: 15, duration: 0.4, ease: 'back.out(1.7)' })
}

const onLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const overlay = target.querySelector('.overlay')
  const icon = target.querySelector('.icon-anim')
  
  if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
  if (icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3 })
}
</script>

<template>
  <div 
    class="relative group cursor-pointer w-32 h-32 md:w-40 md:h-40 rounded-full select-none"
    @click="triggerFileInput" @mouseenter="onEnter" @mouseleave="onLeave"
  >
    <!-- Hidden Input -->
    <input 
      ref="fileInput"
      type="file" 
      accept="image/*" 
      class="hidden" 
      @change="handleFileChange"
    />

    <!-- Main Image Container -->
    <div class="w-full h-full rounded-full overflow-hidden border-2 border-border shadow-2xl transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(var(--color-accent),0.3)] bg-background-tertiary relative z-10">
      <img 
        :src="userStore.profile.avatarUrl" 
        alt="Operative Avatar" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        :class="{ 'opacity-50 blur-sm': isUploading }"
      />
      
      <!-- Uploading State -->
      <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center text-accent">
        <Loader2 :size="32" class="animate-spin" />
      </div>
    </div>

    <!-- Hover Overlay -->
    <div class="overlay opacity-0 absolute inset-0 rounded-full bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-white pointer-events-none transition-opacity">
      <Camera :size="28" class="icon-anim mb-1" />
      <span class="text-[10px] uppercase font-bold tracking-widest">Edit</span>
    </div>

    <!-- Decorative Status Indicator (Online) -->
    <div class="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-30 w-5 h-5 bg-background-primary rounded-full flex items-center justify-center border border-background-primary">
      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
    </div>
  </div>
</template>