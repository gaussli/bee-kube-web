import type { RouteRecordRaw } from 'vue-router'

import { groupRoutes } from './group'
import { menuRoutes } from './menu'
import { orgRoutes } from './org'
import { permissionRoutes } from './permission'
import { roleRoutes } from './role'
import { userRoutes } from './user'

export const systemRoutes: RouteRecordRaw[] = [
  ...userRoutes,
  ...groupRoutes,
  ...orgRoutes,
  ...roleRoutes,
  ...permissionRoutes,
  ...menuRoutes,
]
