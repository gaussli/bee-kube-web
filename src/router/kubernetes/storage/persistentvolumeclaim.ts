import type { RouteRecordRaw } from 'vue-router'

export const persistentVolumeClaimRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims',
    name: 'kubernetes:storage:persistentvolumeclaim',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/index.vue'),
    meta: {
      title: '持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    name: 'kubernetes:storage:persistentvolumeclaim:detail',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/detail/index.vue'),
    meta: {
      title: '持久卷声明详情',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create',
    name: 'kubernetes:storage:persistentvolumeclaim:create',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/index.vue'),
    meta: {
      title: '创建持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create/yaml',
    name: 'kubernetes:storage:persistentvolumeclaim:create:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/yaml.vue'),
    meta: {
      title: '创建持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit',
    name: 'kubernetes:storage:persistentvolumeclaim:edit',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/index.vue'),
    meta: {
      title: '编辑持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit/yaml',
    name: 'kubernetes:storage:persistentvolumeclaim:edit:yaml',
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: 'kubernetes:storage:persistentvolumeclaim',
    },
  },
]
