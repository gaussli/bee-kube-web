import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const networkPolicyRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies',
    name: KubernetesRouteNames.NetworkPolicy.List,
    component: () => import('@/views/kubernetes/network/networkpolicy/index.vue'),
    meta: {
      title: '网络策略',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    name: KubernetesRouteNames.NetworkPolicy.Detail,
    component: () => import('@/views/kubernetes/network/networkpolicy/detail/index.vue'),
    meta: {
      title: '网络策略详情',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies/create',
    name: KubernetesRouteNames.NetworkPolicy.Create,
    component: () => import('@/views/kubernetes/network/networkpolicy/create/index.vue'),
    meta: {
      title: '创建网络策略',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies/create/yaml',
    name: KubernetesRouteNames.NetworkPolicy.CreateYaml,
    component: () => import('@/views/kubernetes/network/networkpolicy/create/yaml.vue'),
    meta: {
      title: '创建网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit',
    name: KubernetesRouteNames.NetworkPolicy.Edit,
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/index.vue'),
    meta: {
      title: '编辑网络策略',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit/yaml',
    name: KubernetesRouteNames.NetworkPolicy.EditYaml,
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/yaml.vue'),
    meta: {
      title: '编辑网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/labels',
    name: KubernetesRouteNames.NetworkPolicy.ManageLabels,
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/labels.vue'),
    meta: {
      title: '配置网络策略标签',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/annotations',
    name: KubernetesRouteNames.NetworkPolicy.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/annotations.vue'),
    meta: {
      title: '配置网络策略注解',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: KubernetesRouteNames.NetworkPolicy.List,
    },
  },
]
