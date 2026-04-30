import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { kubernetesRoutes } from './kubernetes'
import { platformRoutes } from './platform'
import type { RouteRecordRaw } from 'vue-router'

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/kubernetes/dashboard',
    children: [
      ...kubernetesRoutes,
      ...platformRoutes,
      {
        path: '/403',
        name: '403',
        component: () => import('@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'Box'
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from) => {
  console.log(to)
  console.log(from)
  const userStore = useUserStore()

  // 登录页直接通过
  if (to.path === '/login') {
    return true
  }

  // 未登录则跳转登录页
  if (!userStore.isLogin()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 检查页面权限
  const permissions = userStore.getCurrentPermissions() || []
  const requiredPermission = to.meta.permission as string | undefined
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return '/403'
  }

  return true
})

router.afterEach(to => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Bee Kube`
  }
})

export default router
