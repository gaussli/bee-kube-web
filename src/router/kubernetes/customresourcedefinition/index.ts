import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const customResourceDefinitionRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions',
    name: KubernetesRouteNames.CustomResourceDefinition.List,
    component: () => import('@/views/kubernetes/customresourcedefinition/index.vue'),
    meta: {
      title: '资源定义',
      permission: 'kubernetes:storage:customresourcedefinition:view',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name',
    name: KubernetesRouteNames.CustomResourceDefinition.Detail,
    component: () => import('@/views/kubernetes/customresourcedefinition/detail/index.vue'),
    meta: {
      title: '资源定义详情',
      permission: 'kubernetes:storage:customresourcedefinition:view',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/create',
    name: KubernetesRouteNames.CustomResourceDefinition.Create,
    component: () => import('@/views/kubernetes/customresourcedefinition/create/index.vue'),
    meta: {
      title: '创建资源定义',
      permission: 'kubernetes:storage:customresourcedefinition:create',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/create/yaml',
    name: KubernetesRouteNames.CustomResourceDefinition.CreateYaml,
    component: () => import('@/views/kubernetes/customresourcedefinition/create/yaml.vue'),
    meta: {
      title: '创建资源定义 YAML',
      permission: 'kubernetes:storage:customresourcedefinition:create',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/edit',
    name: KubernetesRouteNames.CustomResourceDefinition.Edit,
    component: () => import('@/views/kubernetes/customresourcedefinition/edit/index.vue'),
    meta: {
      title: '编辑资源定义',
      permission: 'kubernetes:storage:customresourcedefinition:edit',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/edit/yaml',
    name: KubernetesRouteNames.CustomResourceDefinition.EditYaml,
    component: () => import('@/views/kubernetes/customresourcedefinition/edit/yaml.vue'),
    meta: {
      title: '编辑资源定义 YAML',
      permission: 'kubernetes:storage:customresourcedefinition:edit',
      activeCode: KubernetesRouteNames.CustomResourceDefinition.List,
    },
  },
]
