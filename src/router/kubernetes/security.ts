import type { RouteRecordRaw } from 'vue-router'

const serviceAccountRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security/serviceaccount',
    name: 'kubernetes:security:serviceaccount',
    component: () => import('@/views/kubernetes/security/serviceaccount/index.vue'),
    meta: {
      title: '服务账号',
      icon: 'User'
    }
  }
]

const clusteRoleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security/clusterrole',
    name: 'kubernetes:security:clusterrole',
    component: () => import('@/views/kubernetes/security/clusterrole/index.vue'),
    meta: {
      title: '集群角色',
      icon: 'Avatar'
    }
  }
]

const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security/role',
    name: 'kubernetes:security:role',
    component: () => import('@/views/kubernetes/security/role/index.vue'),
    meta: {
      title: '角色',
      icon: 'UserFilled'
    }
  }
]

const clusteRoleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security/clusterrolebinding',
    name: 'kubernetes:security:clusterrolebinding',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/index.vue'),
    meta: {
      title: '集群角色绑定',
      icon: 'Connection'
    }
  }
]

const roleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security/rolebinding',
    name: 'kubernetes:security:rolebinding',
    component: () => import('@/views/kubernetes/security/rolebinding/index.vue'),
    meta: {
      title: '角色绑定',
      icon: 'Link'
    }
  }
]

export const securityRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/security',
    name: 'kubernetes:security',
    redirect: '/kubernetes/security/serviceaccount',
    meta: {
      title: '安全',
      icon: 'Key'
    },
    children: [...serviceAccountRoutes, ...clusteRoleRoutes, ...roleRoutes, ...clusteRoleBindingRoutes, ...roleBindingRoutes]
  }
]
