import type { RouteRecordRaw } from 'vue-router'

const persistentVolumeClaimRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/storage/persistentvolumeclaim',
    name: 'kubernetes:storage:persistentvolumeclaim',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/index.vue'),
    meta: {
      title: '持久卷声明',
      icon: 'Document'
    }
  }
]

const persistentVolumeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/storage/persistentvolume',
    name: 'kubernetes:storage:persistentvolume',
    component: () => import('@/views/kubernetes/storage/persistentvolume/index.vue'),
    meta: {
      title: '持久卷',
      icon: 'Files'
    }
  }
]

const storageclassRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/storage/storageclass',
    name: 'kubernetes:storage:storageclass',
    component: () => import('@/views/kubernetes/storage/storageclass/index.vue'),
    meta: {
      title: '存储类',
      icon: 'Grid'
    }
  }
]

export const storageRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/storage',
    name: 'kubernetes:storage',
    redirect: '/kubernetes/storage/persistentvolumeclaim',
    meta: {
      title: '存储',
      icon: 'Box'
    },
    children: [...persistentVolumeClaimRoutes, ...persistentVolumeRoutes, ...storageclassRoutes]
  }
]
