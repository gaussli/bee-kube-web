import type { RouteRecordRaw } from 'vue-router'

export const nodeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/node',
    name: 'kubernetes:node',
    component: () => import('@/views/kubernetes/node/index.vue'),
    meta: {
      title: '节点',
      icon: 'Box'
    }
  }
]
