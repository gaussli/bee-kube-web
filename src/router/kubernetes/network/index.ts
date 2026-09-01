import type { RouteRecordRaw } from 'vue-router'

import { serviceRoutes } from './service'
import { ingressRoutes } from './ingress'
import { networkPolicyRoutes } from './networkpolicy'

export const networkRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/network',
    name: 'kubernetes:network',
    redirect: '/kubernetes/clusters/:clusterUid/network/services',
    meta: {
      title: '网络',
    },
    children: [...serviceRoutes, ...ingressRoutes, ...networkPolicyRoutes],
  },
]
