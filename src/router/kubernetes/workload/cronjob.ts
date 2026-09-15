import type { RouteRecordRaw } from 'vue-router'

import { KubernetesRouteNames } from '@/router/names'

export const cronJobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs',
    name: KubernetesRouteNames.CronJob.List,
    component: () => import('@/views/kubernetes/workload/cronjob/index.vue'),
    meta: {
      title: '定时任务',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    name: KubernetesRouteNames.CronJob.Detail,
    component: () => import('@/views/kubernetes/workload/cronjob/detail/index.vue'),
    meta: {
      title: '定时任务详情',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs/create',
    name: KubernetesRouteNames.CronJob.Create,
    component: () => import('@/views/kubernetes/workload/cronjob/create/index.vue'),
    meta: {
      title: '创建定时任务',
      permission: 'kubernetes:workload:cronjob:create',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs/create/yaml',
    name: KubernetesRouteNames.CronJob.CreateYaml,
    component: () => import('@/views/kubernetes/workload/cronjob/create/yaml.vue'),
    meta: {
      title: '创建定时任务 YAML',
      permission: 'kubernetes:workload:cronjob:create',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit',
    name: KubernetesRouteNames.CronJob.Edit,
    component: () => import('@/views/kubernetes/workload/cronjob/edit/index.vue'),
    meta: {
      title: '编辑定时任务',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit/yaml',
    name: KubernetesRouteNames.CronJob.EditYaml,
    component: () => import('@/views/kubernetes/workload/cronjob/edit/yaml.vue'),
    meta: {
      title: '编辑定时任务 YAML',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels',
    name: KubernetesRouteNames.CronJob.ManageLabels,
    component: () => import('@/views/kubernetes/workload/cronjob/edit/labels.vue'),
    meta: {
      title: '配置定时任务标签',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations',
    name: KubernetesRouteNames.CronJob.ManageAnnotatioins,
    component: () => import('@/views/kubernetes/workload/cronjob/edit/annotations.vue'),
    meta: {
      title: '配置定时任务注解',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: KubernetesRouteNames.CronJob.List,
    },
  },
]
