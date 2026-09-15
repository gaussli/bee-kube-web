import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const daemonSetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets',
    name: KubernetesRouteNames.DaemonSet.List,
    component: () => import('@/views/kubernetes/workload/daemonset/index.vue'),
    meta: {
      title: '守护进程集',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    name: KubernetesRouteNames.DaemonSet.Detail,
    component: () => import('@/views/kubernetes/workload/daemonset/detail/index.vue'),
    meta: {
      title: '守护进程集详情',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets/create',
    name: KubernetesRouteNames.DaemonSet.Create,
    component: () => import('@/views/kubernetes/workload/daemonset/create/index.vue'),
    meta: {
      title: '创建守护进程集',
      permission: 'kubernetes:workload:daemonset:create',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets/create/yaml',
    name: KubernetesRouteNames.DaemonSet.CreateYaml,
    component: () => import('@/views/kubernetes/workload/daemonset/create/yaml.vue'),
    meta: {
      title: '创建守护进程集 YAML',
      permission: 'kubernetes:workload:daemonset:create',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit',
    name: KubernetesRouteNames.DaemonSet.Edit,
    component: () => import('@/views/kubernetes/workload/daemonset/edit/index.vue'),
    meta: {
      title: '编辑守护进程集',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit/yaml',
    name: KubernetesRouteNames.DaemonSet.EditYaml,
    component: () => import('@/views/kubernetes/workload/daemonset/edit/yaml.vue'),
    meta: {
      title: '编辑守护进程集 YAML',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels',
    name: KubernetesRouteNames.DaemonSet.ManageLabels,
    component: () => import('@/views/kubernetes/workload/daemonset/edit/labels.vue'),
    meta: {
      title: '配置守护进程集标签',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations',
    name: KubernetesRouteNames.DaemonSet.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/workload/daemonset/edit/annotations.vue'),
    meta: {
      title: '配置守护进程集注解',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: KubernetesRouteNames.DaemonSet.List,
    },
  },
]
