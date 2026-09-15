import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/roles',
    name: PlatformRouteNames.Role.List,
    component: () => import('@/views/platform/system/role/index.vue'),
    meta: {
      title: '角色',
      permission: 'platform:system:role:view',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid',
    name: PlatformRouteNames.Role.Detail,
    component: () => import('@/views/platform/system/role/detail/index.vue'),
    meta: {
      title: '角色详情',
      permission: 'platform:system:role:view',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/create',
    name: PlatformRouteNames.Role.Create,
    component: () => import('@/views/platform/system/role/create/index.vue'),
    meta: {
      title: '创建角色',
      permission: 'platform:system:role:create',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid/edit',
    name: PlatformRouteNames.Role.Edit,
    component: () => import('@/views/platform/system/role/edit/index.vue'),
    meta: {
      title: '编辑角色',
      permission: 'platform:system:role:edit',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid/users',
    name: PlatformRouteNames.Role.AssignUsers,
    component: () => import('@/views/platform/system/role/edit/assignusers.vue'),
    meta: {
      title: '配置角色用户',
      permission: 'platform:system:role:edit',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid/groups',
    name: PlatformRouteNames.Role.AssignGroups,
    component: () => import('@/views/platform/system/role/edit/assigngroups.vue'),
    meta: {
      title: '配置角色组织',
      permission: 'platform:system:role:edit',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid/orgs',
    name: PlatformRouteNames.Role.AssignOrgs,
    component: () => import('@/views/platform/system/role/edit/assignorgs.vue'),
    meta: {
      title: '配置角色群组',
      permission: 'platform:system:role:edit',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
  {
    path: '/platform/system/roles/:uid/permissions',
    name: PlatformRouteNames.Role.AssignPermissions,
    component: () => import('@/views/platform/system/role/edit/assignpermissions.vue'),
    meta: {
      title: '配置角色权限',
      permission: 'platform:system:role:edit',
      activeCode: PlatformRouteNames.Role.List,
    },
  },
]
