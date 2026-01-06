import { createRouter, createWebHistory } from 'vue-router';
// ИСПРАВЛЕНО: Импорты через Public API страниц
import { HomePage } from '@/pages/home';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/works',
      name: 'works',
      // Динамические импорты тоже через Public API
      component: () => import('@/pages/works').then(m => m.WorksPage),
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('@/pages/archive').then(m => m.ArchivePage),
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('@/pages/contacts').then(m => m.ContactsPage),
    },
    {
      path: '/work/:slug',
      name: 'work-details',
      component: () => import('@/pages/work-details').then(m => m.WorkDetailsPage),
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  }
});

export default router;