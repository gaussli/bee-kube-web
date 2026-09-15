import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const secretRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/secrets',
    name: KubernetesRouteNames.Secret.List,
    component: () => import('@/views/kubernetes/config/secret/index.vue'),
    meta: {
      title: '密钥',
      permission: 'kubernetes:config:secret:view',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    name: KubernetesRouteNames.Secret.Detail,
    component: () => import('@/views/kubernetes/config/secret/detail/index.vue'),
    meta: {
      title: '密钥详情',
      permission: 'kubernetes:config:secret:view',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/secrets/create',
    name: KubernetesRouteNames.Secret.Create,
    component: () => import('@/views/kubernetes/config/secret/create/index.vue'),
    meta: {
      title: '创建密钥',
      permission: 'kubernetes:config:secret:create',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/secrets/create/yaml',
    name: KubernetesRouteNames.Secret.CreateYaml,
    component: () => import('@/views/kubernetes/config/secret/create/yaml.vue'),
    meta: {
      title: '创建密钥 YAML',
      permission: 'kubernetes:config:secret:create',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit',
    name: KubernetesRouteNames.Secret.Edit,
    component: () => import('@/views/kubernetes/config/secret/edit/index.vue'),
    meta: {
      title: '编辑密钥',
      permission: 'kubernetes:config:secret:edit',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/yaml',
    name: KubernetesRouteNames.Secret.EditYaml,
    component: () => import('@/views/kubernetes/config/secret/edit/yaml.vue'),
    meta: {
      title: '编辑密钥 YAML',
      permission: 'kubernetes:config:secret:edit',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels',
    name: KubernetesRouteNames.Secret.ManageLabels,
    component: () => import('@/views/kubernetes/config/secret/edit/labels.vue'),
    meta: {
      title: '配置密钥标签',
      permission: 'kubernetes:config:secret:edit',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations',
    name: KubernetesRouteNames.Secret.ManageAnnotations,
    component: () => import('@/views/kubernetes/config/secret/edit/annotations.vue'),
    meta: {
      title: '配置密钥注解',
      permission: 'kubernetes:config:secret:edit',
      activeCode: KubernetesRouteNames.Secret.List,
    },
  },
]
