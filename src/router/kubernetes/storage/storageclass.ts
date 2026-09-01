import type { RouteRecordRaw } from 'vue-router'

export const storageClassRoutes: RouteRecordRaw[] = [
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
