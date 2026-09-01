import type { RouteRecordRaw } from 'vue-router'

export const serviceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/services',
    name: 'kubernetes:network:service',
    component: () => import('@/views/kubernetes/network/service/index.vue'),
    meta: {
      title: '服务',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    name: 'kubernetes:network:service:detail',
    component: () => import('@/views/kubernetes/network/service/detail/index.vue'),
    meta: {
      title: '服务详情',
      permission: 'kubernetes:network:service:view',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/services/create',
    name: 'kubernetes:network:service:create',
    component: () => import('@/views/kubernetes/network/service/create/index.vue'),
    meta: {
      title: '创建服务',
      permission: 'kubernetes:network:service:create',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/services/create/yaml',
    name: 'kubernetes:network:service:create:yaml',
    component: () => import('@/views/kubernetes/network/service/create/yaml.vue'),
    meta: {
      title: '创建服务 YAML',
      permission: 'kubernetes:network:service:create',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit',
    name: 'kubernetes:network:service:edit',
    component: () => import('@/views/kubernetes/network/service/edit/index.vue'),
    meta: {
      title: '编辑服务',
      permission: 'kubernetes:network:service:edit',
      activeCode: 'kubernetes:network:service',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit/yaml',
    name: 'kubernetes:network:service:edit:yaml',
    component: () => import('@/views/kubernetes/network/service/edit/yaml.vue'),
    meta: {
      title: '编辑服务 YAML',
      permission: 'kubernetes:network:service:edit',
      activeCode: 'kubernetes:network:service',
    },
  },
]
