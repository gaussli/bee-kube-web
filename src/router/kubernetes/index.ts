import type { RouteRecordRaw } from 'vue-router'
import { clusterRoutes } from './cluster'
import { configRoutes } from './config'
import { crdRoutes } from './crd'
import { namespaceRoutes } from './namespace'
import { networkRoutes } from './network'
import { nodeRoutes } from './node'
import { securityRoutes } from './security'
import { storageRoutes } from './storage'
import { workloadRoutes } from './workload'

export const kubernetesRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes',
    name: 'kubernetes',
    redirect: '/kubernetes/dashboard'
  },
  {
    path: '/kubernetes/dashboard',
    name: 'kubernetes:dashboard',
    component: () => import('@/views/kubernetes/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'Odometer'
    }
  },
  ...clusterRoutes,
  ...nodeRoutes,
  ...namespaceRoutes,
  ...workloadRoutes,
  ...configRoutes,
  ...networkRoutes,
  ...storageRoutes,
  ...crdRoutes,
  ...securityRoutes
]
