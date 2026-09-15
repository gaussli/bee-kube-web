import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const jobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/jobs',
    name: KubernetesRouteNames.Job.List,
    component: () => import('@/views/kubernetes/workload/job/index.vue'),
    meta: {
      title: '任务',
      permission: 'kubernetes:workload:job:view',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    name: KubernetesRouteNames.Job.Detail,
    component: () => import('@/views/kubernetes/workload/job/detail/index.vue'),
    meta: {
      title: '任务详情',
      permission: 'kubernetes:workload:job:view',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/jobs/create',
    name: KubernetesRouteNames.Job.Create,
    component: () => import('@/views/kubernetes/workload/job/create/index.vue'),
    meta: {
      title: '创建任务',
      permission: 'kubernetes:workload:job:create',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/jobs/create/yaml',
    name: KubernetesRouteNames.Job.CreateYaml,
    component: () => import('@/views/kubernetes/workload/job/create/yaml.vue'),
    meta: {
      title: '创建任务 YAML',
      permission: 'kubernetes:workload:job:create',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit',
    name: KubernetesRouteNames.Job.Edit,
    component: () => import('@/views/kubernetes/workload/job/edit/index.vue'),
    meta: {
      title: '编辑任务',
      permission: 'kubernetes:workload:job:edit',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit/yaml',
    name: KubernetesRouteNames.Job.EditYaml,
    component: () => import('@/views/kubernetes/workload/job/edit/yaml.vue'),
    meta: {
      title: '编辑任务 YAML',
      permission: 'kubernetes:workload:job:edit',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels',
    name: KubernetesRouteNames.Job.ManageLabels,
    component: () => import('@/views/kubernetes/workload/job/edit/labels.vue'),
    meta: {
      title: '配置任务标签',
      permission: 'kubernetes:workload:job:edit',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations',
    name: KubernetesRouteNames.Job.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/workload/job/edit/annotations.vue'),
    meta: {
      title: '配置任务注解',
      permission: 'kubernetes:workload:job:edit',
      activeCode: KubernetesRouteNames.Job.List,
    },
  },
]
