import type { RouteRecordRaw } from 'vue-router'

export const nodeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/nodes',
    name: 'kubernetes:node',
    component: () => import('@/views/kubernetes/node/index.vue'),
    meta: {
      title: '节点',
      permission: 'kubernetes:node:view',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name',
    name: 'kubernetes:node:detail',
    component: () => import('@/views/kubernetes/node/detail/index.vue'),
    meta: {
      title: '节点详情',
      permission: 'kubernetes:node:view',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/edit',
    name: 'kubernetes:node:edit',
    component: () => import('@/views/kubernetes/node/edit/index.vue'),
    meta: {
      title: '编辑节点',
      permission: 'kubernetes:node:edit',
      activeCode: 'kubernetes:node',
    },
  },
]
