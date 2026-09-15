import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const clusterRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters',
    name: KubernetesRouteNames.Cluster.List,
    component: () => import('@/views/kubernetes/cluster/index.vue'),
    meta: {
      title: '集群',
      permission: 'kubernetes:cluster:view',
      activeCode: KubernetesRouteNames.Cluster.List,
    },
  },
  {
    path: '/kubernetes/clusters/register',
    name: KubernetesRouteNames.Cluster.Register,
    component: () => import('@/views/kubernetes/cluster/register/index.vue'),
    meta: {
      title: '纳管集群',
      permission: 'kubernetes:cluster:create',
      activeCode: KubernetesRouteNames.Cluster.List,
    },
  },
  {
    path: '/kubernetes/clusters/:uid/edit',
    name: KubernetesRouteNames.Cluster.Edit,
    component: () => import('@/views/kubernetes/cluster/edit/index.vue'),
    meta: {
      title: '编辑集群',
      permission: 'kubernetes:cluster:edit',
      activeCode: KubernetesRouteNames.Cluster.List,
    },
  },
]
