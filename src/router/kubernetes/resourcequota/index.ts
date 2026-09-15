import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const resourceQuotaRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/resourcequotas',
    name: KubernetesRouteNames.ResourceQuota.List,
    component: () => import('@/views/kubernetes/resourcequota/index.vue'),
    meta: {
      title: '命名空间资源配额',
      permission: 'kubernetes:resourcequota:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name',
    name: KubernetesRouteNames.ResourceQuota.Detail,
    component: () => import('@/views/kubernetes/resourcequota/detail/index.vue'),
    meta: {
      title: '命名空间资源配额详情',
      permission: 'kubernetes:resourcequota:view',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/resourcequotas/create',
    name: KubernetesRouteNames.ResourceQuota.Create,
    component: () => import('@/views/kubernetes/resourcequota/create/index.vue'),
    meta: {
      title: '创建命名空间资源配额',
      permission: 'kubernetes:resourcequota:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/resourcequotas/create/yaml',
    name: KubernetesRouteNames.ResourceQuota.CreateYaml,
    component: () => import('@/views/kubernetes/resourcequota/create/yaml.vue'),
    meta: {
      title: '创建命名空间资源配额 YAML',
      permission: 'kubernetes:resourcequota:create',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/edit',
    name: KubernetesRouteNames.ResourceQuota.Edit,
    component: () => import('@/views/kubernetes/resourcequota/edit/index.vue'),
    meta: {
      title: '编辑命名空间资源配额',
      permission: 'kubernetes:resourcequota:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/edit/yaml',
    name: KubernetesRouteNames.ResourceQuota.EditYaml,
    component: () => import('@/views/kubernetes/resourcequota/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间资源配额 YAML',
      permission: 'kubernetes:resourcequota:edit',
      activeCode: KubernetesRouteNames.Namespace.List,
    },
  },
]
