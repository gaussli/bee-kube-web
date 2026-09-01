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
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/labels',
    name: 'kubernetes:node:edit:labels',
    component: () => import('@/views/kubernetes/node/edit/label.vue'),
    meta: {
      title: '节点配置标签',
      permission: 'kubernetes:node:edit',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/annotations',
    name: 'kubernetes:node:edit:annotations',
    component: () => import('@/views/kubernetes/node/edit/annotation.vue'),
    meta: {
      title: '节点配置注解',
      permission: 'kubernetes:node:edit',
      activeCode: 'kubernetes:node',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/nodes/:name/topologies',
    name: 'kubernetes:node:edit:topologies',
    component: () => import('@/views/kubernetes/node/edit/topology.vue'),
    meta: {
      title: '节点配置拓扑',
      permission: 'kubernetes:node:edit',
      activeCode: 'kubernetes:node',
    },
  },
]
