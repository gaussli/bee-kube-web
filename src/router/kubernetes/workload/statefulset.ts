import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const statefulSetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets',
    name: KubernetesRouteNames.StatefulSet.List,
    component: () => import('@/views/kubernetes/workload/statefulset/index.vue'),
    meta: {
      title: '有状态应用',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    name: KubernetesRouteNames.StatefulSet.Detail,
    component: () => import('@/views/kubernetes/workload/statefulset/detail/index.vue'),
    meta: {
      title: '有状态应用详情',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets/create',
    name: KubernetesRouteNames.StatefulSet.Create,
    component: () => import('@/views/kubernetes/workload/statefulset/create/index.vue'),
    meta: {
      title: '创建有状态应用',
      permission: 'kubernetes:workload:statefulset:create',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets/create/yaml',
    name: KubernetesRouteNames.StatefulSet.CreateYaml,
    component: () => import('@/views/kubernetes/workload/statefulset/create/yaml.vue'),
    meta: {
      title: '创建有状态应用 YAML',
      permission: 'kubernetes:workload:statefulset:create',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit',
    name: KubernetesRouteNames.StatefulSet.Edit,
    component: () => import('@/views/kubernetes/workload/statefulset/edit/index.vue'),
    meta: {
      title: '编辑有状态应用',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit/yaml',
    name: KubernetesRouteNames.StatefulSet.EditYaml,
    component: () => import('@/views/kubernetes/workload/statefulset/edit/yaml.vue'),
    meta: {
      title: '编辑有状态应用 YAML',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels',
    name: KubernetesRouteNames.StatefulSet.ManageLabels,
    component: () => import('@/views/kubernetes/workload/statefulset/edit/labels.vue'),
    meta: {
      title: '配置有状态应用标签',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations',
    name: KubernetesRouteNames.StatefulSet.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/workload/statefulset/edit/annotations.vue'),
    meta: {
      title: '配置有状态应用注解',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: KubernetesRouteNames.StatefulSet.List,
    },
  },
]
