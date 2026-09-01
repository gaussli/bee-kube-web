import type { RouteRecordRaw } from 'vue-router'

import { configmapRoutes } from './configmap'
import { secretRoutes } from './secret'

export const configRoutes: RouteRecordRaw[] = [...configmapRoutes, ...secretRoutes]
