import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const persistentVolumeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    name: KubernetesRouteNames.PersistentVolume.List,
    component: () => import('@/views/kubernetes/storage/persistentvolume/index.vue'),
    meta: {
      title: '持久卷',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    name: KubernetesRouteNames.PersistentVolume.Detail,
    component: () => import('@/views/kubernetes/storage/persistentvolume/detail/index.vue'),
    meta: {
      title: '持久卷详情',
      permission: 'kubernetes:storage:persistentvolume:view',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/create',
    name: KubernetesRouteNames.PersistentVolume.Create,
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/index.vue'),
    meta: {
      title: '创建持久卷',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/create/yaml',
    name: KubernetesRouteNames.PersistentVolume.CreateYaml,
    component: () => import('@/views/kubernetes/storage/persistentvolume/create/yaml.vue'),
    meta: {
      title: '创建持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:create',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit',
    name: KubernetesRouteNames.PersistentVolume.Edit,
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/index.vue'),
    meta: {
      title: '编辑持久卷',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/edit/yaml',
    name: KubernetesRouteNames.PersistentVolume.EditYaml,
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷 YAML',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/labels',
    name: KubernetesRouteNames.PersistentVolume.ManageLabels,
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/labels.vue'),
    meta: {
      title: '配置持久卷标签',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/annotations',
    name: KubernetesRouteNames.PersistentVolume.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/storage/persistentvolume/edit/annotations.vue'),
    meta: {
      title: '配置持久卷注解',
      permission: 'kubernetes:storage:persistentvolume:edit',
      activeCode: KubernetesRouteNames.PersistentVolume.List,
    },
  },
]
