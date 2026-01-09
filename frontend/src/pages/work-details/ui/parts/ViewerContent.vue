<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useReadingSettingsStore, type Theme } from '@/features/customize-reading'
import { SoundtrackWidget, useSceneSoundtrackStore } from '@/features/scene-soundtrack'
// FIX: Импорт через Public API
import type { SceneSoundtrack } from '@/entities/work'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  content: string
  soundtracks?: SceneSoundtrack[]
}>()

const store = useReadingSettingsStore()
const audioStore = useSceneSoundtrackStore()
const {
  fontSize,
  fontFamily,
  pageWidth,
  lineHeight,
  fontWeight,
  letterSpacing,
  theme,
  isFocusMode,
} = storeToRefs(store)

const contentRef = ref<HTMLElement | null>(null)
let animationContext: gsap.Context | null = null

defineExpose({
  contentElement: contentRef,
})

const themeStyles: Record<Theme, { bg: string; text: string; shadow: string }> = {
  light: { bg: '#ffffff', text: '#1a1a1a', shadow: '0 4px 20px -2px rgba(0,0,0,0.1)' },
  sepia: { bg: '#f4ecd8', text: '#5b4636', shadow: '0 4px 20px -2px rgba(91, 70, 54, 0.1)' },
  dark: { bg: '#27272a', text: '#e4e4e7', shadow: '0 4px 20px -2px rgba(0,0,0,0.3)' },
  black: { bg: '#000000', text: '#a3a3a3', shadow: 'none' },
}

const containerClasses = computed(() => {
  const widthClass = {
    narrow: '!max-w-[600px]',
    standard: '!max-w-[800px]',
    wide: '!max-w-[1000px]',
  }[pageWidth.value]

  const fontClass = fontFamily.value === 'serif' ? 'font-display' : 'font-sans'
  return [widthClass, fontClass]
})

const styles = computed(() => {
  const currentTheme = themeStyles[theme.value]
  return {
    fontSize: `${fontSize.value}px`,
    lineHeight: `${lineHeight.value}`,
    fontWeight: fontWeight.value,
    letterSpacing: `${letterSpacing.value}px`,
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    boxShadow: currentTheme.shadow,
  }
})

interface ContentSegment {
  type: 'html' | 'widget'
  id?: string
  content?: string
}

const parsedContent = computed<ContentSegment[]>(() => {
  if (!props.content) return []

  // ИСПРАВЛЕНИЕ 1: Убрано экранирование закрывающих скобок ]]
  // Было: /\[\[MUSIC:(\w+)\]\]/g
  const parts = props.content.split(/\[\[MUSIC:(\w+)]]/g)

  const segments: ContentSegment[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] // ИСПРАВЛЕНИЕ 2: Сохраняем часть в переменную

    // Четные элементы - это всегда текст (даже если пустой)
    // Нечетные - это ID, захваченные regex-ом
    if (i % 2 === 0) {
      // ИСПРАВЛЕНИЕ 2: Проверяем существование part перед вызовом trim()
      if (part && part.trim()) {
        segments.push({ type: 'html', content: part })
      }
    } else {
      // Для ID тоже добавляем проверку на всякий случай
      if (part) {
        segments.push({ type: 'widget', id: part })
      }
    }
  }

  return segments
})

const getPlaylistById = (id: string) => {
  return props.soundtracks?.find((s) => s.id === id)
}

const animateContent = async () => {
  if (animationContext) {
    animationContext.revert()
  }

  if (!contentRef.value) return

  await nextTick()

  setTimeout(() => {
    const el = contentRef.value
    if (!el) return

    animationContext = gsap.context(() => {
      // Анимируем прямых детей (div-обертки сегментов)
      const targets = el.children
      if (!targets || targets.length === 0) return

      gsap.set(targets, { opacity: 0, y: 30 })

      ScrollTrigger.batch(targets, {
        start: 'top 95%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            overwrite: true,
          })
        },
        once: true,
      })

      ScrollTrigger.refresh()
    }, el)
  }, 100)
}

onMounted(() => {
  animateContent()
})

watch(
  () => props.content,
  () => {
    animateContent()
  },
)

watch([fontSize, lineHeight, pageWidth, fontFamily], async () => {
  await nextTick()
  ScrollTrigger.refresh()
})

watch(isFocusMode, async () => {
  await nextTick()
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 350)
})

onBeforeUnmount(() => {
  if (animationContext) animationContext.revert()
  audioStore.stop()
})
</script>

<template>
  <div class="viewer-wrapper">
    <article
      ref="contentRef"
      class="prose prose-invert mx-auto rounded-xl p-6 md:p-12 transition-all duration-300 ease-in-out min-h-[80vh]"
      :class="containerClasses"
      :style="styles"
    >
      <template v-for="(segment, index) in parsedContent" :key="index">
        <div v-if="segment.type === 'html'" v-html="segment.content" class="html-segment"></div>

        <div
          v-else-if="segment.type === 'widget' && getPlaylistById(segment.id!)"
          class="widget-segment not-prose"
        >
          <SoundtrackWidget :playlist="getPlaylistById(segment.id!)!" />
        </div>
      </template>
    </article>

    <div
      class="mt-16 pt-8 border-t border-border flex justify-center text-text-muted text-sm font-display italic animate-fade-in-delayed"
    >
      <p>End of transmission.</p>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: 100%;
}
:deep(.html-segment p) {
  margin-bottom: 1.5em;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
}
:deep(.html-segment div) {
  display: flex;
  justify-content: center;
}
:deep(.html-segment strong),
:deep(.html-segment b) {
  font-weight: 700;
  color: inherit;
  filter: contrast(1.2);
}

.animate-fade-in-delayed {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 1.5s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
