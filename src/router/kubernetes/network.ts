import type { RouteRecordRaw } from 'vue-router'

const serviceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/network/services',
    name: 'kubernetes:network:service',
    component: () => import('@/views/kubernetes/network/service/index.vue'),
    meta: {
      title: '服务',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/services/:name',
    name: 'kubernetes:network:service:detail',
    component: () => import('@/views/kubernetes/network/service/detail/index.vue'),
    meta: {
      title: '服务详情',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/services/create',
    name: 'kubernetes:network:service:create',
    component: () => import('@/views/kubernetes/network/service/create/index.vue'),
    meta: {
      title: '创建服务',
      permission: 'kubernetes:network:service:create',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/services/create/yaml',
    name: 'kubernetes:network:service:create:yaml',
    component: () => import('@/views/kubernetes/network/service/create/yaml.vue'),
    meta: {
      title: '创建服务 YAML',
      permission: 'kubernetes:network:service:create',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/services/:name/edit',
    name: 'kubernetes:network:service:edit',
    component: () => import('@/views/kubernetes/network/service/edit/index.vue'),
    meta: {
      title: '编辑服务',
      permission: 'kubernetes:network:service:edit',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/services/:name/edit/yaml',
    name: 'kubernetes:network:service:edit:yaml',
    component: () => import('@/views/kubernetes/network/service/edit/yaml.vue'),
    meta: {
      title: '编辑服务 YAML',
      permission: 'kubernetes:network:service:edit',
      activeCode: 'kubernetes:network:service',
    },
  },
]

const ingressRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses',
    name: 'kubernetes:network:ingress',
    component: () => import('@/views/kubernetes/network/ingress/index.vue'),
    meta: {
      title: '入口',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses/:name',
    name: 'kubernetes:network:ingress:detail',
    component: () => import('@/views/kubernetes/network/ingress/detail/index.vue'),
    meta: {
      title: '入口详情',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses/create',
    name: 'kubernetes:network:ingress:create',
    component: () => import('@/views/kubernetes/network/ingress/create/index.vue'),
    meta: {
      title: '创建入口',
      permission: 'kubernetes:network:ingress:create',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses/create/yaml',
    name: 'kubernetes:network:ingress:create:yaml',
    component: () => import('@/views/kubernetes/network/ingress/create/yaml.vue'),
    meta: {
      title: '创建入口 YAML',
      permission: 'kubernetes:network:ingress:create',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses/:name/edit',
    name: 'kubernetes:network:ingress:edit',
    component: () => import('@/views/kubernetes/network/ingress/edit/index.vue'),
    meta: {
      title: '编辑入口',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/ingresses/:name/edit/yaml',
    name: 'kubernetes:network:ingress:edit:yaml',
    component: () => import('@/views/kubernetes/network/ingress/edit/yaml.vue'),
    meta: {
      title: '编辑入口 YAML',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: 'kubernetes:network:ingress',
    },
  },
]

const networkPolicyRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies',
    name: 'kubernetes:network:networkpolicy',
    component: () => import('@/views/kubernetes/network/networkpolicy/index.vue'),
    meta: {
      title: '网络策略',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies/:name',
    name: 'kubernetes:network:networkpolicy:detail',
    component: () => import('@/views/kubernetes/network/networkpolicy/detail/index.vue'),
    meta: {
      title: '网络策略详情',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies/create',
    name: 'kubernetes:network:networkpolicy:create',
    component: () => import('@/views/kubernetes/network/networkpolicy/create/index.vue'),
    meta: {
      title: '创建网络策略',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies/create/yaml',
    name: 'kubernetes:network:networkpolicy:create:yaml',
    component: () => import('@/views/kubernetes/network/networkpolicy/create/yaml.vue'),
    meta: {
      title: '创建网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies/:name/edit',
    name: 'kubernetes:network:networkpolicy:edit',
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/index.vue'),
    meta: {
      title: '编辑网络策略',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/network/networkpolicies/:name/edit/yaml',
    name: 'kubernetes:network:networkpolicy:edit:yaml',
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/yaml.vue'),
    meta: {
      title: '编辑网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
]

export const networkRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/network',
    name: 'kubernetes:network',
    redirect: '/kubernetes/clusters/:clusterUid/network/services',
    meta: {
      title: '网络',
    },
    children: [...serviceRoutes, ...ingressRoutes, ...networkPolicyRoutes],
  },
]
