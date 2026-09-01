import type { RouteRecordRaw } from 'vue-router'

export const clusterRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters',
    name: 'kubernetes:cluster',
    component: () => import('@/views/kubernetes/cluster/index.vue'),
    meta: {
      title: '集群',
      permission: 'kubernetes:cluster:view',
      activeCode: 'kubernetes:cluster',
    },
  },
  {
    path: '/kubernetes/clusters/register',
    name: 'kubernetes:cluster:register',
    component: () => import('@/views/kubernetes/cluster/register/index.vue'),
    meta: {
      title: '纳管集群',
      permission: 'kubernetes:cluster:create',
      activeCode: 'kubernetes:cluster',
    },
  },
  {
    path: '/kubernetes/clusters/:uid/edit',
    name: 'kubernetes:cluster:edit',
    component: () => import('@/views/kubernetes/cluster/edit/index.vue'),
    meta: {
      title: '编辑集群',
      permission: 'kubernetes:cluster:edit',
      activeCode: 'kubernetes:cluster',
    },
  },
]
