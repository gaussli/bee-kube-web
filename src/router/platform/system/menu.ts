import type { RouteRecordRaw } from 'vue-router'

import { PlatformRouteNames } from '@/router/names'

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/menus',
    name: PlatformRouteNames.Menu.List,
    component: () => import('@/views/platform/system/menu/index.vue'),
    meta: {
      title: '菜单',
      permission: 'platform:system:menu:view',
      activeCode: PlatformRouteNames.Menu.List,
    },
  },
  {
    path: '/platform/system/menus/:uid',
    name: PlatformRouteNames.Menu.Detail,
    component: () => import('@/views/platform/system/menu/detail/index.vue'),
    meta: {
      title: '菜单详情',
      permission: 'platform:system:menu:view',
      activeCode: PlatformRouteNames.Menu.List,
    },
  },
  {
    path: '/platform/system/menus/create',
    name: PlatformRouteNames.Menu.Create,
    component: () => import('@/views/platform/system/menu/create/index.vue'),
    meta: {
      title: '创建菜单',
      permission: 'platform:system:menu:create',
      activeCode: PlatformRouteNames.Menu.List,
    },
  },
  {
    path: '/platform/system/menus/:uid/edit',
    name: PlatformRouteNames.Menu.Edit,
    component: () => import('@/views/platform/system/menu/edit/index.vue'),
    meta: {
      title: '编辑菜单',
      permission: 'platform:system:menu:edit',
      activeCode: PlatformRouteNames.Menu.List,
    },
  },
]
