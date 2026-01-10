<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useUserStore } from '@/entities/user' // Используем User Store
import { ACHIEVEMENTS_LIST } from '@/features/track-reading-habit'
import gsap from 'gsap'
import { Flame, Clock, Zap, Lock } from 'lucide-vue-next'

const userStore = useUserStore()

// Reactive counters for GSAP animation
const displayWords = ref(0)
const displayWpm = ref(0)
const displayStreak = ref(0)
const displaySeconds = ref(0)

const animateValue = (target: any, val: number) => {
  gsap.to(target, {
    value: val,
    duration: 1.5,
    ease: 'power2.out',
    roundProps: 'value'
  })
}

// Watchers для анимации при изменении данных
watch(() => userStore.profile.stats.totalWords, (val) => animateValue(displayWords, val))
watch(() => userStore.wpm, (val) => animateValue(displayWpm, val))
watch(() => userStore.calculatedStreak, (val) => animateValue(displayStreak, val))
watch(() => userStore.profile.stats.totalSeconds, (val) => displaySeconds.value = val) // Просто обновляем время

onMounted(() => {
  animateValue(displayWords, userStore.profile.stats.totalWords)
  animateValue(displayWpm, userStore.wpm)
  animateValue(displayStreak, userStore.calculatedStreak)
  displaySeconds.value = userStore.profile.stats.totalSeconds
})

const recentAchievements = computed(() => {
  return ACHIEVEMENTS_LIST.map(a => ({
    ...a,
    isUnlocked: userStore.profile.unlockedAchievements.includes(a.id)
  })).sort((a, b) => Number(b.isUnlocked) - Number(a.isUnlocked)).slice(0, 4)
})

const formattedTimeAnimated = computed(() => {
    // Вычисляем время на основе анимированного значения секунд (опционально, или брать из стора)
    // Для простоты берем из стора, так как время меняется линейно
    return userStore.formattedTotalTime
})
</script>

<template>
  <section class="w-full bg-background-secondary/30 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm overflow-hidden relative">
    <!-- Decorative BG -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

    <div class="relative z-10 flex flex-col gap-6">
      <!-- Header with User Info -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-full border border-border overflow-hidden bg-background-tertiary">
                <img :src="userStore.profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover">
             </div>
             <div>
                <h3 class="text-xl font-bold font-display italic text-text-primary leading-none">{{ userStore.profile.username }}</h3>
                <p class="text-xs text-text-muted font-sans font-bold uppercase tracking-wider mt-1">Level {{ userStore.profile.level }} Scout</p>
             </div>
        </div>
      </div>

      <!-- Bento Grid Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <!-- Total Time -->
        <div class="col-span-2 md:col-span-2 bg-background-primary border border-border rounded-xl p-4 flex flex-col justify-between group hover:border-accent/50 transition-colors">
          <div class="flex justify-between items-start">
            <span class="text-[10px] uppercase font-bold text-text-muted tracking-widest">Time in Field</span>
            <Clock :size="16" class="text-text-secondary group-hover:text-accent transition-colors" />
          </div>
          <div class="mt-4">
             <span class="text-3xl md:text-4xl font-black font-display text-text-primary">{{ formattedTimeAnimated }}</span>
          </div>
        </div>

        <!-- Streak -->
        <div class="bg-background-primary border border-border rounded-xl p-4 flex flex-col justify-between group hover:border-orange-500/50 transition-colors">
          <div class="flex justify-between items-start">
             <span class="text-[10px] uppercase font-bold text-text-muted tracking-widest">Streak</span>
             <Flame :size="16" class="text-text-secondary group-hover:text-orange-500 transition-colors" />
          </div>
          <div class="mt-2">
             <span class="text-2xl md:text-3xl font-bold font-sans text-text-primary">{{ displayStreak }}</span>
             <span class="text-xs text-text-muted ml-1">days</span>
          </div>
        </div>

        <!-- WPM -->
        <div class="bg-background-primary border border-border rounded-xl p-4 flex flex-col justify-between group hover:border-blue-500/50 transition-colors">
           <div class="flex justify-between items-start">
             <span class="text-[10px] uppercase font-bold text-text-muted tracking-widest">Velocity</span>
             <Zap :size="16" class="text-text-muted group-hover:text-blue-500 transition-colors" />
          </div>
          <div class="mt-2">
             <span class="text-2xl md:text-3xl font-bold font-sans text-text-primary">{{ displayWpm }}</span>
             <span class="text-xs text-text-muted ml-1">wpm</span>
          </div>
        </div>

      </div>

      <!-- Total Words (Full Width Bar) -->
      <div class="bg-background-tertiary/40 border border-border rounded-xl px-5 py-3 flex items-center justify-between">
          <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Data Processed</span>
          <div class="flex items-baseline gap-1">
             <span class="text-lg font-bold text-text-primary font-mono">{{ displayWords }}</span>
             <span class="text-[10px] text-text-muted uppercase">words</span>
          </div>
      </div>

      <!-- Achievements -->
      <div class="flex flex-col gap-3 mt-2">
        <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">Recent Achievements</h4>
            <span class="text-[10px] text-text-muted font-mono">{{ userStore.profile.unlockedAchievements.length }} / {{ ACHIEVEMENTS_LIST.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="ach in recentAchievements"
            :key="ach.id"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all"
            :class="ach.isUnlocked
              ? 'bg-accent/5 border-accent/20 opacity-100'
              : 'bg-background-tertiary/20 border-transparent opacity-50 grayscale'"
          >
             <div
               class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
               :class="ach.isUnlocked ? 'bg-accent text-background-primary' : 'bg-background-tertiary text-text-muted'"
             >
                <component :is="ach.isUnlocked ? ach.icon : Lock" :size="18" />
             </div>
             <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold truncate text-text-primary">{{ ach.title }}</span>
                <span class="text-[10px] text-text-muted truncate">{{ ach.isUnlocked ? 'Unlocked' : 'Locked' }}</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
