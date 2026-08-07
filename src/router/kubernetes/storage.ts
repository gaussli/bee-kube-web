import type { RouteRecordRaw } from 'vue-router'

const persistentVolumeClaimRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims',
    name: 'kubernetes:storage:persistentvolumeclaim',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/index.vue'),
    meta: {
      title: '持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims/:name',
    name: 'kubernetes:storage:persistentvolumeclaim:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/detail/index.vue'),
    meta: {
      title: '持久卷声明详情',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims/create',
    name: 'kubernetes:storage:persistentvolumeclaim:create',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/index.vue'),
    meta: {
      title: '创建持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims/create/yaml',
    name: 'kubernetes:storage:persistentvolumeclaim:create:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/yaml.vue'),
    meta: {
      title: '创建持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims/:name/edit',
    name: 'kubernetes:storage:persistentvolumeclaim:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/index.vue'),
    meta: {
      title: '编辑持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims/:name/edit/yaml',
    name: 'kubernetes:storage:persistentvolumeclaim:edit:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
]

const persistentVolumeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes',
    name: 'kubernetes:storage:persistentvolume',
    component: () => import('@/views/kubernetes/storage/persistentvolume/index.vue'),
    meta: {
      title: '持久卷',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes/:name',
    name: 'kubernetes:storage:persistentvolume:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolume/detail/index.vue'),
    meta: {
      title: '持久卷详情',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes/create',
    name: 'kubernetes:storage:persistentvolume:create',
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/index.vue'),
    meta: {
      title: '创建持久卷',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes/create/yaml',
    name: 'kubernetes:storage:persistentvolume:create:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/yaml.vue'),
    meta: {
      title: '创建持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes/:name/edit',
    name: 'kubernetes:storage:persistentvolume:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/index.vue'),
    meta: {
      title: '编辑持久卷',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/persistentvolumes/:name/edit/yaml',
    name: 'kubernetes:storage:persistentvolume:edit:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
]

const storageclassRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses',
    name: 'kubernetes:storage:storageclass',
    component: () => import('@/views/kubernetes/storage/storageclass/index.vue'),
    meta: {
      title: '存储类',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses/:name',
    name: 'kubernetes:storage:storageclass:detail',
    component: () => import('@/views/kubernetes/storage/storageclass/detail/index.vue'),
    meta: {
      title: '存储类详情',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses/create',
    name: 'kubernetes:storage:storageclass:create',
    component: () => import('@/views/kubernetes/storage/storageclass/create/index.vue'),
    meta: {
      title: '创建存储类',
      permission: 'kubernetes:storage:storageclass:create',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses/create/yaml',
    name: 'kubernetes:storage:storageclass:create:yaml',
    component: () => import('@/views/kubernetes/storage/storageclass/create/yaml.vue'),
    meta: {
      title: '创建存储类 YAML',
      permission: 'kubernetes:storage:storageclass:create',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses/:name/edit',
    name: 'kubernetes:storage:storageclass:edit',
    component: () => import('@/views/kubernetes/storage/storageclass/edit/index.vue'),
    meta: {
      title: '编辑存储类',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storage/storageclasses/:name/edit/yaml',
    name: 'kubernetes:storage:storageclass:edit:yaml',
    component: () => import('@/views/kubernetes/storage/storageclass/edit/yaml.vue'),
    meta: {
      title: '编辑存储类 YAML',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: 'kubernetes:storage:storageclass',
    },
  },
]

export const storageRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storage',
    name: 'kubernetes:storage',
    redirect: '/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaims',
    meta: {
      title: '存储',
    },
    children: [...persistentVolumeClaimRoutes, ...persistentVolumeRoutes, ...storageclassRoutes],
  },
]
