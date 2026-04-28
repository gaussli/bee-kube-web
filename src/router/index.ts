import { createRouter, createWebHistory } from 'vue-router'
import { generateRoutes } from '@/utils'
import { getCurrentUser } from '@/api'
import { useUserStore } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'
import type { CurrentMenu } from '@/types'

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
        path: '/403',
        name: 'NoPermission',
        component: () => import('@/views/error/403.vue'),
        meta: { title: '无权限', hidden: true }
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'HomeFilled' }
      },
      {
        path: '/system/user/detail',
        name: 'UserDetail',
        component: () => import('@/views/system/user/detail/index.vue'),
        meta: { title: '用户详情', hidden: true, permission: 'system:user:view' }
      },
      {
        path: '/system/user/create',
        name: 'UserCreate',
        component: () => import('@/views/system/user/create/index.vue'),
        meta: { title: '创建用户', hidden: true, permission: 'system:user:create' }
      },
      {
        path: '/system/user/edit',
        name: 'UserEdit',
        component: () => import('@/views/system/user/edit/index.vue'),
        meta: { title: '编辑用户', hidden: true, permission: 'system:user:edit' }
      },
      {
        path: '/system/user/assign-roles',
        name: 'UserAssignRoles',
        component: () => import('@/views/system/user/assign-roles/index.vue'),
        meta: { title: '配置角色', hidden: true, permission: 'system:user:edit' }
      },
      {
        path: '/system/role/create',
        name: 'RoleCreate',
        component: () => import('@/views/system/role/create/index.vue'),
        meta: { title: '创建角色', hidden: true, permission: 'system:role:create' }
      },
      {
        path: '/system/role/detail',
        name: 'RoleDetail',
        component: () => import('@/views/system/role/detail/index.vue'),
        meta: { title: '角色详情', hidden: true, permission: 'system:role:view' }
      },
      {
        path: '/system/role/edit',
        name: 'RoleEdit',
        component: () => import('@/views/system/role/edit/index.vue'),
        meta: { title: '编辑角色', hidden: true, permission: 'system:role:edit' }
      },
      {
        path: '/system/role/assign-permissions',
        name: 'RoleAssignPermissions',
        component: () => import('@/views/system/role/assign-permissions/index.vue'),
        meta: { title: '配置权限', hidden: true, permission: 'system:role:edit' }
      },
      {
        path: '/system/role/assign-users',
        name: 'RoleAssignUsers',
        component: () => import('@/views/system/role/assign-users/index.vue'),
        meta: { title: '配置用户', hidden: true, permission: 'system:role:edit' }
      },
      {
        path: '/system/menu/create',
        name: 'MenuCreate',
        component: () => import('@/views/system/menu/create/index.vue'),
        meta: { title: '创建菜单', hidden: true, permission: 'system:menu:create' }
      },
      {
        path: '/system/menu/detail',
        name: 'MenuDetail',
        component: () => import('@/views/system/menu/detail/index.vue'),
        meta: { title: '菜单详情', hidden: true, permission: 'system:menu:view' }
      },
      {
        path: '/system/menu/edit',
        name: 'MenuEdit',
        component: () => import('@/views/system/menu/edit/index.vue'),
        meta: { title: '编辑菜单', hidden: true, permission: 'system:menu:edit' }
      },
      {
        path: '/system/menu/assign-roles',
        name: 'MenuAssignRoles',
        component: () => import('@/views/system/menu/assign-roles/index.vue'),
        meta: { title: '配置角色', hidden: true, permission: 'system:menu:edit' }
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

  // 登录页直接通过
  if (to.path === '/login') {
    return next()
  }

  // 未登录则跳转登录页
  if (!userStore.isLogin()) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 检查页面权限
  const permissions = userStore.getCurrentPermissions() || []
  const requiredPermission = to.meta.permission as string | undefined
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return next('/403')
  }

  // 动态路由已添加，直接放行
  if (dynamicRoutesAdded) {
    return next()
  }

  // 动态添加路由
  try {
    console.log('running set userinfo')
    const currentUserResp = await getCurrentUser()
    userStore.setCurrentUser(currentUserResp.user)
    userStore.setCurrentMenus(currentUserResp.menus)
    if (currentUserResp.clusterMenus) {
      userStore.setClusterMenus(currentUserResp.clusterMenus)
    }
    userStore.setCurrentPermissions(currentUserResp.permissions)
    if (currentUserResp.menus.length > 0) {
      addDynamicRoutes(currentUserResp.menus)
    }
    // 添加集群管理路由
    if (currentUserResp.clusterMenus && currentUserResp.clusterMenus.length > 0) {
      addDynamicRoutes(currentUserResp.clusterMenus)
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
