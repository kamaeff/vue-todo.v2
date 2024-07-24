import {createRouter, createWebHistory} from 'vue-router';

import About from './AboutRoute.vue';
import Home from './HomeRoute.vue';
import NotFound from './NotFound.vue';
import AuthRoute from './AuthRoute.vue';
import RegRoute from './RegRoute.vue';

const routes = [
  {path: '/vue-todo.v2/', component: Home},
  {path: '/vue-todo.v2/auth', component: AuthRoute},
  {path: '/vue-todo.v2/register', component: RegRoute},
  {path: '/vue-todo.v2/about', component: About},
  {path: '/vue-todo.v2/:pathMatch(.*)*', component: NotFound},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
