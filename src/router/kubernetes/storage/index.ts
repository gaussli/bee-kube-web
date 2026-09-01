import type { RouteRecordRaw } from 'vue-router'

import { persistentVolumeClaimRoutes } from './persistentvolumeclaim'
import { persistentVolumeRoutes } from './persistentvolume'
import { storageClassRoutes } from './storageclass'

export const storageRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storage',
    name: 'kubernetes:storage',
    redirect: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims',
    meta: {
      title: '存储',
    },
    children: [
      ...persistentVolumeClaimRoutes,
      ...persistentVolumeRoutes,
      ...storageClassRoutes,
    ],
  },
]
