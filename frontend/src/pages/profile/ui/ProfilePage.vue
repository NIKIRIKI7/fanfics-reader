<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { UserStatsDashboard } from '@/widgets/user-stats-dashboard'
import { AvatarUploader } from '@/features/manage-profile'
import { useUserStore } from '@/entities/user'
import { Shield, Heart, Copy, Check, Coffee } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import gsap from 'gsap'
import { HapticPatterns, vibrate } from '@/shared/lib/haptics'

const userStore = useUserStore()

// --- Логика донатов ---
const copiedIndex = ref<number | null>(null)

const donationMethods = [
  { label: 'USDT (TRC20)', value: 'T9yD14Nj9j7xAB4dbGeiX9h8veH391' },
  { label: 'BTC', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { label: 'ETH', value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
]

const copyToClipboard = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index
    vibrate(HapticPatterns.success)
    setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
    vibrate(HapticPatterns.error)
  }
}

onMounted(() => {
  gsap.from('.profile-anim', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] py-8 md:py-12 min-h-screen">

    <!-- Header Section -->
    <div class="flex flex-col items-center md:flex-row md:items-end md:justify-between mb-10 pb-8 border-b border-border gap-6 md:gap-8 profile-anim text-center md:text-left">

      <!-- Avatar & User Info Group -->
      <div class="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto">

        <!-- Avatar Uploader (Big) -->
        <div class="shrink-0 relative">
          <!-- Декоративное свечение сзади -->
          <div class="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-90 md:scale-100"></div>
          <div class="relative">
            <AvatarUploader />
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-1 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Operative Profile</span>
          <h2 class="text-3xl md:text-4xl font-display font-bold italic text-text-primary leading-tight">
            {{ userStore.profile.username }}
          </h2>
          <p class="text-text-muted font-sans text-sm">
            Level {{ userStore.profile.level }} Scout &bull; Joined {{ new Date(userStore.profile.joinDate).getFullYear() }}
          </p>
        </div>
      </div>

      <!-- Membership Status Badge -->
      <div class="w-full md:w-auto flex items-center justify-center md:justify-start gap-3 bg-background-tertiary/30 px-5 py-3 rounded-xl border border-border/50">
        <div class="p-2 bg-background-primary rounded-full text-text-secondary shrink-0">
          <Shield :size="18" />
        </div>
        <div class="flex flex-col items-start">
          <span class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Current Clearance</span>
          <span class="text-sm font-bold text-text-primary">Level 1 (Standard)</span>
        </div>
      </div>
    </div>

    <!-- Stats Dashboard Widget -->
    <div class="profile-anim mb-12">
      <UserStatsDashboard />
    </div>

    <!-- Settings & Donation Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 profile-anim">

      <!-- Settings Card -->
      <div class="p-6 rounded-2xl border border-border bg-background-primary/50 flex flex-col gap-4 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2 mb-2">
          <h3 class="text-lg font-bold text-text-primary font-display">Neural Link Settings</h3>
        </div>
        <p class="text-sm text-text-secondary leading-relaxed">
          Manage your synchronization preferences, notifications, and data retention policies.
        </p>
        <div class="mt-auto pt-4 flex justify-center md:justify-start">
          <BaseButton variant="outline" class="w-full sm:w-auto text-xs">Manage Account</BaseButton>
        </div>
      </div>

      <!-- Donation Card (Support the Signal) -->
      <div class="p-6 rounded-2xl border border-accent/20 bg-accent/5 flex flex-col gap-5 text-center md:text-left relative overflow-hidden">
        <!-- Декоративный фон -->
        <div class="absolute -top-10 -right-10 text-accent/5 rotate-12 pointer-events-none">
          <Heart :size="160" />
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-center md:justify-start gap-2 text-accent mb-2">
            <Coffee :size="20" />
            <span class="text-xs font-bold uppercase tracking-widest">Support the Signal</span>
          </div>

          <p class="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto md:mx-0 mb-4">
            Keep the Deep Field operational. All credits go towards server maintenance and neural uplinks.
          </p>

          <!-- Requisites List -->
          <div class="flex flex-col gap-2">
            <button
              v-for="(method, index) in donationMethods"
              :key="method.label"
              @click="copyToClipboard(method.value, index)"
              class="group flex items-center justify-between gap-3 p-3 rounded-lg bg-background-primary border border-border/50 hover:border-accent/50 hover:bg-background-secondary transition-all active:scale-[0.98]"
              title="Click to copy"
            >
              <div class="flex flex-col items-start min-w-0">
                <span class="text-[10px] font-bold text-text-muted uppercase tracking-wider">{{ method.label }}</span>
                <span class="text-xs font-mono text-text-primary truncate w-full max-w-[200px] sm:max-w-xs text-left">
                            {{ method.value }}
                        </span>
              </div>
              <div class="shrink-0 text-text-muted group-hover:text-accent transition-colors">
                <transition mode="out-in" name="fade">
                  <Check v-if="copiedIndex === index" :size="16" class="text-green-500" />
                  <Copy v-else :size="16" />
                </transition>
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
