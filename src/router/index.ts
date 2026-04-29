import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'

// 使用 glob 预加载所有 views 下的 .vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

const kubernetesRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes',
    name: 'kubernetes',
    redirect: '/kubernetes/dashboard'
  },
  {
    path: '/kubernetes/dashboard',
    name: 'kubernetes:dashboard',
    component: modules['/src/views/kubernetes/dashboard/index.vue'],
    meta: {
      title: 'Dashboard',
      icon: 'Odometer'
    }
  },
  {
    path: '/kubernetes/node',
    name: 'kubernetes:node',
    component: modules['/src/views/kubernetes/node/index.vue'],
    meta: {
      title: '节点',
      icon: 'Box'
    }
  },
  {
    path: '/kubernetes/namespace',
    name: 'kubernetes:namespace',
    component: modules['/src/views/kubernetes/namespace/index.vue'],
    meta: {
      title: '命名空间',
      icon: 'FolderOpened'
    }
  },
  {
    path: '/kubernetes/workload',
    name: 'kubernetes:workload',
    redirect: '/kubernetes/workload/deployment',
    meta: {
      title: '工作负载',
      icon: 'Cpu'
    },
    children: [
      {
        path: '/kubernetes/workload/deployment',
        name: 'kubernetes:workload:deployment',
        component: modules['/src/views/kubernetes/workload/deployment/index.vue'],
        meta: {
          title: '无状态应用',
          icon: 'Document'
        }
      },
      {
        path: '/kubernetes/workload/statefulset',
        name: 'kubernetes:workload:statefulset',
        component: modules['/src/views/kubernetes/workload/statefulset/index.vue'],
        meta: {
          title: '有状态应用',
          icon: 'Collection'
        }
      },
      {
        path: '/kubernetes/workload/daemonset',
        name: 'kubernetes:workload:daemonset',
        component: modules['/src/views/kubernetes/workload/daemonset/index.vue'],
        meta: {
          title: '守护进程',
          icon: 'Monitor'
        }
      },
      {
        path: '/kubernetes/workload/job',
        name: 'kubernetes:workload:job',
        component: modules['/src/views/kubernetes/workload/job/index.vue'],
        meta: {
          title: '任务',
          icon: 'Timer'
        }
      },
      {
        path: '/kubernetes/workload/cronjob',
        name: 'kubernetes:workload:cronjob',
        component: modules['/src/views/kubernetes/workload/cronjob/index.vue'],
        meta: {
          title: '定时任务',
          icon: 'Clock'
        }
      }
    ]
  },
  {
    path: '/kubernetes/config',
    name: 'kubernetes:config',
    redirect: '/kubernetes/config/configmap',
    meta: {
      title: '配置',
      icon: 'Setting'
    },
    children: [
      {
        path: '/kubernetes/config/configmap',
        name: 'kubernetes:config:configmap',
        component: modules['/src/views/kubernetes/config/configmap/index.vue'],
        meta: {
          title: '配置映射',
          icon: 'DocumentCopy'
        }
      },
      {
        path: '/kubernetes/config/secret',
        name: 'kubernetes:config:secret',
        component: modules['/src/views/kubernetes/config/secret/index.vue'],
        meta: {
          title: '密钥',
          icon: 'Lock'
        }
      }
    ]
  },
  {
    path: '/kubernetes/network',
    name: 'kubernetes:network',
    redirect: '/kubernetes/network/service',
    meta: {
      title: '网络',
      icon: 'Connection'
    },
    children: [
      {
        path: '/kubernetes/network/service',
        name: 'kubernetes:network:service',
        component: modules['/src/views/kubernetes/network/service/index.vue'],
        meta: {
          title: '服务',
          icon: 'Share'
        }
      },
      {
        path: '/kubernetes/network/ingress',
        name: 'kubernetes:network:ingress',
        component: modules['/src/views/kubernetes/network/ingress/index.vue'],
        meta: {
          title: '入口',
          icon: 'Guide'
        }
      },
      {
        path: '/kubernetes/network/networkpolicy',
        name: 'kubernetes:network:networkpolicy',
        component: modules['/src/views/kubernetes/network/networkpolicy/index.vue'],
        meta: {
          title: '网络策略',
          icon: 'Aim'
        }
      }
    ]
  },
  {
    path: '/kubernetes/storage',
    name: 'kubernetes:storage',
    redirect: '/kubernetes/storage/pvc',
    meta: {
      title: '存储',
      icon: 'Box'
    },
    children: [
      {
        path: '/kubernetes/storage/pvc',
        name: 'kubernetes:storage:pvc',
        component: modules['/src/views/kubernetes/storage/pvc/index.vue'],
        meta: {
          title: '持久卷声明',
          icon: 'Document'
        }
      },
      {
        path: '/kubernetes/storage/pv',
        name: 'kubernetes:storage:pv',
        component: modules['/src/views/kubernetes/storage/pv/index.vue'],
        meta: {
          title: '持久卷',
          icon: 'Files'
        }
      },
      {
        path: '/kubernetes/storage/storageclass',
        name: 'kubernetes:storage:storageclass',
        component: modules['/src/views/kubernetes/storage/storageclass/index.vue'],
        meta: {
          title: '存储类',
          icon: 'Grid'
        }
      }
    ]
  },
  {
    path: '/kubernetes/crd',
    name: 'kubernetes:crd',
    component: modules['/src/views/kubernetes/crd/index.vue'],
    meta: {
      title: '资源定义',
      icon: 'Coin'
    }
  },
  {
    path: '/kubernetes/security',
    name: 'kubernetes:security',
    redirect: '/kubernetes/security/serviceaccount',
    meta: {
      title: '安全',
      icon: 'Key'
    },
    children: [
      {
        path: '/kubernetes/security/serviceaccount',
        name: 'kubernetes:security:serviceaccount',
        component: modules['/src/views/kubernetes/security/serviceaccount/index.vue'],
        meta: {
          title: '服务账号',
          icon: 'User'
        }
      },
      {
        path: '/kubernetes/security/role',
        name: 'kubernetes:security:role',
        component: modules['/src/views/kubernetes/security/role/index.vue'],
        meta: {
          title: '角色',
          icon: 'UserFilled'
        }
      },
      {
        path: '/kubernetes/security/clusterrole',
        name: 'kubernetes:security:clusterrole',
        component: modules['/src/views/kubernetes/security/clusterrole/index.vue'],
        meta: {
          title: '集群角色',
          icon: 'Avatar'
        }
      },
      {
        path: '/kubernetes/security/rolebinding',
        name: 'kubernetes:security:rolebinding',
        component: modules['/src/views/kubernetes/security/rolebinding/index.vue'],
        meta: {
          title: '角色绑定',
          icon: 'Link'
        }
      },
      {
        path: '/kubernetes/security/clusterrolebinding',
        name: 'kubernetes:security:clusterrolebinding',
        component: modules['/src/views/kubernetes/security/clusterrolebinding/index.vue'],
        meta: {
          title: '集群角色绑定',
          icon: 'Connection'
        }
      }
    ]
  }
]

