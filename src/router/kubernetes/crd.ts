import type { RouteRecordRaw } from 'vue-router'

export const crdRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/crd',
    name: 'kubernetes:crd',
    component: () => import('@/views/kubernetes/crd/index.vue'),
    meta: {
      title: '资源定义',
      icon: 'Coin'
    }
  }
]
