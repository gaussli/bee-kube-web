import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { platformRoutes } from './platform'
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
