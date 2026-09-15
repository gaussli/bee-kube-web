import type { RouteRecordRaw } from 'vue-router'

import { ingressRoutes } from './ingress'
import { networkPolicyRoutes } from './networkpolicy'
import { serviceRoutes } from './service'

export const networkRoutes: RouteRecordRaw[] = [...serviceRoutes, ...ingressRoutes, ...networkPolicyRoutes]
