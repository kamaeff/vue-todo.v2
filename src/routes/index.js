import {createRouter, createWebHistory} from 'vue-router';

import About from './AboutRoute.vue';
import Home from './HomeRoute.vue';
import NotFound from './NotFound.vue';

const routes = [
  {path: '/vue-todo.v2/', component: Home},
  {path: '/vue-todo.v2/about', component: About},
  {path: '/vue-todo.v2/:pathMatch(.*)*', component: NotFound},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
