<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useLibraryStore,
  BookmarkButton,
  ManageCollectionModal,
  DeleteCollectionModal,
  CollectionTabs,
  CollectionHeader,
} from '@/features/manage-library'
import { WorkCard } from '@/entities/work'
import type { CollectionIcon } from '@/entities/collection'
import { Folder } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'

// --- Setup ---
const store = useLibraryStore()
const { collections } = storeToRefs(store)
const router = useRouter()

// --- State ---
const activeCollectionId = ref<string>('default')

// Modals State
const isManageModalOpen = ref(false)
const manageMode = ref<'create' | 'edit'>('create')
const modalTitleInput = ref('')
const modalIconInput = ref<CollectionIcon>('book')

const isDeleteModalOpen = ref(false)

// --- Computed ---
const activeCollection = computed(() =>
  collections.value.find((c) => c.id === activeCollectionId.value),
)

const displayWorks = computed(() => {
  if (!activeCollectionId.value) return []
  return store.getWorksInCollection(activeCollectionId.value)
})

// --- Actions ---

const handleTagClick = (tag: string) => {
  router.push({ name: 'works', query: { tag } })
}

const handleCollectionSelect = (id: string) => {
  activeCollectionId.value = id
}

// 1. Открытие создания
const openCreateModal = () => {
  manageMode.value = 'create'
  modalTitleInput.value = ''
  modalIconInput.value = 'book'
  isManageModalOpen.value = true
}

// 2. Открытие редактирования
const openEditModal = () => {
  if (!activeCollection.value) return
  manageMode.value = 'edit'
  modalTitleInput.value = activeCollection.value.title
  modalIconInput.value = activeCollection.value.icon
  isManageModalOpen.value = true
}

// 3. Открытие удаления
const openDeleteModal = () => {
  if (!activeCollection.value || activeCollection.value.isSystem) return
  isDeleteModalOpen.value = true
}

// 4. Логика сабмита создания/редактирования
const handleManageSubmit = (payload: { title: string; icon: CollectionIcon }) => {
  if (manageMode.value === 'create') {
    store.createCollection(payload.title, payload.icon)
    // Переключаемся на новую коллекцию
    const newCol = collections.value[collections.value.length - 1]
    if (newCol) activeCollectionId.value = newCol.id
  } else {
    store.updateCollection(activeCollectionId.value, payload)
  }
  isManageModalOpen.value = false
}

// 5. Логика удаления
const handleDeleteConfirm = () => {
  store.deleteCollection(activeCollectionId.value)
  activeCollectionId.value = 'default'
  isDeleteModalOpen.value = false
}

// Animation
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, onComplete: done },
  )
}
</script>

<template>
  <div
    class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] py-8 md:py-12 min-h-screen relative"
  >
    <!-- Page Header -->
    <div class="mb-6 md:mb-10 border-b border-border pb-6 flex flex-col gap-2">
      <h2
        class="text-3xl md:text-5xl font-bold tracking-tight text-text-primary font-display italic"
      >
        Data Cache
      </h2>
      <p class="text-sm md:text-lg text-text-secondary font-light font-display">
        Personalized shelves and saved transmissions.
      </p>
    </div>

    <!-- Collection Tabs -->
    <!-- !!! ИСПРАВЛЕНИЕ: Используем именованную функцию вместо стрелочной !!! -->
    <CollectionTabs
      :collections="collections"
      :active-id="activeCollectionId"
      @select="handleCollectionSelect"
      @create="openCreateModal"
    />

    <!-- Active Collection Header -->
    <div v-if="activeCollection">
      <CollectionHeader
        :collection="activeCollection"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Content Grid -->
    <TransitionGroup
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      :css="false"
      @enter="onEnter"
    >
      <WorkCard
        v-for="work in displayWorks"
        :key="work.id"
        :work="work"
        class="h-full"
        @clickTag="handleTagClick"
      >
        <template #action>
          <BookmarkButton :work="work" size="sm" />
        </template>
      </WorkCard>
    </TransitionGroup>

    <!-- Empty State -->
    <div
      v-if="displayWorks.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-background-tertiary/5 mt-4"
    >
      <div
        class="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mb-4 text-text-muted"
      >
        <Folder :size="32" />
      </div>
      <h3 class="text-xl font-bold text-text-primary mb-2 font-display">Shelf Empty</h3>
      <p class="text-text-secondary max-w-sm mb-6 font-light">
        There are no narratives in this collection yet.
      </p>
      <router-link to="/works">
        <button
          class="px-6 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-background-primary rounded-lg font-bold text-xs tracking-widest uppercase transition-all"
        >
          Find Works
        </button>
      </router-link>
    </div>

    <!-- MODALS -->

    <!-- Create / Edit -->
    <ManageCollectionModal
      :is-open="isManageModalOpen"
      :mode="manageMode"
      :initial-title="modalTitleInput"
      :initial-icon="modalIconInput"
      @close="isManageModalOpen = false"
      @submit="handleManageSubmit"
    />

    <!-- Delete Confirmation -->
    <DeleteCollectionModal
      :is-open="isDeleteModalOpen"
      :title="activeCollection?.title || ''"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
