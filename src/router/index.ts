import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '马业坤' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/Articles.vue'),
    meta: { title: '马业坤-文章' }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: { title: '马业坤-文章详情' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: '马业坤-关于' }
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/views/Works.vue'),
    meta: { title: '马业坤-作品' }
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || '马业坤'
  next()
})

export default router
