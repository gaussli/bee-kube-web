import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const permissionRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/permissions',
    name: PlatformRouteNames.Permission.List,
    component: () => import('@/views/platform/system/permission/index.vue'),
    meta: {
      title: '权限',
      permission: 'platform:system:permission:view',
      activeCode: PlatformRouteNames.Permission.List,
    },
  },
  {
    path: '/platform/system/permissions/:uid',
    name: PlatformRouteNames.Permission.Detail,
    component: () => import('@/views/platform/system/permission/detail/index.vue'),
    meta: {
      title: '权限详情',
      permission: 'platform:system:permission:view',
      activeCode: PlatformRouteNames.Permission.List,
    },
  },
  {
    path: '/platform/system/permissions/create',
    name: PlatformRouteNames.Permission.Create,
    component: () => import('@/views/platform/system/permission/create/index.vue'),
    meta: {
      title: '创建权限',
      permission: 'platform:system:permission:create',
      activeCode: PlatformRouteNames.Permission.List,
    },
  },
  {
    path: '/platform/system/permissions/:uid/edit',
    name: PlatformRouteNames.Permission.Edit,
    component: () => import('@/views/platform/system/permission/edit/index.vue'),
    meta: {
      title: '编辑权限',
      permission: 'platform:system:permission:edit',
      activeCode: PlatformRouteNames.Permission.List,
    },
  },
  {
    path: '/platform/system/permissions/:uid/roles',
    name: PlatformRouteNames.Permission.AssignRoles,
    component: () => import('@/views/platform/system/permission/edit/assignroles.vue'),
    meta: {
      title: '配置权限角色',
      permission: 'platform:system:permission:edit',
      activeCode: PlatformRouteNames.Permission.List,
    },
  },
]
