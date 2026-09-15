import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const namespaceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces',
    name: KubernetesRouteNames.Namespace.List,
    component: () => import('@/views/kubernetes/namespace/index.vue'),
    meta: {
      title: '命名空间',
      permission: 'kubernetes:namespace:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    name: KubernetesRouteNames.Namespace.Detail,
    component: () => import('@/views/kubernetes/namespace/detail/index.vue'),
    meta: {
      title: '命名空间详情',
      permission: 'kubernetes:namespace:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/create',
    name: KubernetesRouteNames.Namespace.Create,
    component: () => import('@/views/kubernetes/namespace/create/index.vue'),
    meta: {
      title: '创建命名空间',
      permission: 'kubernetes:namespace:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/create/yaml',
    name: KubernetesRouteNames.Namespace.CreateYaml,
    component: () => import('@/views/kubernetes/namespace/create/yaml.vue'),
    meta: {
      title: '创建命名空间 YAML',
      permission: 'kubernetes:namespace:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/edit',
    name: KubernetesRouteNames.Namespace.Edit,
    component: () => import('@/views/kubernetes/namespace/edit/index.vue'),
    meta: {
      title: '编辑命名空间',
      permission: 'kubernetes:namespace:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/edit/yaml',
    name: KubernetesRouteNames.Namespace.EditYaml,
    component: () => import('@/views/kubernetes/namespace/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间 YAML',
      permission: 'kubernetes:namespace:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/labels',
    name: KubernetesRouteNames.Namespace.ManageLabels,
    component: () => import('@/views/kubernetes/namespace/edit/labels.vue'),
    meta: {
      title: '配置命名空间标签',
      permission: 'kubernetes:namespace:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:name/annotations',
    name: KubernetesRouteNames.Namespace.ManageAnnotations,
    component: () => import('@/views/kubernetes/namespace/edit/annotations.vue'),
    meta: {
      title: '配置命名空间注解',
      permission: 'kubernetes:namespace:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
]
