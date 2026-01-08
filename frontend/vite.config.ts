import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // <--- IMPORT

// Имя твоего репозитория на GitHub
const REPO_NAME = '/fanfics-reader/';

export default defineConfig({
  // В продакшене используем имя репозитория, локально — корень
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // <--- PWA CONFIGURATION
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Project: Grey Sky',
        short_name: 'Grey Sky',
        description: 'Deep Field Narrative Terminal',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}'],
        runtimeCaching: [
          {
            // Кешируем внешние картинки (обложки)
            urlPattern: /^https:\/\/.*\.jpg$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cover-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
