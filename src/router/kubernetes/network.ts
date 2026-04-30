import type { RouteRecordRaw } from 'vue-router'

const serviceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/network/service',
    name: 'kubernetes:network:service',
    component: () => import('@/views/kubernetes/network/service/index.vue'),
    meta: {
      title: '服务',
      icon: 'Share',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service'
    }
  },
  {
    path: '/kubernetes/network/service/create',
    name: 'kubernetes:network:service:create',
    component: () => import('@/views/kubernetes/network/service/create/index.vue'),
    meta: {
      title: '创建服务',
      icon: 'Share',
      permission: 'kubernetes:network:service:create',
      activeCode: 'kubernetes:network:service'
    }
  },
  {
    path: '/kubernetes/network/service/edit',
    name: 'kubernetes:network:service:edit',
    component: () => import('@/views/kubernetes/network/service/edit/index.vue'),
    meta: {
      title: '编辑服务',
      icon: 'Share',
      permission: 'kubernetes:network:service:edit',
      activeCode: 'kubernetes:network:service'
    }
  },
  {
    path: '/kubernetes/network/service/detail',
    name: 'kubernetes:network:service:detail',
    component: () => import('@/views/kubernetes/network/service/detail/index.vue'),
    meta: {
      title: '服务详情',
      icon: 'Share',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service'
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
      icon: 'Guide',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress'
    }
  },
  {
    path: '/kubernetes/network/ingress/create',
    name: 'kubernetes:network:ingress:create',
    component: () => import('@/views/kubernetes/network/ingress/create/index.vue'),
    meta: {
      title: '创建入口',
      icon: 'Guide',
      permission: 'kubernetes:network:ingress:create',
      activeCode: 'kubernetes:network:ingress'
    }
  },
  {
    path: '/kubernetes/network/ingress/edit',
    name: 'kubernetes:network:ingress:edit',
    component: () => import('@/views/kubernetes/network/ingress/edit/index.vue'),
    meta: {
      title: '编辑入口',
      icon: 'Guide',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: 'kubernetes:network:ingress'
    }
  },
  {
    path: '/kubernetes/network/ingress/detail',
    name: 'kubernetes:network:ingress:detail',
    component: () => import('@/views/kubernetes/network/ingress/detail/index.vue'),
    meta: {
      title: '入口详情',
      icon: 'Guide',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress'
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
      icon: 'Aim',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy'
    }
  },
  {
    path: '/kubernetes/network/networkpolicy/create',
    name: 'kubernetes:network:networkpolicy:create',
    component: () => import('@/views/kubernetes/network/networkpolicy/create/index.vue'),
    meta: {
      title: '创建网络策略',
      icon: 'Aim',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: 'kubernetes:network:networkpolicy'
    }
  },
  {
    path: '/kubernetes/network/networkpolicy/edit',
    name: 'kubernetes:network:networkpolicy:edit',
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/index.vue'),
    meta: {
      title: '编辑网络策略',
      icon: 'Aim',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: 'kubernetes:network:networkpolicy'
    }
  },
  {
    path: '/kubernetes/network/networkpolicy/detail',
    name: 'kubernetes:network:networkpolicy:detail',
    component: () => import('@/views/kubernetes/network/networkpolicy/detail/index.vue'),
    meta: {
      title: '网络策略详情',
      icon: 'Aim',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy'
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
