import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const deploymentRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/deployments',
    name: KubernetesRouteNames.Deployment.List,
    component: () => import('@/views/kubernetes/workload/deployment/index.vue'),
    meta: {
      title: '无状态应用',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    name: KubernetesRouteNames.Deployment.Detail,
    component: () => import('@/views/kubernetes/workload/deployment/detail/index.vue'),
    meta: {
      title: '无状态应用详情',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/deployments/create',
    name: KubernetesRouteNames.Deployment.Create,
    component: () => import('@/views/kubernetes/workload/deployment/create/index.vue'),
    meta: {
      title: '创建无状态应用',
      permission: 'kubernetes:workload:deployment:create',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/deployments/create/yaml',
    name: KubernetesRouteNames.Deployment.CreateYaml,
    component: () => import('@/views/kubernetes/workload/deployment/create/yaml.vue'),
    meta: {
      title: '创建无状态应用 YAML',
      permission: 'kubernetes:workload:deployment:create',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit',
    name: KubernetesRouteNames.Deployment.Edit,
    component: () => import('@/views/kubernetes/workload/deployment/edit/index.vue'),
    meta: {
      title: '编辑无状态应用',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/yaml',
    name: KubernetesRouteNames.Deployment.EditYaml,
    component: () => import('@/views/kubernetes/workload/deployment/edit/yaml.vue'),
    meta: {
      title: '编辑无状态应用 YAML',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels',
    name: KubernetesRouteNames.Deployment.ManageLabels,
    component: () => import('@/views/kubernetes/workload/deployment/edit/labels.vue'),
    meta: {
      title: '配置无状态应用标签',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations',
    name: KubernetesRouteNames.Deployment.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/workload/deployment/edit/annotations.vue'),
    meta: {
      title: '配置无状态应用注解',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: KubernetesRouteNames.Deployment.List,
    },
  },
]
