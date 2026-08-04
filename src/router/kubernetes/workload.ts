import type { RouteRecordRaw } from 'vue-router'

const deploymentRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/deployments',
    name: 'kubernetes:workload:deployment',
    component: () => import('@/views/kubernetes/workload/deployment/index.vue'),
    meta: {
      title: '无状态应用',
      icon: 'Document',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    name: 'kubernetes:workload:deployment:detail',
    component: () => import('@/views/kubernetes/workload/deployment/detail/index.vue'),
    meta: {
      title: '无状态应用详情',
      icon: 'Document',
      permission: 'kubernetes:workload:deployment:view',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/deployments/create',
    name: 'kubernetes:workload:deployment:create',
    component: () => import('@/views/kubernetes/workload/deployment/create/index.vue'),
    meta: {
      title: '创建无状态应用',
      icon: 'Document',
      permission: 'kubernetes:workload:deployment:create',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/edit',
    name: 'kubernetes:workload:deployment:edit',
    component: () => import('@/views/kubernetes/workload/deployment/edit/index.vue'),
    meta: {
      title: '编辑无状态应用',
      icon: 'Document',
      permission: 'kubernetes:workload:deployment:edit',
      activeCode: 'kubernetes:workload:deployment',
    },
  },
]

const statefulsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/workload/statefulset',
    name: 'kubernetes:workload:statefulset',
    component: () => import('@/views/kubernetes/workload/statefulset/index.vue'),
    meta: {
      title: '有状态应用',
      icon: 'Collection',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/statefulset/create',
    name: 'kubernetes:workload:statefulset:create',
    component: () => import('@/views/kubernetes/workload/statefulset/create/index.vue'),
    meta: {
      title: '创建有状态应用',
      icon: 'Collection',
      permission: 'kubernetes:workload:statefulset:create',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/statefulset/edit',
    name: 'kubernetes:workload:statefulset:edit',
    component: () => import('@/views/kubernetes/workload/statefulset/edit/index.vue'),
    meta: {
      title: '编辑有状态应用',
      icon: 'Collection',
      permission: 'kubernetes:workload:statefulset:edit',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/statefulset/detail',
    name: 'kubernetes:workload:statefulset:detail',
    component: () => import('@/views/kubernetes/workload/statefulset/detail/index.vue'),
    meta: {
      title: '有状态应用详情',
      icon: 'Collection',
      permission: 'kubernetes:workload:statefulset:view',
      activeCode: 'kubernetes:workload:statefulset',
    },
  },
]

const daemonsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/workload/daemonset',
    name: 'kubernetes:workload:daemonset',
    component: () => import('@/views/kubernetes/workload/daemonset/index.vue'),
    meta: {
      title: '守护进程',
      icon: 'Monitor',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/daemonset/create',
    name: 'kubernetes:workload:daemonset:create',
    component: () => import('@/views/kubernetes/workload/daemonset/create/index.vue'),
    meta: {
      title: '创建守护进程',
      icon: 'Monitor',
      permission: 'kubernetes:workload:daemonset:create',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/daemonset/edit',
    name: 'kubernetes:workload:daemonset:edit',
    component: () => import('@/views/kubernetes/workload/daemonset/edit/index.vue'),
    meta: {
      title: '编辑守护进程',
      icon: 'Monitor',
      permission: 'kubernetes:workload:daemonset:edit',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/daemonset/detail',
    name: 'kubernetes:workload:daemonset:detail',
    component: () => import('@/views/kubernetes/workload/daemonset/detail/index.vue'),
    meta: {
      title: '守护进程详情',
      icon: 'Monitor',
      permission: 'kubernetes:workload:daemonset:view',
      activeCode: 'kubernetes:workload:daemonset',
    },
  },
]

const jobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/workload/job',
    name: 'kubernetes:workload:job',
    component: () => import('@/views/kubernetes/workload/job/index.vue'),
    meta: {
      title: '任务',
      icon: 'Timer',
      permission: 'kubernetes:workload:job:view',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/job/create',
    name: 'kubernetes:workload:job:create',
    component: () => import('@/views/kubernetes/workload/job/create/index.vue'),
    meta: {
      title: '创建任务',
      icon: 'Timer',
      permission: 'kubernetes:workload:job:create',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/job/edit',
    name: 'kubernetes:workload:job:edit',
    component: () => import('@/views/kubernetes/workload/job/edit/index.vue'),
    meta: {
      title: '编辑任务',
      icon: 'Timer',
      permission: 'kubernetes:workload:job:edit',
      activeCode: 'kubernetes:workload:job',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/job/detail',
    name: 'kubernetes:workload:job:detail',
    component: () => import('@/views/kubernetes/workload/job/detail/index.vue'),
    meta: {
      title: '任务详情',
      icon: 'Timer',
      permission: 'kubernetes:workload:job:view',
      activeCode: 'kubernetes:workload:job',
    },
  },
]

const cronjobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/workload/cronjob',
    name: 'kubernetes:workload:cronjob',
    component: () => import('@/views/kubernetes/workload/cronjob/index.vue'),
    meta: {
      title: '定时任务',
      icon: 'Clock',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/cronjob/create',
    name: 'kubernetes:workload:cronjob:create',
    component: () => import('@/views/kubernetes/workload/cronjob/create/index.vue'),
    meta: {
      title: '创建定时任务',
      icon: 'Clock',
      permission: 'kubernetes:workload:cronjob:create',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/cronjob/edit',
    name: 'kubernetes:workload:cronjob:edit',
    component: () => import('@/views/kubernetes/workload/cronjob/edit/index.vue'),
    meta: {
      title: '编辑定时任务',
      icon: 'Clock',
      permission: 'kubernetes:workload:cronjob:edit',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterId/workload/cronjob/detail',
    name: 'kubernetes:workload:cronjob:detail',
    component: () => import('@/views/kubernetes/workload/cronjob/detail/index.vue'),
    meta: {
      title: '定时任务详情',
      icon: 'Clock',
      permission: 'kubernetes:workload:cronjob:view',
      activeCode: 'kubernetes:workload:cronjob',
    },
  },
]

export const workloadRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/workload',
    name: 'kubernetes:workload',
    redirect: '/kubernetes/clusters/:clusterId/workload/deployment',
    meta: {
      title: '工作负载',
      icon: 'Cpu',
    },
    children: [...deploymentRoutes, ...statefulsetRoutes, ...daemonsetRoutes, ...jobRoutes, ...cronjobRoutes],
  },
]
