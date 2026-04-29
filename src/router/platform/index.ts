import type { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('@/views/**/*.vue')

const platformUserRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/system/user',
    name: 'platform:system:user',
    component: modules['/src/views/platform/system/user/index.vue'],
    meta: {
      title: '用户管理',
      icon: 'User',
      permission: 'platform:system:user:view',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: ':id/detail',
    name: 'platform:system:user:detail',
    component: modules['/src/views/platform/system/user/detail/index.vue'],
    meta: {
      title: '用户详情',
      icon: 'InfoFilled',
      permission: 'platform:system:user:view',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: 'create',
    name: 'platform:system:user:create',
    component: modules['/src/views/platform/system/user/create/index.vue'],
    meta: {
      title: '创建用户',
      icon: 'Plus',
      permission: 'platform:system:user:create',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: ':id/edit',
    name: 'platform:system:user:edit',
    component: modules['/src/views/platform/system/user/edit/index.vue'],
    meta: {
      title: '编辑用户',
      icon: 'EditPen',
      permission: 'platform:system:user:edit',
      activeCode: 'platform:system:user'
    }
  },
  {
    path: ':id/assign-roles',
    name: 'platform:system:user:assign-roles',
    component: modules['/src/views/platform/system/user/assign-roles/index.vue'],
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
    component: modules['/src/views/platform/system/role/index.vue'],
    meta: {
      title: '角色管理',
      icon: 'Avatar',
      permission: 'platform:system:role:view',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: ':id/detail',
    name: 'platform:system:role:detail',
    component: modules['/src/views/platform/system/role/detail/index.vue'],
    meta: {
      title: '角色详情',
      icon: 'InfoFilled',
      permission: 'platform:system:role:view',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: 'create',
    name: 'platform:system:role:create',
    component: modules['/src/views/platform/system/role/create/index.vue'],
    meta: {
      title: '创建角色',
      icon: 'Plus',
      permission: 'platform:system:role:create',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: ':id/edit',
    name: 'platform:system:role:edit',
    component: modules['/src/views/platform/system/role/edit/index.vue'],
    meta: {
      title: '编辑角色',
      icon: 'EditPen',
      permission: 'platform:system:role:edit',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: ':id/assign-permissions',
    name: 'platform:system:role:assign-permissions',
    component: modules['/src/views/platform/system/role/assign-permissions/index.vue'],
    meta: {
      title: '配置权限',
      icon: 'Key',
      permission: 'platform:system:role:edit',
      activeCode: 'platform:system:role'
    }
  },
  {
    path: ':id/assign-users',
    name: 'platform:system:role:assign-users',
    component: modules['/src/views/platform/system/role/assign-users/index.vue'],
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
    component: modules['/src/views/platform/system/menu/index.vue'],
    meta: {
      title: '菜单管理',
      icon: 'Menu',
      permission: 'platform:system:menu:view',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: ':id/detail',
    name: 'platform:system:menu:detail',
    component: modules['/src/views/platform/system/menu/detail/index.vue'],
    meta: {
      title: '菜单详情',
      icon: 'InfoFilled',
      permission: 'platform:system:menu:view',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: 'create',
    name: 'platform:system:menu:create',
    component: modules['/src/views/platform/system/menu/create/index.vue'],
    meta: {
      title: '创建菜单',
      icon: 'Plus',
      permission: 'platform:system:menu:create',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: ':id/edit',
    name: 'platform:system:menu:edit',
    component: modules['/src/views/platform/system/menu/edit/index.vue'],
    meta: {
      title: '编辑菜单',
      icon: 'EditPen',
      permission: 'platform:system:menu:edit',
      activeCode: 'platform:system:menu'
    }
  },
  {
    path: ':id/assign-roles',
    name: 'platform:system:menu:assign-roles',
    component: modules['/src/views/platform/system/menu/assign-roles/index.vue'],
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
    component: modules['/src/views/platform/system/permission/index.vue'],
    meta: {
      title: '权限管理',
      icon: 'Key',
      permission: 'platform:system:permission:view',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: ':id/detail',
    name: 'platform:system:permission:detail',
    component: modules['/src/views/platform/system/permission/detail/index.vue'],
    meta: {
      title: '权限详情',
      icon: 'InfoFilled',
      permission: 'platform:system:permission:view',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: 'create',
    name: 'platform:system:permission:create',
    component: modules['/src/views/platform/system/permission/create/index.vue'],
    meta: {
      title: '新增权限',
      icon: 'Plus',
      permission: 'platform:system:permission:create',
      activeCode: 'platform:system:permission'
    }
  },
  {
    path: ':id/edit',
    name: 'platform:system:permission:edit',
    component: modules['/src/views/platform/system/permission/edit/index.vue'],
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
    component: modules['/src/views/platform/dashboard/index.vue'],
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
