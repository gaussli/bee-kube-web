import type { RouteRecordRaw } from 'vue-router'

const configmapRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/config/configmap',
    name: 'kubernetes:config:configmap',
    component: () => import('@/views/kubernetes/config/configmap/index.vue'),
    meta: {
      title: '配置映射',
      icon: 'DocumentCopy'
    }
  }
]

const secretRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/config/secret',
    name: 'kubernetes:config:secret',
    component: () => import('@/views/kubernetes/config/secret/index.vue'),
    meta: {
      title: '密钥',
      icon: 'Lock'
    }
  }
]

export const configRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/config',
    name: 'kubernetes:config',
    redirect: '/kubernetes/config/configmap',
    meta: {
      title: '配置',
      icon: 'Setting'
    },
    children: [...configmapRoutes, ...secretRoutes]
  }
]
