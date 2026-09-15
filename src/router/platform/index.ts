import type { RouteRecordRaw } from 'vue-router'

import { systemRoutes } from './system'

export const platformRoutes: RouteRecordRaw[] = [
  {
    path: '/platform',
    name: 'platform',
    redirect: '/platform/dashboard',
  },
  {
    path: '/platform/dashboard',
    name: 'platform:dashboard',
    component: () => import('@/views/platform/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  ...systemRoutes,
]
