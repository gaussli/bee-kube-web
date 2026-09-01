import type { RouteRecordRaw } from 'vue-router'

export const ingressRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses',
    name: 'kubernetes:network:ingress',
    component: () => import('@/views/kubernetes/network/ingress/index.vue'),
    meta: {
      title: '入口',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    name: 'kubernetes:network:ingress:detail',
    component: () => import('@/views/kubernetes/network/ingress/detail/index.vue'),
    meta: {
      title: '入口详情',
      permission: 'kubernetes:network:ingress:view',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses/create',
    name: 'kubernetes:network:ingress:create',
    component: () => import('@/views/kubernetes/network/ingress/create/index.vue'),
    meta: {
      title: '创建入口',
      permission: 'kubernetes:network:ingress:create',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses/create/yaml',
    name: 'kubernetes:network:ingress:create:yaml',
    component: () => import('@/views/kubernetes/network/ingress/create/yaml.vue'),
    meta: {
      title: '创建入口 YAML',
      permission: 'kubernetes:network:ingress:create',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit',
    name: 'kubernetes:network:ingress:edit',
    component: () => import('@/views/kubernetes/network/ingress/edit/index.vue'),
    meta: {
      title: '编辑入口',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: 'kubernetes:network:ingress',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit/yaml',
    name: 'kubernetes:network:ingress:edit:yaml',
    component: () => import('@/views/kubernetes/network/ingress/edit/yaml.vue'),
    meta: {
      title: '编辑入口 YAML',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: 'kubernetes:network:ingress',
    },
  },
]
