import type { RouteRecordRaw } from 'vue-router'

export const clusterRoleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles',
    name: 'kubernetes:security:clusterrole',
    component: () => import('@/views/kubernetes/security/clusterrole/index.vue'),
    meta: {
      title: '集群角色',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    name: 'kubernetes:security:clusterrole:detail',
    component: () => import('@/views/kubernetes/security/clusterrole/detail/index.vue'),
    meta: {
      title: '集群角色详情',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/create',
    name: 'kubernetes:security:clusterrole:create',
    component: () => import('@/views/kubernetes/security/clusterrole/create/index.vue'),
    meta: {
      title: '创建集群角色',
      permission: 'kubernetes:security:clusterrole:create',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/create/yaml',
    name: 'kubernetes:security:clusterrole:create:yaml',
    component: () => import('@/views/kubernetes/security/clusterrole/create/yaml.vue'),
    meta: {
      title: '创建集群角色 YAML',
      permission: 'kubernetes:security:clusterrole:create',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/edit',
    name: 'kubernetes:security:clusterrole:edit',
    component: () => import('@/views/kubernetes/security/clusterrole/edit/index.vue'),
    meta: {
      title: '编辑集群角色',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/edit/yaml',
    name: 'kubernetes:security:clusterrole:edit:yaml',
    component: () => import('@/views/kubernetes/security/clusterrole/edit/yaml.vue'),
    meta: {
      title: '编辑集群角色 YAML',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
]
