import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const storageClassRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses',
    name: KubernetesRouteNames.StorageClass.List,
    component: () => import('@/views/kubernetes/storage/storageclass/index.vue'),
    meta: {
      title: '存储类',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    name: KubernetesRouteNames.StorageClass.Detail,
    component: () => import('@/views/kubernetes/storage/storageclass/detail/index.vue'),
    meta: {
      title: '存储类详情',
      permission: 'kubernetes:storage:storageclass:view',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/create',
    name: KubernetesRouteNames.StorageClass.Create,
    component: () => import('@/views/kubernetes/storage/storageclass/create/index.vue'),
    meta: {
      title: '创建存储类',
      permission: 'kubernetes:storage:storageclass:create',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/create/yaml',
    name: KubernetesRouteNames.StorageClass.CreateYaml,
    component: () => import('@/views/kubernetes/storage/storageclass/create/yaml.vue'),
    meta: {
      title: '创建存储类 YAML',
      permission: 'kubernetes:storage:storageclass:create',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/:name/edit',
    name: KubernetesRouteNames.StorageClass.Edit,
    component: () => import('@/views/kubernetes/storage/storageclass/edit/index.vue'),
    meta: {
      title: '编辑存储类',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/:name/edit/yaml',
    name: KubernetesRouteNames.StorageClass.EditYaml,
    component: () => import('@/views/kubernetes/storage/storageclass/edit/yaml.vue'),
    meta: {
      title: '编辑存储类 YAML',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/:name/labels',
    name: KubernetesRouteNames.StorageClass.ManageLabels,
    component: () => import('@/views/kubernetes/storage/storageclass/edit/labels.vue'),
    meta: {
      title: '配置存储类标签',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/storageclasses/:name/annotations',
    name: KubernetesRouteNames.StorageClass.ManageAnnotations,
    component: () => import('@/views/kubernetes/storage/storageclass/edit/annotations.vue'),
    meta: {
      title: '配置存储类注解',
      permission: 'kubernetes:storage:storageclass:edit',
      activeCode: KubernetesRouteNames.StorageClass.List,
    },
  },
]
