import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/roles',
    name: KubernetesRouteNames.Role.List,
    component: () => import('@/views/kubernetes/security/role/index.vue'),
    meta: {
      title: '角色',
      permission: 'kubernetes:security:role:view',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    name: KubernetesRouteNames.Role.Detail,
    component: () => import('@/views/kubernetes/security/role/detail/index.vue'),
    meta: {
      title: '角色详情',
      permission: 'kubernetes:security:role:view',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/roles/create',
    name: KubernetesRouteNames.Role.Create,
    component: () => import('@/views/kubernetes/security/role/create/index.vue'),
    meta: {
      title: '创建角色',
      permission: 'kubernetes:security:role:create',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/roles/create/yaml',
    name: KubernetesRouteNames.Role.CreateYaml,
    component: () => import('@/views/kubernetes/security/role/create/yaml.vue'),
    meta: {
      title: '创建角色 YAML',
      permission: 'kubernetes:security:role:create',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/edit',
    name: KubernetesRouteNames.Role.Edit,
    component: () => import('@/views/kubernetes/security/role/edit/index.vue'),
    meta: {
      title: '编辑角色',
      permission: 'kubernetes:security:role:edit',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/edit/yaml',
    name: KubernetesRouteNames.Role.EditYaml,
    component: () => import('@/views/kubernetes/security/role/edit/yaml.vue'),
    meta: {
      title: '编辑角色 YAML',
      permission: 'kubernetes:security:role:edit',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/labels',
    name: KubernetesRouteNames.Role.ManageLabels,
    component: () => import('@/views/kubernetes/security/role/edit/labels.vue'),
    meta: {
      title: '配置角色标签',
      permission: 'kubernetes:security:role:edit',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/annotations',
    name: KubernetesRouteNames.Role.ManageAnnotations,
    component: () => import('@/views/kubernetes/security/role/edit/annotations.vue'),
    meta: {
      title: '配置角色注解',
      permission: 'kubernetes:security:role:edit',
      activeCode: KubernetesRouteNames.Role.List,
    },
  },
]
