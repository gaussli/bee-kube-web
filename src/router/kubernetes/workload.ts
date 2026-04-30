import type { RouteRecordRaw } from 'vue-router'

const deploymentRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload/deployment',
    name: 'kubernetes:workload:deployment',
    component: () => import('@/views/kubernetes/workload/deployment/index.vue'),
    meta: {
      title: '无状态应用',
      icon: 'Document'
    }
  }
]

const statefulsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload/statefulset',
    name: 'kubernetes:workload:statefulset',
    component: () => import('@/views/kubernetes/workload/statefulset/index.vue'),
    meta: {
      title: '有状态应用',
      icon: 'Collection'
    }
  }
]

const daemonsetRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload/daemonset',
    name: 'kubernetes:workload:daemonset',
    component: () => import('@/views/kubernetes/workload/daemonset/index.vue'),
    meta: {
      title: '守护进程',
      icon: 'Monitor'
    }
  }
]

const jobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload/job',
    name: 'kubernetes:workload:job',
    component: () => import('@/views/kubernetes/workload/job/index.vue'),
    meta: {
      title: '任务',
      icon: 'Timer'
    }
  }
]

const cronjobRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload/cronjob',
    name: 'kubernetes:workload:cronjob',
    component: () => import('@/views/kubernetes/workload/cronjob/index.vue'),
    meta: {
      title: '定时任务',
      icon: 'Clock'
    }
  }
]

export const workloadRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/workload',
    name: 'kubernetes:workload',
    redirect: '/kubernetes/workload/deployment',
    meta: {
      title: '工作负载',
      icon: 'Cpu'
    },
    children: [...deploymentRoutes, ...statefulsetRoutes, ...daemonsetRoutes, ...jobRoutes, ...cronjobRoutes]
  }
]
