<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInteractionStore } from '../model/store'
import { useUserStore } from '@/entities/user'
import { Send, MessageSquare, User } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import gsap from 'gsap'

const props = defineProps<{
  workId: string
}>()

const store = useInteractionStore()
const userStore = useUserStore()
const newCommentText = ref('')

const comments = computed(() => store.getComments(props.workId))

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const submitComment = () => {
  if (!newCommentText.value.trim()) return

  store.addComment(props.workId, newCommentText.value)
  newCommentText.value = ''

  // Animation for the new item handled by TransitionGroup
}

const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { opacity: 0, x: -20, height: 0, marginBottom: 0 },
    { opacity: 1, x: 0, height: 'auto', marginBottom: 16, duration: 0.4, ease: 'back.out(1)', onComplete: done }
  )
}
</script>

<template>
  <!-- ИЗМЕНЕНИЕ: w-full вместо max-w-[800px] -->
  <div class="flex flex-col gap-8 mt-16 w-full">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-border/50 pb-4">
      <h3 class="text-2xl font-display font-bold italic text-text-primary">
        Transmissions
      </h3>
      <span class="px-2 py-0.5 rounded-full bg-background-tertiary text-xs font-bold text-text-muted">
        {{ comments.length }}
      </span>
    </div>

    <!-- Input Form -->
    <div class="flex gap-4 p-4 rounded-xl bg-background-tertiary/20 border border-border/50 w-full">
      <div class="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border bg-background-tertiary">
        <img :src="userStore.profile.avatarUrl" alt="You" class="w-full h-full object-cover">
      </div>
      <div class="flex-1 flex flex-col gap-3">
        <textarea
          v-model="newCommentText"
          placeholder="Leave a transmission log..."
          class="w-full bg-transparent border-b border-border text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none min-h-[40px] max-h-[120px] resize-y py-2 transition-colors font-sans"
          @keydown.ctrl.enter="submitComment"
        ></textarea>
        <div class="flex justify-end">
          <BaseButton
            @click="submitComment"
            :disabled="!newCommentText.trim()"
            variant="primary"
            class="!py-1.5 !px-4 !text-xs !rounded-lg"
          >
            <Send :size="14" /> Send
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="flex flex-col relative min-h-[100px] w-full">
      <TransitionGroup :css="false" @enter="onEnter">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-4 group w-full"
        >
          <!-- Avatar -->
          <div class="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border bg-background-tertiary mt-1">
            <img v-if="comment.avatarUrl" :src="comment.avatarUrl" :alt="comment.author" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center text-text-muted">
              <User :size="20" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col gap-1 pb-4 border-b border-border/30 group-last:border-0 min-w-0">
            <div class="flex items-baseline justify-between">
              <span class="font-bold text-sm text-text-primary">{{ comment.author }}</span>
              <span class="text-[10px] text-text-muted font-mono">{{ formatDate(comment.date) }}</span>
            </div>
            <p class="text-sm text-text-secondary leading-relaxed font-sans whitespace-pre-line break-words">
              {{ comment.text }}
            </p>

            <!-- Actions (Reply/Like for comments - Stub) -->
            <div class="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="text-[10px] uppercase font-bold text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors">
                Reply
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="comments.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center opacity-50 py-8 pointer-events-none">
        <MessageSquare :size="32" class="text-text-muted mb-2" />
        <p class="text-xs text-text-secondary uppercase tracking-widest">No signals received yet</p>
      </div>
    </div>
  </div>
</template>
