import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';

// 1. Иконки (из node_modules)
// Подключаем именно Outlined версию, как в дизайне
import 'material-symbols/outlined.css';

// 2. Локальные шрифты для текста (Literata + Inter)
import './app/styles/fonts.css';

// 3. Основные стили (Tailwind)
import './app/styles/main.css';
// 4. Анимации
import './app/styles/animation.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
