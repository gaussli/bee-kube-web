import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const limitRangeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/limitranges',
    name: KubernetesRouteNames.LimitRange.List,
    component: () => import('@/views/kubernetes/limitrange/index.vue'),
    meta: {
      title: '命名空间资源限制',
      permission: 'kubernetes:limitrange:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name',
    name: KubernetesRouteNames.LimitRange.Detail,
    component: () => import('@/views/kubernetes/limitrange/detail/index.vue'),
    meta: {
      title: '命名空间资源限制详情',
      permission: 'kubernetes:limitrange:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/limitranges/create',
    name: KubernetesRouteNames.LimitRange.Create,
    component: () => import('@/views/kubernetes/limitrange/create/index.vue'),
    meta: {
      title: '创建命名空间资源限制',
      permission: 'kubernetes:limitrange:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/limitranges/create/yaml',
    name: KubernetesRouteNames.LimitRange.CreateYaml,
    component: () => import('@/views/kubernetes/limitrange/create/yaml.vue'),
    meta: {
      title: '创建命名空间资源限制 YAML',
      permission: 'kubernetes:limitrange:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/edit',
    name: KubernetesRouteNames.LimitRange.Edit,
    component: () => import('@/views/kubernetes/limitrange/edit/index.vue'),
    meta: {
      title: '编辑命名空间资源限制',
      permission: 'kubernetes:limitrange:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/edit/yaml',
    name: KubernetesRouteNames.LimitRange.EditYaml,
    component: () => import('@/views/kubernetes/limitrange/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间资源限制 YAML',
      permission: 'kubernetes:limitrange:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
]
