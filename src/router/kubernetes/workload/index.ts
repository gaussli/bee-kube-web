import type { RouteRecordRaw } from 'vue-router'

import { cronjobRoutes } from './cronjob'
import { daemonsetRoutes } from './daemonset'
import { deploymentRoutes } from './deployment'
import { jobRoutes } from './job'
import { statefulsetRoutes } from './statefulset'

export const workloadRoutes: RouteRecordRaw[] = [
  ...deploymentRoutes,
  ...statefulsetRoutes,
  ...daemonsetRoutes,
  ...jobRoutes,
  ...cronjobRoutes,
]
