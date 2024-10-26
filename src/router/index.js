import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// createRouter: 创建路由实例对象
// createWebHistory: 创建history模式的路由，createWebHashHistory: 创建history模式的路由

const router = createRouter({
  // 配置history模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'bigScreen',
      component: HomeView
    },
    {
      path: '/bigScreen',
      name: 'BigScreen',
      component: () =>import('../views/BigScreenView.vue')
    }
  ]
})

export default router
