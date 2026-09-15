import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const persistentVolumeClaimRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims',
    name: KubernetesRouteNames.PersistentVolumeClaim.List,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/index.vue'),
    meta: {
      title: '持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    name: KubernetesRouteNames.PersistentVolumeClaim.Detail,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/detail/index.vue'),
    meta: {
      title: '持久卷声明详情',
      permission: 'kubernetes:storage:persistentvolumeclaim:view',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create',
    name: KubernetesRouteNames.PersistentVolumeClaim.Create,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/index.vue'),
    meta: {
      title: '创建持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/create/yaml',
    name: KubernetesRouteNames.PersistentVolumeClaim.CreateYaml,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/create/yaml.vue'),
    meta: {
      title: '创建持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:create',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit',
    name: KubernetesRouteNames.PersistentVolumeClaim.Edit,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/index.vue'),
    meta: {
      title: '编辑持久卷声明',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/edit/yaml',
    name: KubernetesRouteNames.PersistentVolumeClaim.EditYaml,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/yaml.vue'),
    meta: {
      title: '编辑持久卷声明 YAML',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/labels',
    name: KubernetesRouteNames.PersistentVolumeClaim.ManageLabels,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/labels.vue'),
    meta: {
      title: '配置持久卷声明标签',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/annotations',
    name: KubernetesRouteNames.PersistentVolumeClaim.ManageAnnotations,
    component: () => import('@/views/kubernetes/storage/persistentvolumeclaim/edit/annotations.vue'),
    meta: {
      title: '配置持久卷声明注解',
      permission: 'kubernetes:storage:persistentvolumeclaim:edit',
      activeCode: KubernetesRouteNames.PersistentVolumeClaim.List,
    },
  },
]
