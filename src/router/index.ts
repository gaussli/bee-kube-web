import { getCurrentUser } from '@/api'
import { useUserStore } from '@/stores/user'
import type { CurrentMenu } from '@/types'
import { generateRoutes } from '@/utils/menu'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

let dynamicRoutesAdded = false

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', icon: 'HomeFilled', requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'HomeFilled' }
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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.path === '/login') {
    return next()
  }
  if (!userStore.isLogin()) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (dynamicRoutesAdded) {
    console.log('dynamicRoutesAdded == true')
    return next()
  }

  // 动态添加路由
  try {
    console.log('running set userinfo')
    const currentUserResp = await getCurrentUser()
    userStore.setCurrentUser(currentUserResp.user)
    userStore.setCurrentMenus(currentUserResp.menus)
    userStore.setCurrentPermissions(currentUserResp.permissions)
    if (currentUserResp.menus.length > 0) {
      addDynamicRoutes(currentUserResp.menus)
    }
    console.log(router.getRoutes())
    dynamicRoutesAdded = true
    return next({ ...to, replace: true })
  } catch {
    userStore.clear()
    return next({ path: '/login' })
  }
})

router.afterEach(to => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Bee Kube`
  }
})

// 动态添加路由（作为 Home 的子路由）
export function addDynamicRoutes(menus: CurrentMenu[]) {
  const routes = generateRoutes(menus)
  for (const route of routes) {
    // 添加到 Home 路由下
    if (!router.getRoutes().find(r => r.path === route.path)) {
      router.addRoute('Home', route)
    }
  }
}

// 重置路由
export function resetRouter() {
  const routes = router.getRoutes()
  routes.forEach(route => {
    const { name } = route
    if (name && !constantRoutes.find(r => r.name === name)) {
      router.removeRoute(name)
    }
  })
  dynamicRoutesAdded = false
}

export default router
