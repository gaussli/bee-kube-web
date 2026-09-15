import type { RouteRecordRaw } from 'vue-router'

export const limitRangeRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitrange/:name',
    name: 'kubernetes:limitrange:detail',
    component: () => import('@/views/kubernetes/limitrange/detail/index.vue'),
    meta: {
      title: '命名空间资源限制详情',
      permission: 'kubernetes:limitrange:view',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/limitrange/create',
    name: 'kubernetes:limitrange:create',
    component: () => import('@/views/kubernetes/limitrange/create/index.vue'),
    meta: {
      title: '创建命名空间资源限制',
      permission: 'kubernetes:limitrange:create',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitrange/:name/edit',
    name: 'kubernetes:limitrange:edit',
    component: () => import('@/views/kubernetes/limitrange/edit/index.vue'),
    meta: {
      title: '编辑命名空间资源限制',
      permission: 'kubernetes:limitrange:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitrange/:name/edit/yaml',
    name: 'kubernetes:limitrange:edit:yaml',
    component: () => import('@/views/kubernetes/limitrange/edit/yaml.vue'),
    meta: {
      title: '编辑命名空间资源限制 YAML',
      permission: 'kubernetes:limitrange:edit',
      activeCode: 'kubernetes:namespace',
    },
  },
]