const platformRoutes: RouteRecordRaw[] = [
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
    children: [
      {
        path: '/platform/system/user',
        name: 'platform:system:user',
        meta: {
          title: '用户管理',
          icon: 'User'
        },
        children: [
          {
            path: '',
            name: 'platform:system:user:list',
            component: modules['/src/views/platform/system/user/index.vue'],
            meta: {
              title: '用户列表',
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
      },
      {
        path: '/platform/system/role',
        name: 'platform:system:role',
        meta: {
          title: '角色管理',
          icon: 'Avatar'
        },
        children: [
          {
            path: '',
            name: 'platform:system:role:list',
            component: modules['/src/views/platform/system/role/index.vue'],
            meta: {
              title: '角色列表',
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
      },
      {
        path: '/platform/system/menu',
        name: 'platform:system:menu',
        meta: {
          title: '菜单管理',
          icon: 'Menu'
        },
        children: [
          {
            path: '',
            name: 'platform:system:menu:list',
            component: modules['/src/views/platform/system/menu/index.vue'],
            meta: {
              title: '菜单列表',
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
      },
      {
        path: '/platform/system/permission',
        name: 'platform:system:permission',
        meta: {
          title: '权限管理',
          icon: 'Key'
        },
        children: [
          {
            path: '',
            name: 'platform:system:permission:list',
            component: modules['/src/views/platform/system/permission/index.vue'],
            meta: {
              title: '权限列表',
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
      }
    ]
  }
]

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/kubernetes/dashboard',
    children: [
      ...kubernetesRoutes,
      ...platformRoutes,
      {
        path: '/403',
        name: '403',
        component: modules['/src/views/error/403.vue'],
        meta: {
          title: '403',
          icon: 'Box'
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from) => {
  console.log(to)
  console.log(from)
  const userStore = useUserStore()

  // 登录页直接通过
  if (to.path === '/login') {
    return true
  }

  // 未登录则跳转登录页
  if (!userStore.isLogin()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 检查页面权限
  const permissions = userStore.getCurrentPermissions() || []
  const requiredPermission = to.meta.permission as string | undefined
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return '/403'
  }

  return true
})

router.afterEach(to => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Bee Kube`
  }
})

export default router
