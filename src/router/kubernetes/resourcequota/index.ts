import type { RouteRecordRaw } from 'vue-router'

export const resourceQuotaRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequota/:name',
    name: 'kubernetes:resourcequota:detail',
    component: () => import('@/views/kubernetes/resourcequota/detail/index.vue'),
    meta: {
      title: '命名空间资源配额详情',
      permission: 'kubernetes:resourcequota:view',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/resourcequota/create',
    name: 'kubernetes:resourcequota:create',
    component: () => import('@/views/kubernetes/resourcequota/create/index.vue'),
    meta: {
      title: '创建命名空间资源配额',
      permission: 'kubernetes:resourcequota:create',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequota/:name/edit',
    name: 'kubernetes:resourcequota:edit',
    component: () => import('@/views/kubernetes/resourcequota/edit/index.vue'),
    meta: {
      title: '编辑命名空间资源配额',
      permission: 'kubernetes:resourcequota:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequota/:name/edit/yaml',
    name: 'kubernetes:resourcequota:edit:yaml',
    component: () => import('@/views/kubernetes/resourcequota/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间资源配额 YAML',
      permission: 'kubernetes:resourcequota:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
]
