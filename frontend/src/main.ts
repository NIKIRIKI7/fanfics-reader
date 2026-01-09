import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger)

// 1. Иконки (из node_modules)
// Подключаем именно Outlined версию, как в дизайне
import 'material-symbols/outlined.css'

// 2. Локальные шрифты для текста (Literata + Inter)
import './app/styles/fonts.css'

// 3. Основные стили (Tailwind)
import './app/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
