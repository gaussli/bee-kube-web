import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const roleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings',
    name: KubernetesRouteNames.RoleBinding.List,
    component: () => import('@/views/kubernetes/security/rolebinding/index.vue'),
    meta: {
      title: '角色绑定',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    name: KubernetesRouteNames.RoleBinding.Detail,
    component: () => import('@/views/kubernetes/security/rolebinding/detail/index.vue'),
    meta: {
      title: '角色绑定详情',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings/create',
    name: KubernetesRouteNames.RoleBinding.Create,
    component: () => import('@/views/kubernetes/security/rolebinding/create/index.vue'),
    meta: {
      title: '创建角色绑定',
      permission: 'kubernetes:security:rolebinding:create',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings/create/yaml',
    name: KubernetesRouteNames.RoleBinding.CreateYaml,
    component: () => import('@/views/kubernetes/security/rolebinding/create/yaml.vue'),
    meta: {
      title: '创建角色绑定 YAML',
      permission: 'kubernetes:security:rolebinding:create',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/edit',
    name: KubernetesRouteNames.RoleBinding.Edit,
    component: () => import('@/views/kubernetes/security/rolebinding/edit/index.vue'),
    meta: {
      title: '编辑角色绑定',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/edit/yaml',
    name: KubernetesRouteNames.RoleBinding.EditYaml,
    component: () => import('@/views/kubernetes/security/rolebinding/edit/yaml.vue'),
    meta: {
      title: '编辑角色绑定 YAML',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/labels',
    name: KubernetesRouteNames.RoleBinding.ManageLabels,
    component: () => import('@/views/kubernetes/security/rolebinding/edit/labels.vue'),
    meta: {
      title: '配置角色绑定标签',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/annotations',
    name: KubernetesRouteNames.RoleBinding.ManageAnnotations,
    component: () => import('@/views/kubernetes/security/rolebinding/edit/annotations.vue'),
    meta: {
      title: '配置角色绑定注解',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: KubernetesRouteNames.RoleBinding.List,
    },
  },
]
