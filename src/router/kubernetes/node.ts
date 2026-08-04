import type { RouteRecordRaw } from 'vue-router'

export const nodeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/nodes',
    name: 'kubernetes:node',
    component: () => import('@/views/kubernetes/node/index.vue'),
    meta: {
      title: '节点',
      icon: 'Box',
      permission: 'kubernetes:node:view',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/nodes/detail',
    name: 'kubernetes:node:detail',
    component: () => import('@/views/kubernetes/node/detail/index.vue'),
    meta: {
      title: '节点详情',
      icon: 'Box',
      permission: 'kubernetes:node:view',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/nodes/edit',
    name: 'kubernetes:node:edit',
    component: () => import('@/views/kubernetes/node/edit/index.vue'),
    meta: {
      title: '编辑节点',
      icon: 'Box',
      permission: 'kubernetes:node:edit',
      activeCode: 'kubernetes:node',
    },
  },
]
