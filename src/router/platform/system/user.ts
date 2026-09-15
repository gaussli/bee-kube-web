import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/users',
    name: PlatformRouteNames.User.List,
    component: () => import('@/views/platform/system/user/index.vue'),
    meta: {
      title: '用户',
      permission: 'platform:system:user:view',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/:uid',
    name: PlatformRouteNames.User.Detail,
    component: () => import('@/views/platform/system/user/detail/index.vue'),
    meta: {
      title: '用户详情',
      permission: 'platform:system:user:view',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/create',
    name: PlatformRouteNames.User.Create,
    component: () => import('@/views/platform/system/user/create/index.vue'),
    meta: {
      title: '创建用户',
      permission: 'platform:system:user:create',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/:uid/edit',
    name: PlatformRouteNames.User.Edit,
    component: () => import('@/views/platform/system/user/edit/index.vue'),
    meta: {
      title: '编辑用户',
      permission: 'platform:system:user:edit',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/:uid/roles',
    name: PlatformRouteNames.User.AssignRoles,
    component: () => import('@/views/platform/system/user/edit/assignroles.vue'),
    meta: {
      title: '配置用户角色',
      permission: 'platform:system:user:edit',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/:uid/groups',
    name: PlatformRouteNames.User.AssignGroups,
    component: () => import('@/views/platform/system/user/edit/assigngroups.vue'),
    meta: {
      title: '配置用户组织',
      permission: 'platform:system:user:edit',
      activeCode: PlatformRouteNames.User.List,
    },
  },
  {
    path: '/platform/system/users/:uid/orgs',
    name: PlatformRouteNames.User.AssignOrgs,
    component: () => import('@/views/platform/system/user/edit/assignorgs.vue'),
    meta: {
      title: '配置用户群组',
      permission: 'platform:system:user:edit',
      activeCode: PlatformRouteNames.User.List,
    },
  },
]
