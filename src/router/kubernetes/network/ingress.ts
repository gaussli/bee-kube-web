import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const ingressRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses',
    name: KubernetesRouteNames.Ingress.List,
    component: () => import('@/views/kubernetes/network/ingress/index.vue'),
    meta: {
      title: '入口',
      permission: 'kubernetes:network:ingress:view',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    name: KubernetesRouteNames.Ingress.Detail,
    component: () => import('@/views/kubernetes/network/ingress/detail/index.vue'),
    meta: {
      title: '入口详情',
      permission: 'kubernetes:network:ingress:view',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses/create',
    name: KubernetesRouteNames.Ingress.Create,
    component: () => import('@/views/kubernetes/network/ingress/create/index.vue'),
    meta: {
      title: '创建入口',
      permission: 'kubernetes:network:ingress:create',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/ingresses/create/yaml',
    name: KubernetesRouteNames.Ingress.CreateYaml,
    component: () => import('@/views/kubernetes/network/ingress/create/yaml.vue'),
    meta: {
      title: '创建入口 YAML',
      permission: 'kubernetes:network:ingress:create',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit',
    name: KubernetesRouteNames.Ingress.Edit,
    component: () => import('@/views/kubernetes/network/ingress/edit/index.vue'),
    meta: {
      title: '编辑入口',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/edit/yaml',
    name: KubernetesRouteNames.Ingress.EditYaml,
    component: () => import('@/views/kubernetes/network/ingress/edit/yaml.vue'),
    meta: {
      title: '编辑入口 YAML',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/labels',
    name: KubernetesRouteNames.Ingress.ManageLabels,
    component: () => import('@/views/kubernetes/network/ingress/edit/labels.vue'),
    meta: {
      title: '配置入口标签',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/annotations',
    name: KubernetesRouteNames.Ingress.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/network/ingress/edit/annotations.vue'),
    meta: {
      title: '配置入口注解',
      permission: 'kubernetes:network:ingress:edit',
      activeCode: KubernetesRouteNames.Ingress.List,
    },
  },
]
