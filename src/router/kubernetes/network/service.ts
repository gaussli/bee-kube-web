import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const serviceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/services',
    name: KubernetesRouteNames.Service.List,
    component: () => import('@/views/kubernetes/network/service/index.vue'),
    meta: {
      title: '服务',
      permission: 'kubernetes:network:service:view',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    name: KubernetesRouteNames.Service.Detail,
    component: () => import('@/views/kubernetes/network/service/detail/index.vue'),
    meta: {
      title: '服务详情',
      permission: 'kubernetes:network:service:view',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/services/create',
    name: KubernetesRouteNames.Service.Create,
    component: () => import('@/views/kubernetes/network/service/create/index.vue'),
    meta: {
      title: '创建服务',
      permission: 'kubernetes:network:service:create',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/services/create/yaml',
    name: KubernetesRouteNames.Service.CreateYaml,
    component: () => import('@/views/kubernetes/network/service/create/yaml.vue'),
    meta: {
      title: '创建服务 YAML',
      permission: 'kubernetes:network:service:create',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit',
    name: KubernetesRouteNames.Service.Edit,
    component: () => import('@/views/kubernetes/network/service/edit/index.vue'),
    meta: {
      title: '编辑服务',
      permission: 'kubernetes:network:service:edit',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/edit/yaml',
    name: KubernetesRouteNames.Service.EditYaml,
    component: () => import('@/views/kubernetes/network/service/edit/yaml.vue'),
    meta: {
      title: '编辑服务 YAML',
      permission: 'kubernetes:network:service:edit',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/labels',
    name: KubernetesRouteNames.Service.ManageLabels,
    component: () => import('@/views/kubernetes/network/service/edit/labels.vue'),
    meta: {
      title: '配置服务标签',
      permission: 'kubernetes:network:service:edit',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/annotations',
    name: KubernetesRouteNames.Service.ManageAnnotations,
    component: () => import('@/views/kubernetes/network/service/edit/annotations.vue'),
    meta: {
      title: '配置服务注解',
      permission: 'kubernetes:network:service:edit',
      activeCode: KubernetesRouteNames.Service.List,
    },
  },
]
