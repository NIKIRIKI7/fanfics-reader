<script setup lang="ts">
import { ref, watch } from 'vue'
// 1. Импортируем тип Component
import type { Component } from 'vue'
import type { CollectionIcon } from '@/entities/collection'
import {
  X, Book, Heart, Clock, Star, Flame, Skull, Folder, HardDrive
} from 'lucide-vue-next'
import gsap from 'gsap'

const props = defineProps<{
  isOpen: boolean
  mode: 'create' | 'edit'
  initialTitle?: string
  initialIcon?: CollectionIcon
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { title: string; icon: CollectionIcon }): void
}>()

const title = ref('')
const selectedIcon = ref<CollectionIcon>('book')

// Icons List
const iconsList: CollectionIcon[] = ['book', 'heart', 'clock', 'star', 'flame', 'skull']

const getIconComponent = (iconName: string) => {
  const map: Record<string, Component> = {
    book: Book, heart: Heart, clock: Clock,
    star: Star, flame: Flame, skull: Skull, default: HardDrive
  }
  return map[iconName] || Folder
}

// Watchers to sync props
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      title.value = props.initialTitle || ''
      selectedIcon.value = props.initialIcon || 'book'
    }
  }
)

const handleSubmit = () => {
  if (!title.value.trim()) return
  emit('submit', { title: title.value, icon: selectedIcon.value })
}

// Animations
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)', onComplete: done })
}
const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <transition :css="false" @enter="onEnter" @leave="onLeave" appear>
        <div class="relative w-full max-w-sm bg-background-secondary border border-border rounded-2xl shadow-2xl p-6 overflow-hidden">

          <div class="flex items-center justify-between mb-6">
            <h4 class="text-lg font-display font-bold text-text-primary">
              {{ mode === 'create' ? 'New Shelf' : 'Edit Shelf' }}
            </h4>
            <button @click="$emit('close')" class="text-text-muted hover:text-text-primary">
              <X :size="20"/>
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Title Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Title</label>
              <input
                v-model="title"
                type="text"
                class="w-full bg-background-primary border border-border rounded-lg px-3 py-2 text-text-primary focus:border-accent outline-none font-sans"
                placeholder="e.g. Angst, To Read..."
                @keyup.enter="handleSubmit"
                autoFocus
              />
            </div>

            <!-- Icon Picker -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Icon</label>
              <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button
                  v-for="icon in iconsList"
                  :key="icon"
                  @click="selectedIcon = icon"
                  class="p-2.5 rounded-lg border transition-all shrink-0"
                  :class="selectedIcon === icon
                    ? 'bg-accent text-background-primary border-accent'
                    : 'bg-background-primary border-border text-text-muted hover:text-text-primary'"
                >
                  <component :is="getIconComponent(icon)" :size="20" />
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6">
            <button
              @click="$emit('close')"
              class="flex-1 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-background-tertiary text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="!title.trim()"
              class="flex-1 py-2.5 rounded-lg bg-accent text-background-primary hover:opacity-90 disabled:opacity-50 text-xs font-bold uppercase tracking-wider transition-opacity shadow-lg shadow-accent/20"
            >
              {{ mode === 'create' ? 'Create' : 'Save' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
</style>
