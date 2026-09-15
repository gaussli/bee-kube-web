import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const configMapRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps',
    name: KubernetesRouteNames.ConfigMap.List,
    component: () => import('@/views/kubernetes/config/configmap/index.vue'),
    meta: {
      title: '配置映射',
      permission: 'kubernetes:config:configmap:view',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    name: KubernetesRouteNames.ConfigMap.Detail,
    component: () => import('@/views/kubernetes/config/configmap/detail/index.vue'),
    meta: {
      title: '配置映射详情',
      permission: 'kubernetes:config:configmap:view',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps/create',
    name: KubernetesRouteNames.ConfigMap.Create,
    component: () => import('@/views/kubernetes/config/configmap/create/index.vue'),
    meta: {
      title: '创建配置映射',
      permission: 'kubernetes:config:configmap:create',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps/create/yaml',
    name: KubernetesRouteNames.ConfigMap.CreateYaml,
    component: () => import('@/views/kubernetes/config/configmap/create/yaml.vue'),
    meta: {
      title: '创建配置映射 YAML',
      permission: 'kubernetes:config:configmap:create',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit',
    name: KubernetesRouteNames.ConfigMap.Edit,
    component: () => import('@/views/kubernetes/config/configmap/edit/index.vue'),
    meta: {
      title: '编辑配置映射',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/yaml',
    name: KubernetesRouteNames.ConfigMap.EditYaml,
    component: () => import('@/views/kubernetes/config/configmap/edit/yaml.vue'),
    meta: {
      title: '编辑配置映射 YAML',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/labels',
    name: KubernetesRouteNames.ConfigMap.ManageLabels,
    component: () => import('@/views/kubernetes/config/configmap/edit/labels.vue'),
    meta: {
      title: '配置配置映射标签',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/annotations',
    name: KubernetesRouteNames.ConfigMap.ManageAnnotations,
    component: () => import('@/views/kubernetes/config/configmap/edit/annotations.vue'),
    meta: {
      title: '配置配置映射注解',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: KubernetesRouteNames.ConfigMap.List,
    },
  },
]
