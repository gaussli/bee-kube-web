import type { RouteRecordRaw } from 'vue-router'

export const secretRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/secrets',
    name: 'kubernetes:config:secret',
    component: () => import('@/views/kubernetes/config/secret/index.vue'),
    meta: {
      title: '密钥',
      permission: 'kubernetes:config:secret:view',
      activeCode: 'kubernetes:config:secret',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    name: 'kubernetes:config:secret:detail',
    component: () => import('@/views/kubernetes/config/secret/detail/index.vue'),
    meta: {
      title: '密钥详情',
      permission: 'kubernetes:config:secret:view',
      activeCode: 'kubernetes:config:secret',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/secrets/create',
    name: 'kubernetes:config:secret:create',
    component: () => import('@/views/kubernetes/config/secret/create/index.vue'),
    meta: {
      title: '创建密钥',
      permission: 'kubernetes:config:secret:create',
      activeCode: 'kubernetes:config:secret',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/secrets/create/yaml',
    name: 'kubernetes:config:secret:create:yaml',
    component: () => import('@/views/kubernetes/config/secret/create/yaml.vue'),
    meta: {
      title: '创建密钥 YAML',
      permission: 'kubernetes:config:secret:create',
      activeCode: 'kubernetes:config:secret',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit',
    name: 'kubernetes:config:secret:edit',
    component: () => import('@/views/kubernetes/config/secret/edit/index.vue'),
    meta: {
      title: '编辑密钥',
      permission: 'kubernetes:config:secret:edit',
      activeCode: 'kubernetes:config:secret',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/yaml',
    name: 'kubernetes:config:secret:edit:yaml',
    component: () => import('@/views/kubernetes/config/secret/edit/yaml.vue'),
    meta: {
      title: '编辑密钥 YAML',
      permission: 'kubernetes:config:secret:edit',
      activeCode: 'kubernetes:config:secret',
    },
  },
]
