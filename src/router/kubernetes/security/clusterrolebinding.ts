import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const clusterRoleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    name: KubernetesRouteNames.ClusterRoleBinding.List,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/index.vue'),
    meta: {
      title: '集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    name: KubernetesRouteNames.ClusterRoleBinding.Detail,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/detail/index.vue'),
    meta: {
      title: '集群角色绑定详情',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/create',
    name: KubernetesRouteNames.ClusterRoleBinding.Create,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/create/index.vue'),
    meta: {
      title: '创建集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:create',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/create/yaml',
    name: KubernetesRouteNames.ClusterRoleBinding.CreateYaml,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/create/yaml.vue'),
    meta: {
      title: '创建集群角色绑定 YAML',
      permission: 'kubernetes:security:clusterrolebinding:create',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/edit',
    name: KubernetesRouteNames.ClusterRoleBinding.Edit,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/index.vue'),
    meta: {
      title: '编辑集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/edit/yaml',
    name: KubernetesRouteNames.ClusterRoleBinding.EditYaml,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/yaml.vue'),
    meta: {
      title: '编辑集群角色绑定 YAML',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels',
    name: KubernetesRouteNames.ClusterRoleBinding.ManageLabels,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/labels.vue'),
    meta: {
      title: '配置集群角色绑定标签',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations',
    name: KubernetesRouteNames.ClusterRoleBinding.ManageAnnotations,
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/annotations.vue'),
    meta: {
      title: '配置集群角色绑定注解',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: KubernetesRouteNames.ClusterRoleBinding.List,
    },
  },
]
