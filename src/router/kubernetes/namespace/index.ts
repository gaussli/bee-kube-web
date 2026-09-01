import type { RouteRecordRaw } from 'vue-router'

export const namespaceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces',
    name: 'kubernetes:namespace',
    component: () => import('@/views/kubernetes/namespace/index.vue'),
    meta: {
      title: '命名空间',
      permission: 'kubernetes:namespace:view',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    name: 'kubernetes:namespace:detail',
    component: () => import('@/views/kubernetes/namespace/detail/index.vue'),
    meta: {
      title: '命名空间详情',
      permission: 'kubernetes:namespace:view',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/create',
    name: 'kubernetes:namespace:create',
    component: () => import('@/views/kubernetes/namespace/create/index.vue'),
    meta: {
      title: '创建命名空间',
      permission: 'kubernetes:namespace:create',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/create/yaml',
    name: 'kubernetes:namespace:create:yaml',
    component: () => import('@/views/kubernetes/namespace/create/yaml.vue'),
    meta: {
      title: '创建命名空间 YAML',
      permission: 'kubernetes:namespace:create',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/edit',
    name: 'kubernetes:namespace:edit',
    component: () => import('@/views/kubernetes/namespace/edit/index.vue'),
    meta: {
      title: '编辑命名空间',
      permission: 'kubernetes:namespace:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/edit/yaml',
    name: 'kubernetes:namespace:edit:yaml',
    component: () => import('@/views/kubernetes/namespace/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间 YAML',
      permission: 'kubernetes:namespace:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
]
