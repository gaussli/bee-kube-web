import type { RouteRecordRaw } from 'vue-router'

const platformUserRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/user',
    name: 'platform:system:user',
    component: () => import('@/views/platform/system/user/index.vue'),
    meta: {
      title: '用户管理',
      icon: 'User',
      permission: 'platform:system:user:view',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: '/platform/system/user/:id/detail',
    name: 'platform:system:user:detail',
    component: () => import('@/views/platform/system/user/detail/index.vue'),
    meta: {
      title: '用户详情',
      icon: 'InfoFilled',
      permission: 'platform:system:user:view',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: '/platform/system/user/create',
    name: 'platform:system:user:create',
    component: () => import('@/views/platform/system/user/create/index.vue'),
    meta: {
      title: '创建用户',
      icon: 'Plus',
      permission: 'platform:system:user:create',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: '/platform/system/user/:id/edit',
    name: 'platform:system:user:edit',
    component: () => import('@/views/platform/system/user/edit/index.vue'),
    meta: {
      title: '编辑用户',
      icon: 'EditPen',
      permission: 'platform:system:user:edit',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: '/platform/system/user/:id/assign-roles',
    name: 'platform:system:user:assign-roles',
    component: () => import('@/views/platform/system/user/assign-roles/index.vue'),
    meta: {
      title: '配置角色',
      icon: 'Key',
      permission: 'platform:system:user:edit',
      activeCode: 'platform:system:user'
    }
  }
]

const platformRoleRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/role',
    name: 'platform:system:role',
    component: () => import('@/views/platform/system/role/index.vue'),
    meta: {
      title: '角色管理',
      icon: 'Avatar',
      permission: 'platform:system:role:view',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: '/platform/system/role/:id/detail',
    name: 'platform:system:role:detail',
    component: () => import('@/views/platform/system/role/detail/index.vue'),
    meta: {
      title: '角色详情',
      icon: 'InfoFilled',
      permission: 'platform:system:role:view',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: '/platform/system/role/create',
    name: 'platform:system:role:create',
    component: () => import('@/views/platform/system/role/create/index.vue'),
    meta: {
      title: '创建角色',
      icon: 'Plus',
      permission: 'platform:system:role:create',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: '/platform/system/role/:id/edit',
    name: 'platform:system:role:edit',
    component: () => import('@/views/platform/system/role/edit/index.vue'),
    meta: {
      title: '编辑角色',
      icon: 'EditPen',
      permission: 'platform:system:role:edit',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: '/platform/system/role/:id/assign-permissions',
    name: 'platform:system:role:assign-permissions',
    component: () => import('@/views/platform/system/role/assign-permissions/index.vue'),
    meta: {
      title: '配置权限',
      icon: 'Key',
      permission: 'platform:system:role:edit',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: '/platform/system/role/:id/assign-users',
    name: 'platform:system:role:assign-users',
    component: () => import('@/views/platform/system/role/assign-users/index.vue'),
    meta: {
      title: '配置用户',
      icon: 'User',
      permission: 'platform:system:role:edit',
      activeCode: 'platform:system:role'
    }
  }
]

const platformMenuRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/menu',
    name: 'platform:system:menu',
    component: () => import('@/views/platform/system/menu/index.vue'),
    meta: {
      title: '菜单管理',
      icon: 'Menu',
      permission: 'platform:system:menu:view',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: '/platform/system/menu/:id/detail',
    name: 'platform:system:menu:detail',
    component: () => import('@/views/platform/system/menu/detail/index.vue'),
    meta: {
      title: '菜单详情',
      icon: 'InfoFilled',
      permission: 'platform:system:menu:view',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: '/platform/system/menu/create',
    name: 'platform:system:menu:create',
    component: () => import('@/views/platform/system/menu/create/index.vue'),
    meta: {
      title: '创建菜单',
      icon: 'Plus',
      permission: 'platform:system:menu:create',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: '/platform/system/menu/:id/edit',
    name: 'platform:system:menu:edit',
    component: () => import('@/views/platform/system/menu/edit/index.vue'),
    meta: {
      title: '编辑菜单',
      icon: 'EditPen',
      permission: 'platform:system:menu:edit',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: '/platform/system/menu/:id/assign-roles',
    name: 'platform:system:menu:assign-roles',
    component: () => import('@/views/platform/system/menu/assign-roles/index.vue'),
    meta: {
      title: '配置角色',
      icon: 'Key',
      permission: 'platform:system:menu:edit',
      activeCode: 'platform:system:menu'
    }
  }
]

const platformPermissionRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/permission',
    name: 'platform:system:permission',
    component: () => import('@/views/platform/system/permission/index.vue'),
    meta: {
      title: '权限管理',
      icon: 'Key',
      permission: 'platform:system:permission:view',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: '/platform/system/permission/:id/detail',
    name: 'platform:system:permission:detail',
    component: () => import('@/views/platform/system/permission/detail/index.vue'),
    meta: {
      title: '权限详情',
      icon: 'InfoFilled',
      permission: 'platform:system:permission:view',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: '/platform/system/permission/create',
    name: 'platform:system:permission:create',
    component: () => import('@/views/platform/system/permission/create/index.vue'),
    meta: {
      title: '新增权限',
      icon: 'Plus',
      permission: 'platform:system:permission:create',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: '/platform/system/permission/:id/edit',
    name: 'platform:system:permission:edit',
    component: () => import('@/views/platform/system/permission/edit/index.vue'),
    meta: {
      title: '编辑权限',
      icon: 'EditPen',
      permission: 'platform:system:permission:edit',
      activeCode: 'platform:system:permission'
    }
  }
]

export const platformRoutes: RouteRecordRaw[] = [
  {
    path: '/platform',
    name: 'platform',
    redirect: '/platform/dashboard'
  },
  {
    path: '/platform/dashboard',
    name: 'platform:dashboard',
    component: () => import('@/views/platform/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'Odometer'
    }
  },
  {
    path: '/platform/system',
    name: 'platform:system',
    meta: {
      title: '系统配置',
      icon: 'Setting'
    },
    children: [...platformUserRoutes, ...platformRoleRoutes, ...platformMenuRoutes, ...platformPermissionRoutes]
  }
]
