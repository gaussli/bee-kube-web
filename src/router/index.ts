import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

import { useKubernetesStore } from '@/stores/kubernetes'
import { useUserStore } from '@/stores/user'

import { kubernetesRoutes } from './kubernetes'
import { platformRoutes } from './platform'

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/kubernetes/cluster',
    children: [
      ...kubernetesRoutes,
      ...platformRoutes,
      {
        path: '/403',
        name: '403',
        component: () => import('@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'Box',
        },
      },
    ],
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 路由守卫
router.beforeEach(async (to, from) => {
  console.log('from:', from.fullPath, ', to:', to.fullPath)
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

  // 路由包含 :clusterId 参数时，同步到 kubernetesStore
  const clusterId = to.params.clusterId as string | undefined
  if (clusterId) {
    const kubernetesStore = useKubernetesStore()
    kubernetesStore.setActiveClusterId(clusterId)
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
