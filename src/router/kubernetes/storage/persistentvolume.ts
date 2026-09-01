import type { RouteRecordRaw } from 'vue-router'

export const persistentVolumeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    name: 'kubernetes:storage:persistentvolume',
    component: () => import('@/views/kubernetes/storage/persistentvolume/index.vue'),
    meta: {
      title: '持久卷',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    name: 'kubernetes:storage:persistentvolume:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolume/detail/index.vue'),
    meta: {
      title: '持久卷详情',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/create',
    name: 'kubernetes:storage:persistentvolume:create',
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/index.vue'),
    meta: {
      title: '创建持久卷',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/create/yaml',
    name: 'kubernetes:storage:persistentvolume:create:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/yaml.vue'),
    meta: {
      title: '创建持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit',
    name: 'kubernetes:storage:persistentvolume:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/index.vue'),
    meta: {
      title: '编辑持久卷',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit/yaml',
    name: 'kubernetes:storage:persistentvolume:edit:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: 'kubernetes:storage:persistentvolume',
    },
  },
]
