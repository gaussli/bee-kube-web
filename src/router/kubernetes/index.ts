import type { RouteRecordRaw } from 'vue-router'

import { clusterRoutes } from './cluster/index'
import { configRoutes } from './config/index'
import { customResourceDefinitionRoutes } from './customresourcedefinition/index'
import { namespaceRoutes } from './namespace/index'
import { networkRoutes } from './network/index'
import { nodeRoutes } from './node/index'
import { securityRoutes } from './security/index'
import { storageRoutes } from './storage/index'
import { workloadRoutes } from './workload/index'

export const kubernetesRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes',
    name: 'kubernetes',
    redirect: '/kubernetes/clusters',
  },
  {
    path: '/kubernetes/clusters/:clusterUid/dashboard',
    name: 'kubernetes:dashboard',
    component: () => import('@/views/kubernetes/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  ...clusterRoutes,
  ...nodeRoutes,
  ...namespaceRoutes,
  ...workloadRoutes,
  ...configRoutes,
  ...networkRoutes,
  ...storageRoutes,
  ...customResourceDefinitionRoutes,
  ...securityRoutes,
]
