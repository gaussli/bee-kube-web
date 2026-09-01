import type { RouteRecordRaw } from 'vue-router'

export const deploymentRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/deployments',
    name: 'kubernetes:workload:deployment',
    component: () => import('@/views/kubernetes/workload/deployment/index.vue'),
    meta: {
      title: '无状态应用',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    name: 'kubernetes:workload:deployment:detail',
    component: () => import('@/views/kubernetes/workload/deployment/detail/index.vue'),
    meta: {
      title: '无状态应用详情',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/deployments/create',
    name: 'kubernetes:workload:deployment:create',
    component: () => import('@/views/kubernetes/workload/deployment/create/index.vue'),
    meta: {
      title: '创建无状态应用',
      permission: 'kubernetes:workload:deployment:create',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/deployments/create/yaml',
    name: 'kubernetes:workload:deployment:create:yaml',
    component: () => import('@/views/kubernetes/workload/deployment/create/yaml.vue'),
    meta: {
      title: '创建无状态应用 YAML',
      permission: 'kubernetes:workload:deployment:create',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit',
    name: 'kubernetes:workload:deployment:edit',
    component: () => import('@/views/kubernetes/workload/deployment/edit/index.vue'),
    meta: {
      title: '编辑无状态应用',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/yaml',
    name: 'kubernetes:workload:deployment:edit:yaml',
    component: () => import('@/views/kubernetes/workload/deployment/edit/yaml.vue'),
    meta: {
      title: '编辑无状态应用 YAML',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
]
