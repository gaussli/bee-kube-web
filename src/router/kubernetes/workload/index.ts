import type { RouteRecordRaw } from 'vue-router'

import { cronJobRoutes } from './cronjob'
import { daemonSetRoutes } from './daemonset'
import { deploymentRoutes } from './deployment'
import { jobRoutes } from './job'
import { statefulSetRoutes } from './statefulset'

export const workloadRoutes: RouteRecordRaw[] = [
  ...deploymentRoutes,
  ...statefulSetRoutes,
  ...daemonSetRoutes,
  ...jobRoutes,
  ...cronJobRoutes,
]
