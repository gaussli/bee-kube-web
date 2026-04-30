import type { RouteRecordRaw } from 'vue-router'

const persistentVolumeClaimRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/storage/persistentvolumeclaim',
    name: 'kubernetes:storage:persistentvolumeclaim',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/index.vue'),
    meta: {
      title: '持久卷声明',
      icon: 'Document',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolumeclaim/create',
    name: 'kubernetes:storage:persistentvolumeclaim:create',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/index.vue'),
    meta: {
      title: '创建持久卷声明',
      icon: 'Document',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: 'kubernetes:storage:persistentvolumeclaim'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolumeclaim/edit',
    name: 'kubernetes:storage:persistentvolumeclaim:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/index.vue'),
    meta: {
      title: '编辑持久卷声明',
      icon: 'Document',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: 'kubernetes:storage:persistentvolumeclaim'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolumeclaim/detail',
    name: 'kubernetes:storage:persistentvolumeclaim:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/detail/index.vue'),
    meta: {
      title: '持久卷声明详情',
      icon: 'Document',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim'
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
      icon: 'Files',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolume/create',
    name: 'kubernetes:storage:persistentvolume:create',
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/index.vue'),
    meta: {
      title: '创建持久卷',
      icon: 'Files',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: 'kubernetes:storage:persistentvolume'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolume/edit',
    name: 'kubernetes:storage:persistentvolume:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/index.vue'),
    meta: {
      title: '编辑持久卷',
      icon: 'Files',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: 'kubernetes:storage:persistentvolume'
    }
  },
  {
    path: '/kubernetes/storage/persistentvolume/detail',
    name: 'kubernetes:storage:persistentvolume:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolume/detail/index.vue'),
    meta: {
      title: '持久卷详情',
      icon: 'Files',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume'
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
      icon: 'Grid',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: 'kubernetes:storage:storageclass'
    }
  },
  {
    path: '/kubernetes/storage/storageclass/create',
    name: 'kubernetes:storage:storageclass:create',
    component: () => import('@/views/kubernetes/storage/storageclass/create/index.vue'),
    meta: {
      title: '创建存储类',
      icon: 'Grid',
      permission: 'kubernetes:storage:storageclass:create',
      activeCode: 'kubernetes:storage:storageclass'
    }
  },
  {
    path: '/kubernetes/storage/storageclass/edit',
    name: 'kubernetes:storage:storageclass:edit',
    component: () => import('@/views/kubernetes/storage/storageclass/edit/index.vue'),
    meta: {
      title: '编辑存储类',
      icon: 'Grid',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: 'kubernetes:storage:storageclass'
    }
  },
  {
    path: '/kubernetes/storage/storageclass/detail',
    name: 'kubernetes:storage:storageclass:detail',
    component: () => import('@/views/kubernetes/storage/storageclass/detail/index.vue'),
    meta: {
      title: '存储类详情',
      icon: 'Grid',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: 'kubernetes:storage:storageclass'
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
