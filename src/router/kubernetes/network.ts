import type { RouteRecordRaw } from 'vue-router'

const serviceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/network/service',
    name: 'kubernetes:network:service',
    component: () => import('@/views/kubernetes/network/service/index.vue'),
    meta: {
      title: '服务',
      icon: 'Share'
    }
  }
]

const ingressRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/network/ingress',
    name: 'kubernetes:network:ingress',
    component: () => import('@/views/kubernetes/network/ingress/index.vue'),
    meta: {
      title: '入口',
      icon: 'Guide'
    }
  }
]

const networkPolicyRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/network/networkpolicy',
    name: 'kubernetes:network:networkpolicy',
    component: () => import('@/views/kubernetes/network/networkpolicy/index.vue'),
    meta: {
      title: '网络策略',
      icon: 'Aim'
    }
  }
]

export const networkRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/network',
    name: 'kubernetes:network',
    redirect: '/kubernetes/network/service',
    meta: {
      title: '网络',
      icon: 'Connection'
    },
    children: [...serviceRoutes, ...ingressRoutes, ...networkPolicyRoutes]
  }
]
