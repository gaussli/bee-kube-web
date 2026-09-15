import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const serviceAccountRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts',
    name: KubernetesRouteNames.ServiceAccount.List,
    component: () => import('@/views/kubernetes/security/serviceaccount/index.vue'),
    meta: {
      title: '服务账号',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    name: KubernetesRouteNames.ServiceAccount.Detail,
    component: () => import('@/views/kubernetes/security/serviceaccount/detail/index.vue'),
    meta: {
      title: '服务账号详情',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts/create',
    name: KubernetesRouteNames.ServiceAccount.Create,
    component: () => import('@/views/kubernetes/security/serviceaccount/create/index.vue'),
    meta: {
      title: '创建服务账号',
      permission: 'kubernetes:security:serviceaccount:create',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts/create/yaml',
    name: KubernetesRouteNames.ServiceAccount.CreateYaml,
    component: () => import('@/views/kubernetes/security/serviceaccount/create/yaml.vue'),
    meta: {
      title: '创建服务账号 YAML',
      permission: 'kubernetes:security:serviceaccount:create',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/edit',
    name: KubernetesRouteNames.ServiceAccount.Edit,
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/index.vue'),
    meta: {
      title: '编辑服务账号',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/edit/yaml',
    name: KubernetesRouteNames.ServiceAccount.EditYaml,
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/yaml.vue'),
    meta: {
      title: '编辑服务账号 YAML',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/labels',
    name: KubernetesRouteNames.ServiceAccount.ManageLabels,
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/labels.vue'),
    meta: {
      title: '配置服务账号标签',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/annotations',
    name: KubernetesRouteNames.ServiceAccount.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/annotations.vue'),
    meta: {
      title: '配置服务账号注解',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: KubernetesRouteNames.ServiceAccount.List,
    },
  },
]
