import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const groupRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/groups',
    name: PlatformRouteNames.Group.List,
    component: () => import('@/views/platform/system/group/index.vue'),
    meta: {
      title: '群组',
      permission: 'platform:system:group:view',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
  {
    path: '/platform/system/groups/:uid',
    name: PlatformRouteNames.Group.Detail,
    component: () => import('@/views/platform/system/group/detail/index.vue'),
    meta: {
      title: '群组详情',
      permission: 'platform:system:group:view',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
  {
    path: '/platform/system/groups/create',
    name: PlatformRouteNames.Group.Create,
    component: () => import('@/views/platform/system/group/create/index.vue'),
    meta: {
      title: '创建群组',
      permission: 'platform:system:group:create',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
  {
    path: '/platform/system/groups/:uid/edit',
    name: PlatformRouteNames.Group.Edit,
    component: () => import('@/views/platform/system/group/edit/index.vue'),
    meta: {
      title: '编辑群组',
      permission: 'platform:system:group:edit',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
  {
    path: '/platform/system/groups/:uid/groups',
    name: PlatformRouteNames.Group.AssignUsers,
    component: () => import('@/views/platform/system/group/edit/assignusers.vue'),
    meta: {
      title: '配置群组用户',
      permission: 'platform:system:group:edit',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
  {
    path: '/platform/system/groups/:uid/roles',
    name: PlatformRouteNames.Group.AssignRoles,
    component: () => import('@/views/platform/system/group/edit/assignroles.vue'),
    meta: {
      title: '配置群组角色',
      permission: 'platform:system:group:edit',
      activeCode: PlatformRouteNames.Group.List,
    },
  },
]
