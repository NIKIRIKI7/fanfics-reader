<script setup lang="ts">
import { ref } from 'vue'
import { type Component } from 'vue'
import { useLibraryStore } from '../model/store'
import type { Work } from '@/entities/work'
import type { CollectionIcon } from '@/entities/collection'
import { storeToRefs } from 'pinia'
import {
  X, Plus, Check, Folder, Heart, Clock, Star, Flame, Skull, Book
} from 'lucide-vue-next'
import gsap from 'gsap'

const props = defineProps<{
  work: Work
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const store = useLibraryStore()
const { collections } = storeToRefs(store)

const isCreating = ref(false)
const newCollectionTitle = ref('')
const newCollectionIcon = ref<CollectionIcon>('book')

const icons: { value: CollectionIcon; component: Component }[] = [
  { value: 'book', component: Book },
  { value: 'heart', component: Heart },
  { value: 'clock', component: Clock },
  { value: 'star', component: Star },
  { value: 'flame', component: Flame },
  { value: 'skull', component: Skull },
]

const getIconComponent = (iconName: string) => {
  const found = icons.find(i => i.value === iconName)
  return found ? found.component : Folder
}

const toggleCollection = (colId: string) => {
  store.toggleWorkInCollection(props.work, colId)
}

const createNewCollection = () => {
  if (!newCollectionTitle.value.trim()) return

  store.createCollection(newCollectionTitle.value, newCollectionIcon.value)
  const newCol = store.collections[store.collections.length - 1]
  if (newCol) {
    store.addWorkToCollection(props.work, newCol.id)
  }

  // Reset
  newCollectionTitle.value = ''
  isCreating.value = false
}

// GSAP
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
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal Container (Centered everywhere) -->
      <transition :css="false" @enter="onEnter" @leave="onLeave" appear>
        <div class="relative w-full max-w-md bg-background-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-border bg-background-secondary sticky top-0 z-10">
            <div class="flex flex-col">
              <h3 class="text-sm font-bold uppercase tracking-widest text-text-primary">Save to Collection</h3>
              <p class="text-xs text-text-muted font-sans truncate max-w-[200px]">{{ work.title }}</p>
            </div>
            <button @click="$emit('close')" class="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-background-tertiary">
              <X :size="20" />
            </button>
          </div>

          <!-- Collections List -->
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
            <div
              v-for="col in collections"
              :key="col.id"
              @click="toggleCollection(col.id)"
              class="group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none"
              :class="store.isSavedInCollection(work.id, col.id)
                ? 'bg-accent/10 border-accent'
                : 'bg-background-primary border-border hover:border-text-muted'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  :class="store.isSavedInCollection(work.id, col.id) ? 'bg-accent text-background-primary' : 'bg-background-tertiary text-text-secondary'"
                >
                  <component :is="getIconComponent(col.icon)" :size="16" />
                </div>
                <span class="font-sans font-bold text-sm text-text-primary">{{ col.title }}</span>
              </div>

              <div class="relative w-5 h-5 flex items-center justify-center">
                <transition
                  enter-active-class="transition duration-300 ease-back-out"
                  enter-from-class="scale-0 opacity-0"
                  enter-to-class="scale-100 opacity-100"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="scale-100 opacity-100"
                  leave-to-class="scale-0 opacity-0"
                >
                  <Check v-if="store.isSavedInCollection(work.id, col.id)" class="text-accent absolute" :size="20" />
                </transition>
              </div>
            </div>
          </div>

          <!-- Footer / Actions -->
          <div class="p-4 border-t border-border bg-background-tertiary/20 flex flex-col gap-4">
            <!-- Create New Mode -->
            <div v-if="isCreating" class="flex flex-col gap-3 animate-in slide-in-from-bottom-2 fade-in">
              <div class="flex items-center gap-2">
                <input
                  v-model="newCollectionTitle"
                  type="text"
                  placeholder="New Shelf Name..."
                  class="flex-1 bg-background-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent outline-none font-sans"
                  @keyup.enter="createNewCollection"
                  autoFocus
                />
                <button
                  @click="createNewCollection"
                  :disabled="!newCollectionTitle.trim()"
                  class="p-2 bg-accent text-background-primary rounded-lg disabled:opacity-50"
                >
                  <Check :size="20" />
                </button>
              </div>

              <!-- Icon Selector -->
              <div class="flex gap-2 justify-between overflow-x-auto pb-1 no-scrollbar">
                <button
                  v-for="icon in icons"
                  :key="icon.value"
                  @click="newCollectionIcon = icon.value"
                  class="p-2 rounded-lg border transition-all shrink-0"
                  :class="newCollectionIcon === icon.value ? 'bg-accent text-background-primary border-accent' : 'bg-background-primary border-border text-text-muted hover:text-text-primary'"
                >
                  <component :is="icon.component" :size="16" />
                </button>
              </div>
            </div>

            <!-- Standard Mode Buttons -->
            <div v-else class="flex gap-3">
              <button
                @click="isCreating = true"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-text-muted/50 text-text-muted hover:text-text-primary hover:border-text-primary hover:bg-background-tertiary transition-all text-sm font-bold uppercase tracking-wider"
              >
                <Plus :size="18" /> New Shelf
              </button>
              <button
                @click="$emit('close')"
                class="flex-1 py-3 rounded-xl bg-accent text-background-primary text-sm font-bold uppercase tracking-wider hover:opacity-90 shadow-lg shadow-accent/20"
              >
                Done
              </button>
            </div>
          </div>

        </div>
      </transition>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
