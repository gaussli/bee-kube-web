import type { RouteRecordRaw } from 'vue-router'

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/roles',
    name: 'kubernetes:security:role',
    component: () => import('@/views/kubernetes/security/role/index.vue'),
    meta: {
      title: '角色',
      permission: 'kubernetes:security:role:view',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    name: 'kubernetes:security:role:detail',
    component: () => import('@/views/kubernetes/security/role/detail/index.vue'),
    meta: {
      title: '角色详情',
      permission: 'kubernetes:security:role:view',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/roles/create',
    name: 'kubernetes:security:role:create',
    component: () => import('@/views/kubernetes/security/role/create/index.vue'),
    meta: {
      title: '创建角色',
      permission: 'kubernetes:security:role:create',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/roles/create/yaml',
    name: 'kubernetes:security:role:create:yaml',
    component: () => import('@/views/kubernetes/security/role/create/yaml.vue'),
    meta: {
      title: '创建角色 YAML',
      permission: 'kubernetes:security:role:create',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/edit',
    name: 'kubernetes:security:role:edit',
    component: () => import('@/views/kubernetes/security/role/edit/index.vue'),
    meta: {
      title: '编辑角色',
      permission: 'kubernetes:security:role:edit',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/edit/yaml',
    name: 'kubernetes:security:role:edit:yaml',
    component: () => import('@/views/kubernetes/security/role/edit/yaml.vue'),
    meta: {
      title: '编辑角色 YAML',
      permission: 'kubernetes:security:role:edit',
      activeCode: 'kubernetes:security:role',
    },
  },
]
