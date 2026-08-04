import type { RouteRecordRaw } from 'vue-router'

export const clusterRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/cluster',
    name: 'kubernetes:cluster',
    component: () => import('@/views/kubernetes/cluster/index.vue'),
    meta: {
      title: '集群',
      icon: 'Grid',
      permission: 'kubernetes:cluster:view',
      activeCode: 'kubernetes:cluster',
    },
  },
  {
    path: '/kubernetes/cluster/create',
    name: 'kubernetes:cluster:create',
    component: () => import('@/views/kubernetes/cluster/create/index.vue'),
    meta: {
      title: '创建集群',
      icon: 'Grid',
      permission: 'kubernetes:cluster:create',
      activeCode: 'kubernetes:cluster',
    },
  },
  {
    path: '/kubernetes/cluster/edit',
    name: 'kubernetes:cluster:edit',
    component: () => import('@/views/kubernetes/cluster/edit/index.vue'),
    meta: {
      title: '编辑集群',
      icon: 'Grid',
      permission: 'kubernetes:cluster:edit',
      activeCode: 'kubernetes:cluster',
    },
  },
]
