import type { RouteRecordRaw } from 'vue-router'

import { clusterRoleRoutes } from './clusterrole'
import { clusterRoleBindingRoutes } from './clusterrolebinding'
import { roleRoutes } from './role'
import { roleBindingRoutes } from './rolebinding'
import { serviceAccountRoutes } from './serviceaccount'

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
