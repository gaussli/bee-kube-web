import type { RouteRecordRaw } from 'vue-router'

import { serviceAccountRoutes } from './serviceaccount'
import { clusterRoleRoutes } from './clusterrole'
import { roleRoutes } from './role'
import { clusterRoleBindingRoutes } from './clusterrolebinding'
import { roleBindingRoutes } from './rolebinding'

export const securityRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security',
    name: 'kubernetes:security',
    redirect: '/kubernetes/clusters/:clusterUid/security/serviceaccounts',
    meta: {
      title: '安全',
    },
    children: [
      ...serviceAccountRoutes,
      ...clusterRoleRoutes,
      ...roleRoutes,
      ...clusterRoleBindingRoutes,
      ...roleBindingRoutes,
    ],
  },
]
