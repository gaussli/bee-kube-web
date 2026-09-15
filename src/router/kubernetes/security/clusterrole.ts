import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const clusterRoleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles',
    name: KubernetesRouteNames.ClusterRole.List,
    component: () => import('@/views/kubernetes/security/clusterrole/index.vue'),
    meta: {
      title: '集群角色',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    name: KubernetesRouteNames.ClusterRole.Detail,
    component: () => import('@/views/kubernetes/security/clusterrole/detail/index.vue'),
    meta: {
      title: '集群角色详情',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/create',
    name: KubernetesRouteNames.ClusterRole.Create,
    component: () => import('@/views/kubernetes/security/clusterrole/create/index.vue'),
    meta: {
      title: '创建集群角色',
      permission: 'kubernetes:security:clusterrole:create',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/create/yaml',
    name: KubernetesRouteNames.ClusterRole.CreateYaml,
    component: () => import('@/views/kubernetes/security/clusterrole/create/yaml.vue'),
    meta: {
      title: '创建集群角色 YAML',
      permission: 'kubernetes:security:clusterrole:create',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/edit',
    name: KubernetesRouteNames.ClusterRole.Edit,
    component: () => import('@/views/kubernetes/security/clusterrole/edit/index.vue'),
    meta: {
      title: '编辑集群角色',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/edit/yaml',
    name: KubernetesRouteNames.ClusterRole.EditYaml,
    component: () => import('@/views/kubernetes/security/clusterrole/edit/yaml.vue'),
    meta: {
      title: '编辑集群角色 YAML',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/labels',
    name: KubernetesRouteNames.ClusterRole.ManageLabels,
    component: () => import('@/views/kubernetes/security/clusterrole/edit/labels.vue'),
    meta: {
      title: '配置集群角色标签',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterroles/:name/annotations',
    name: KubernetesRouteNames.ClusterRole.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/security/clusterrole/edit/annotations.vue'),
    meta: {
      title: '配置集群角色注解',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: KubernetesRouteNames.ClusterRole.List,
    },
  },
]
