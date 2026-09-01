import type { RouteRecordRaw } from 'vue-router'

import { deploymentRoutes } from './deployment'
import { statefulsetRoutes } from './statefulset'
import { daemonsetRoutes } from './daemonset'
import { jobRoutes } from './job'
import { cronjobRoutes } from './cronjob'

export const workloadRoutes: RouteRecordRaw[] = [
  ...deploymentRoutes,
  ...statefulsetRoutes,
  ...daemonsetRoutes,
  ...jobRoutes,
  ...cronjobRoutes,
]
