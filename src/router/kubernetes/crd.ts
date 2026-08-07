import type { RouteRecordRaw } from 'vue-router'

export const crdRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/crds',
    name: 'kubernetes:crd',
    component: () => import('@/views/kubernetes/crd/index.vue'),
    meta: {
      title: '资源定义',
      permission: 'kubernetes:crd:view',
      activeCode: 'kubernetes:crd',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/crds/:name',
    name: 'kubernetes:crd:detail',
    component: () => import('@/views/kubernetes/crd/detail/index.vue'),
    meta: {
      title: '资源定义详情',
      permission: 'kubernetes:crd:view',
      activeCode: 'kubernetes:crd',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/crds/create',
    name: 'kubernetes:crd:create',
    component: () => import('@/views/kubernetes/crd/create/index.vue'),
    meta: {
      title: '创建资源定义',
      permission: 'kubernetes:crd:create',
      activeCode: 'kubernetes:crd',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/crds/create/yaml',
    name: 'kubernetes:crd:create:yaml',
    component: () => import('@/views/kubernetes/crd/create/yaml.vue'),
    meta: {
      title: '创建资源定义 YAML',
      permission: 'kubernetes:crd:create',
      activeCode: 'kubernetes:crd',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/crds/:name/edit',
    name: 'kubernetes:crd:edit',
    component: () => import('@/views/kubernetes/crd/edit/index.vue'),
    meta: {
      title: '编辑资源定义',
      permission: 'kubernetes:crd:edit',
      activeCode: 'kubernetes:crd',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/crds/:name/edit/yaml',
    name: 'kubernetes:crd:edit:yaml',
    component: () => import('@/views/kubernetes/crd/edit/yaml.vue'),
    meta: {
      title: '编辑资源定义 YAML',
      permission: 'kubernetes:crd:edit',
      activeCode: 'kubernetes:crd',
    },
  },
]
