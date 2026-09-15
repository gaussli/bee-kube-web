import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const nodeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/nodes',
    name: KubernetesRouteNames.Node.List,
    component: () => import('@/views/kubernetes/node/index.vue'),
    meta: {
      title: '节点',
      permission: 'kubernetes:node:view',
      activeCode: KubernetesRouteNames.Node.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name',
    name: KubernetesRouteNames.Node.Detail,
    component: () => import('@/views/kubernetes/node/detail/index.vue'),
    meta: {
      title: '节点详情',
      permission: 'kubernetes:node:view',
      activeCode: KubernetesRouteNames.Node.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/labels',
    name: KubernetesRouteNames.Node.ManageLabels,
    component: () => import('@/views/kubernetes/node/edit/label.vue'),
    meta: {
      title: '配置节点标签',
      permission: 'kubernetes:node:edit',
      activeCode: KubernetesRouteNames.Node.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/annotations',
    name: KubernetesRouteNames.Node.ManageAnnotations,
    component: () => import('@/views/kubernetes/node/edit/annotation.vue'),
    meta: {
      title: '配置节点注解',
      permission: 'kubernetes:node:edit',
      activeCode: KubernetesRouteNames.Node.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/topologies',
    name: KubernetesRouteNames.Node.ManageTopologies,
    component: () => import('@/views/kubernetes/node/edit/topology.vue'),
    meta: {
      title: '配置节点拓扑',
      permission: 'kubernetes:node:edit',
      activeCode: KubernetesRouteNames.Node.List,
    },
  },
]
