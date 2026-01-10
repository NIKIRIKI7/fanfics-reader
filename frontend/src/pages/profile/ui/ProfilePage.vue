<script setup lang="ts">
import { onMounted } from 'vue'
import { UserStatsDashboard } from '@/widgets/user-stats-dashboard'
import { Crown, Shield, CreditCard } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import gsap from 'gsap'

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
  <div class="w-full max-w-[var(--app-max-width)] mx-auto px-[var(--app-padding)] py-12 min-h-screen">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-border gap-6 profile-anim">
      <div class="flex flex-col gap-2">
        <h2 class="text-4xl font-display font-bold italic text-text-primary leading-none">
          Operative Profile
        </h2>
        <p class="text-text-muted font-sans text-sm">
          Personal dossier, statistics, and clearance level.
        </p>
      </div>

      <!-- Membership Status Badge (Future Subscription System Placeholder) -->
      <div class="flex items-center gap-3 bg-background-tertiary/30 px-4 py-2 rounded-xl border border-border/50">
        <div class="p-2 bg-background-primary rounded-full text-text-secondary">
          <Shield :size="18" />
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] uppercase font-bold text-text-muted tracking-wider">Clearance</span>
          <span class="text-sm font-bold text-text-primary">Level 1 (Free)</span>
        </div>
      </div>
    </div>

    <!-- Stats Dashboard Widget -->
    <div class="profile-anim mb-12">
      <UserStatsDashboard />
    </div>

    <!-- Subscription Teaser / Future Settings Area -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 profile-anim">

      <!-- Account Settings Placeholder -->
      <div class="p-6 rounded-2xl border border-border bg-background-primary/50 flex flex-col gap-4">
        <h3 class="text-lg font-bold text-text-primary font-display">Neural Link Settings</h3>
        <p class="text-sm text-text-secondary leading-relaxed">
          Manage your synchronization preferences, notifications, and data retention policies.
        </p>
        <div class="mt-auto pt-4">
           <BaseButton variant="outline" class="w-full sm:w-auto text-xs">Manage Account</BaseButton>
        </div>
      </div>

      <!-- Subscription Upsell Placeholder -->
      <div class="p-6 rounded-2xl border border-accent/20 bg-accent/5 flex flex-col gap-4 relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Crown :size="120" />
        </div>

        <div class="flex items-center gap-2 text-accent mb-1">
           <Crown :size="20" />
           <span class="text-xs font-bold uppercase tracking-widest">Deep Field Premium</span>
        </div>

        <h3 class="text-lg font-bold text-text-primary font-display">Upgrade Clearance</h3>
        <p class="text-sm text-text-secondary leading-relaxed max-w-sm">
          Unlock offline archives, exclusive "Gold" tier fanfictions, and support the platform.
        </p>

        <div class="mt-auto pt-4">
           <button class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-accent text-background-primary text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity w-full sm:w-auto">
              <CreditCard :size="16" />
              View Plans
           </button>
        </div>
      </div>

    </div>

  </div>
</template>
