import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/splash' },
  { path: '/splash', component: () => import('@/views/SplashPage.vue') },
  { path: '/login', component: () => import('@/views/LoginPage.vue') },
  { path: '/signup', component: () => import('@/views/SignupPage.vue') },
  { path: '/onboarding', component: () => import('@/views/OnboardingPage.vue') },

  {
    path: '/app/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/app/tabs/chat' },
      { path: 'chat', component: () => import('@/views/ChatPage.vue') },
      { path: 'prompts', component: () => import('@/views/PromptsPage.vue') },
      { path: 'favoritos', component: () => import('@/views/FavoritesPage.vue') },
      { path: 'perfil', component: () => import('@/views/ProfilePage.vue') },
    ],
  },


  { path: '/app/categorias', component: () => import('@/views/CategoriesPage.vue') },
  { path: '/app/historico', component: () => import('@/views/HistoryPage.vue') },
  { path: '/app/prompts/new/edit', component: () => import('@/views/PromptEditPage.vue') },
  { path: '/app/prompts/:id', component: () => import('@/views/PromptDetailPage.vue') },
  { path: '/app/prompts/:id/edit', component: () => import('@/views/PromptEditPage.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
