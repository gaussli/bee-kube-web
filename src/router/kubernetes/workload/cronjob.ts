import type { RouteRecordRaw } from 'vue-router'

export const cronjobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs',
    name: 'kubernetes:workload:cronjob',
    component: () => import('@/views/kubernetes/workload/cronjob/index.vue'),
    meta: {
      title: '定时任务',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    name: 'kubernetes:workload:cronjob:detail',
    component: () => import('@/views/kubernetes/workload/cronjob/detail/index.vue'),
    meta: {
      title: '定时任务详情',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs/create',
    name: 'kubernetes:workload:cronjob:create',
    component: () => import('@/views/kubernetes/workload/cronjob/create/index.vue'),
    meta: {
      title: '创建定时任务',
      permission: 'kubernetes:workload:cronjob:create',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/cronjobs/create/yaml',
    name: 'kubernetes:workload:cronjob:create:yaml',
    component: () => import('@/views/kubernetes/workload/cronjob/create/yaml.vue'),
    meta: {
      title: '创建定时任务 YAML',
      permission: 'kubernetes:workload:cronjob:create',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit',
    name: 'kubernetes:workload:cronjob:edit',
    component: () => import('@/views/kubernetes/workload/cronjob/edit/index.vue'),
    meta: {
      title: '编辑定时任务',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit/yaml',
    name: 'kubernetes:workload:cronjob:edit:yaml',
    component: () => import('@/views/kubernetes/workload/cronjob/edit/yaml.vue'),
    meta: {
      title: '编辑定时任务 YAML',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
]
