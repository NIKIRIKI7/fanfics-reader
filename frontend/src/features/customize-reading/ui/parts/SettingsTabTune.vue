<script setup lang="ts">
import { useReadingSettingsStore } from '../../model/store'
import { storeToRefs } from 'pinia'
import { Settings2, ScanLine, Sun, Moon, MoveHorizontal, Minus, Plus } from 'lucide-vue-next'
import gsap from 'gsap'

const store = useReadingSettingsStore()
const {
  lineHeight,
  fontWeight,
  letterSpacing,
  enableHaptics,
  isRulerEnabled,
  rulerHeight,
  rulerIntensity
} = storeToRefs(store)

const lineHeights = [1.4, 1.8, 2.2]
</script>

<template>
  <div class="flex flex-col gap-5 animate-in slide-in-from-right-4 fade-in duration-300">

    <!-- Grid: Line Height & Weight -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Line Height -->
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center pl-1">
          <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Leading</span>
          <span class="text-[10px] text-text-primary font-mono font-bold">{{ lineHeight }}</span>
        </div>
        <div class="flex bg-background-tertiary rounded-lg p-1 h-9 gap-1">
          <button
            v-for="val in lineHeights"
            :key="val"
            @click="store.setLineHeight(val)"
            class="flex-1 flex items-center justify-center rounded transition-all text-xs font-bold border border-transparent"
            :class="lineHeight === val ? 'bg-background-primary shadow-sm text-text-primary border-border/10' : 'text-text-muted hover:text-text-secondary'"
          >
            {{ val }}
          </button>
        </div>
      </div>

      <!-- Font Weight -->
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center pl-1">
          <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Weight</span>
          <span class="text-[10px] text-text-primary font-mono font-bold">{{ fontWeight }}</span>
        </div>
        <div class="flex items-center gap-2 bg-background-tertiary rounded-lg p-1 h-9">
          <button
            @click="store.decreaseWeight"
            :disabled="fontWeight <= 100"
            class="w-8 h-full rounded bg-background-primary border border-border/10 flex items-center justify-center disabled:opacity-50 hover:border-accent transition-colors text-text-primary active:scale-95"
          >
            <Minus :size="14"/>
          </button>

          <div class="flex-1 h-1.5 bg-background-primary/50 rounded-full overflow-hidden mx-1">
            <div
              class="h-full bg-text-primary transition-all duration-300"
              :style="{ width: `${(fontWeight / 900) * 100}%` }"
            ></div>
          </div>

          <button
            @click="store.increaseWeight"
            :disabled="fontWeight >= 900"
            class="w-8 h-full rounded bg-background-primary border border-border/10 flex items-center justify-center disabled:opacity-50 hover:border-accent transition-colors text-text-primary active:scale-95"
          >
            <Plus :size="14"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Letter Spacing -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-end pl-1 pr-1">
            <span class="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
                <MoveHorizontal :size="12" /> Tracking
            </span>
        <span class="text-sm font-bold text-text-primary tabular-nums leading-none">{{ letterSpacing }}px</span>
      </div>
      <div class="bg-background-tertiary/30 p-2 rounded-xl border border-border/30">
        <input
          type="range"
          min="-2"
          max="10"
          step="0.5"
          v-model.number="letterSpacing"
          class="w-full h-1.5 bg-background-tertiary rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>
    </div>

    <div class="h-px bg-border/40 my-1"></div>

    <!-- Toggles Section -->
    <div class="flex flex-col gap-3">

      <!-- Haptics Toggle -->
      <label class="flex items-center justify-between p-2.5 rounded-xl bg-background-tertiary/20 border border-border/30 cursor-pointer hover:bg-background-tertiary/40 transition-colors select-none">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full bg-background-primary text-text-secondary border border-border/10">
            <Settings2 :size="16" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-text-primary">Haptics</span>
            <span class="text-[10px] text-text-muted uppercase tracking-wider font-bold">Vibration</span>
          </div>
        </div>

        <div class="relative">
          <input type="checkbox" class="sr-only peer" :checked="enableHaptics" @change="store.toggleHaptics">
          <div class="w-10 h-6 bg-background-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent transition-colors duration-300"></div>
        </div>
      </label>

      <!-- Focus Ruler Toggle -->
      <div class="flex flex-col gap-2 p-2.5 rounded-xl bg-background-tertiary/20 border border-border/30 transition-all duration-300 select-none" :class="{'bg-background-tertiary/50 border-accent/20': isRulerEnabled}">
        <label class="flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-full bg-background-primary text-text-secondary border border-border/10" :class="{'text-accent': isRulerEnabled}">
              <ScanLine :size="16" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-text-primary">Focus Ruler</span>
              <span class="text-[10px] text-text-muted uppercase tracking-wider font-bold">Reading Aid</span>
            </div>
          </div>

          <div class="relative">
            <input type="checkbox" class="sr-only peer" :checked="isRulerEnabled" @change="store.toggleRuler">
            <div class="w-10 h-6 bg-background-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent transition-colors duration-300"></div>
          </div>
        </label>

        <!-- Expanded Ruler Settings -->
        <transition
          @enter="(el, done) => gsap.fromTo(el, { height: 0, opacity: 0, marginTop: 0 }, { height: 'auto', opacity: 1, marginTop: 8, duration: 0.3, ease: 'power2.out', onComplete: done })"
          @leave="(el, done) => gsap.to(el, { height: 0, opacity: 0, marginTop: 0, duration: 0.2, ease: 'power2.in', onComplete: done })"
        >
          <div v-if="isRulerEnabled" class="overflow-hidden">
            <div class="bg-background-primary/60 rounded-lg p-3 flex flex-col gap-4 border border-border/20">
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-widest pl-1">
                  <span>Height</span>
                  <span>{{ rulerHeight }}px</span>
                </div>
                <input type="range" min="60" max="250" step="10" v-model.number="rulerHeight" class="w-full h-1.5 bg-background-tertiary rounded-full accent-accent" />
              </div>
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-widest pl-1">
                  <span>Dimming</span>
                  <span>{{ Math.round(rulerIntensity * 100) }}%</span>
                </div>
                <div class="flex items-center gap-3">
                  <Sun :size="14" class="text-text-muted"/>
                  <input type="range" min="0.1" max="0.9" step="0.05" v-model.number="rulerIntensity" class="w-full h-1.5 bg-background-tertiary rounded-full accent-accent" />
                  <Moon :size="14" class="text-text-muted"/>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--color-accent);
  margin-top: -8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: var(--bg-tertiary);
  border-radius: 2px;
}
</style>
