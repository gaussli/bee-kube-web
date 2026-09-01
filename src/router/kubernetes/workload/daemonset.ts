import type { RouteRecordRaw } from 'vue-router'

export const daemonsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets',
    name: 'kubernetes:workload:daemonset',
    component: () => import('@/views/kubernetes/workload/daemonset/index.vue'),
    meta: {
      title: '守护进程集',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    name: 'kubernetes:workload:daemonset:detail',
    component: () => import('@/views/kubernetes/workload/daemonset/detail/index.vue'),
    meta: {
      title: '守护进程集详情',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets/create',
    name: 'kubernetes:workload:daemonset:create',
    component: () => import('@/views/kubernetes/workload/daemonset/create/index.vue'),
    meta: {
      title: '创建守护进程集',
      permission: 'kubernetes:workload:daemonset:create',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/daemonsets/create/yaml',
    name: 'kubernetes:workload:daemonset:create:yaml',
    component: () => import('@/views/kubernetes/workload/daemonset/create/yaml.vue'),
    meta: {
      title: '创建守护进程集 YAML',
      permission: 'kubernetes:workload:daemonset:create',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit',
    name: 'kubernetes:workload:daemonset:edit',
    component: () => import('@/views/kubernetes/workload/daemonset/edit/index.vue'),
    meta: {
      title: '编辑守护进程集',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit/yaml',
    name: 'kubernetes:workload:daemonset:edit:yaml',
    component: () => import('@/views/kubernetes/workload/daemonset/edit/yaml.vue'),
    meta: {
      title: '编辑守护进程集 YAML',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
]
