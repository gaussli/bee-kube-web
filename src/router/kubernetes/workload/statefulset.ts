import type { RouteRecordRaw } from 'vue-router'

export const statefulsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets',
    name: 'kubernetes:workload:statefulset',
    component: () => import('@/views/kubernetes/workload/statefulset/index.vue'),
    meta: {
      title: '有状态应用',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    name: 'kubernetes:workload:statefulset:detail',
    component: () => import('@/views/kubernetes/workload/statefulset/detail/index.vue'),
    meta: {
      title: '有状态应用详情',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets/create',
    name: 'kubernetes:workload:statefulset:create',
    component: () => import('@/views/kubernetes/workload/statefulset/create/index.vue'),
    meta: {
      title: '创建有状态应用',
      permission: 'kubernetes:workload:statefulset:create',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/statefulsets/create/yaml',
    name: 'kubernetes:workload:statefulset:create:yaml',
    component: () => import('@/views/kubernetes/workload/statefulset/create/yaml.vue'),
    meta: {
      title: '创建有状态应用 YAML',
      permission: 'kubernetes:workload:statefulset:create',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit',
    name: 'kubernetes:workload:statefulset:edit',
    component: () => import('@/views/kubernetes/workload/statefulset/edit/index.vue'),
    meta: {
      title: '编辑有状态应用',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit/yaml',
    name: 'kubernetes:workload:statefulset:edit:yaml',
    component: () => import('@/views/kubernetes/workload/statefulset/edit/yaml.vue'),
    meta: {
      title: '编辑有状态应用 YAML',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
]
