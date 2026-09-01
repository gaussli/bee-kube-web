import type { RouteRecordRaw } from 'vue-router'

export const jobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/jobs',
    name: 'kubernetes:workload:job',
    component: () => import('@/views/kubernetes/workload/job/index.vue'),
    meta: {
      title: '任务',
      permission: 'kubernetes:workload:job:view',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    name: 'kubernetes:workload:job:detail',
    component: () => import('@/views/kubernetes/workload/job/detail/index.vue'),
    meta: {
      title: '任务详情',
      permission: 'kubernetes:workload:job:view',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/jobs/create',
    name: 'kubernetes:workload:job:create',
    component: () => import('@/views/kubernetes/workload/job/create/index.vue'),
    meta: {
      title: '创建任务',
      permission: 'kubernetes:workload:job:create',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/jobs/create/yaml',
    name: 'kubernetes:workload:job:create:yaml',
    component: () => import('@/views/kubernetes/workload/job/create/yaml.vue'),
    meta: {
      title: '创建任务 YAML',
      permission: 'kubernetes:workload:job:create',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit',
    name: 'kubernetes:workload:job:edit',
    component: () => import('@/views/kubernetes/workload/job/edit/index.vue'),
    meta: {
      title: '编辑任务',
      permission: 'kubernetes:workload:job:edit',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit/yaml',
    name: 'kubernetes:workload:job:edit:yaml',
    component: () => import('@/views/kubernetes/workload/job/edit/yaml.vue'),
    meta: {
      title: '编辑任务 YAML',
      permission: 'kubernetes:workload:job:edit',
      activeCode: 'kubernetes:workload:job',
    },
  },
]
