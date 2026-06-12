import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Articles from '@/views/Articles.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import About from '@/views/About.vue'
import Works from '@/views/Works.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页 - Mayekun' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: Articles,
    meta: { title: '文章 - Mayekun' }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: ArticleDetail,
    meta: { title: '文章详情 - Mayekun' }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { title: '关于 - Mayekun' }
  },
  {
    path: '/works',
    name: 'works',
    component: Works,
    meta: { title: '作品 - Mayekun' }
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
  document.title = (to.meta.title as string) || 'Mayekun'
  next()
})

export default router
