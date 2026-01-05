import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';

// Import CSS with Tailwind v4 config
import './app/styles/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

// Logging for debug
console.log('[App] Initialized with Feature-Sliced Design');
