import type { RouteRecordRaw } from 'vue-router'

import { configMapRoutes } from './configmap'
import { secretRoutes } from './secret'

export const configRoutes: RouteRecordRaw[] = [...configMapRoutes, ...secretRoutes]
