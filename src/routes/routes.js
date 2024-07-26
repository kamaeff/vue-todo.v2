import {createRouter, createWebHistory} from 'vue-router/auto';

import About from './AboutRoute.vue';
import Home from './HomeRoute.vue';
import NotFound from './NotFound.vue';
import AuthRoute from './AuthRoute.vue';
import RegRoute from './RegRoute.vue';
import {useUserStore} from '@/store/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: Home},
    {path: '/auth', name: 'auth', component: AuthRoute},
    {path: '/reg', name: 'reg', component: RegRoute},
    {path: '/about', name: 'about', component: About},
    {path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound},
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  await userStore.loadUser();

  const isAuthenticated = !!userStore.token;

  if (isAuthenticated && (to.path === '/auth' || to.path === '/reg')) {
    next('/');
  } else {
    next();
  }
});

export default router;
