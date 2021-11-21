import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/map/:queryString',
    component: () => import('../views/Map.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
