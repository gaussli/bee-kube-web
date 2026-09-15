import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const orgRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/orgs',
    name: PlatformRouteNames.Org.List,
    component: () => import('@/views/platform/system/org/index.vue'),
    meta: {
      title: '组织',
      permission: 'platform:system:org:view',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
  {
    path: '/platform/system/orgs/:uid',
    name: PlatformRouteNames.Org.Detail,
    component: () => import('@/views/platform/system/org/detail/index.vue'),
    meta: {
      title: '组织详情',
      permission: 'platform:system:org:view',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
  {
    path: '/platform/system/orgs/create',
    name: PlatformRouteNames.Org.Create,
    component: () => import('@/views/platform/system/org/create/index.vue'),
    meta: {
      title: '创建组织',
      permission: 'platform:system:org:create',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
  {
    path: '/platform/system/orgs/:uid/edit',
    name: PlatformRouteNames.Org.Edit,
    component: () => import('@/views/platform/system/org/edit/index.vue'),
    meta: {
      title: '编辑组织',
      permission: 'platform:system:org:edit',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
  {
    path: '/platform/system/orgs/:uid/groups',
    name: PlatformRouteNames.Org.AssignUsers,
    component: () => import('@/views/platform/system/org/edit/assignusers.vue'),
    meta: {
      title: '配置组织用户',
      permission: 'platform:system:org:edit',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
  {
    path: '/platform/system/orgs/:uid/roles',
    name: PlatformRouteNames.Org.AssignRoles,
    component: () => import('@/views/platform/system/org/edit/assignroles.vue'),
    meta: {
      title: '配置组织角色',
      permission: 'platform:system:org:edit',
      activeCode: PlatformRouteNames.Org.List,
    },
  },
]
