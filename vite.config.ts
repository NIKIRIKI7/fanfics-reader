import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Имя твоего репозитория на GitHub
const REPO_NAME = '/fanfics-reader/';

export default defineConfig({
  // В продакшене используем имя репозитория, локально — корень
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
