import { createRouter, createWebHistory } from 'vue-router'
import Home from './HomeRoute.vue'
import About from './AboutRoute.vue'
import NotFound from './NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
