<script setup lang="ts">
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import type { Work } from '@/entities/work';

const props = defineProps<{
  work: Work;
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const cardRef = ref<HTMLElement | null>(null);
const isGenerating = ref(false);
const copyStatus = ref<'idle' | 'copied'>('idle');

const copyLink = async () => {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    copyStatus.value = 'copied';
    setTimeout(() => copyStatus.value = 'idle', 2000);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

const downloadImage = async () => {
  if (!cardRef.value) return;
  isGenerating.value = true;

  try {
    await document.fonts.ready;

    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: '#050505',
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement('a');
    link.download = `grey-sky-${props.work.slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Failed to generate image', err);
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

        <div class="relative bg-background-primary border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">

          <div class="flex items-center justify-between p-4 border-b border-border">
            <span class="text-sm font-bold uppercase tracking-widest text-text-secondary">Share Transmission</span>
            <button @click="$emit('close')" class="text-text-muted hover:text-text-primary">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 bg-background-secondary flex justify-center overflow-hidden">
            <div
              ref="cardRef"
              class="bg-background-primary border border-border p-8 rounded-lg w-full max-w-[360px] flex flex-col gap-6 relative"
              style="
                background-color: #050505;
                background-image: radial-gradient(circle at top right, rgba(255, 255, 255, 0.15), transparent 40%);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                color: #e5e5e5;
              "
            >
              <!-- Header Info -->
              <div class="flex justify-between items-start relative z-10">
                <div class="flex flex-col">
                  <span class="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Project: Grey Sky</span>
                  <span class="text-text-secondary text-xs font-sans">{{ work.author }}</span>
                </div>

                <div
                  class="px-2 py-1 rounded border border-border text-[10px] font-bold text-text-muted uppercase flex items-center justify-center leading-none"
                  style="border-color: #262626; color: #737373; min-width: 32px;"
                >
                  {{ work.rating }}
                </div>
              </div>

              <!-- Title -->
              <div class="flex flex-col gap-2 relative z-10">
                <h3 class="text-3xl font-display font-black italic text-text-primary leading-tight" style="color: #ffffff;">
                  {{ work.title }}
                </h3>
                <!-- УДАЛЕНА БЕЛАЯ ПОЛОСКА -->
              </div>

              <!-- Summary -->
              <p class="text-text-secondary text-sm font-display italic leading-relaxed relative z-10" style="color: #a3a3a3;">
                "{{ work.summary }}"
              </p>

              <!-- Footer -->
              <div class="pt-4 border-t border-border flex justify-between items-center text-[10px] text-text-muted font-sans uppercase tracking-wider relative z-10" style="border-color: #262626; color: #525252;">
                <span>{{ work.stats.status }}</span>
                <span>{{ work.type }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-background-primary flex flex-col gap-3">
            <button
              @click="copyLink"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border hover:bg-background-tertiary transition-colors text-sm font-bold text-text-primary"
            >
              <span class="material-symbols-outlined text-[18px]">
                {{ copyStatus === 'copied' ? 'check' : 'link' }}
              </span>
              {{ copyStatus === 'copied' ? 'Copied to Clipboard' : 'Copy Link' }}
            </button>

            <button
              @click="downloadImage"
              :disabled="isGenerating"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-background-primary hover:opacity-90 transition-opacity text-sm font-bold"
            >
              <span v-if="isGenerating" class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[18px]">image</span>
              {{ isGenerating ? 'Generating...' : 'Save as Image' }}
            </button>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>
