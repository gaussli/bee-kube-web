import type { RouteRecordRaw } from 'vue-router'

export const kubernetesRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes',
    name: 'kubernetes',
    redirect: '/kubernetes/dashboard'
  },
  {
    path: '/kubernetes/dashboard',
    name: 'kubernetes:dashboard',
    component: () => import('@/views/kubernetes/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'Odometer'
    }
  },
  {
    path: '/kubernetes/node',
    name: 'kubernetes:node',
    component: () => import('@/views/kubernetes/node/index.vue'),
    meta: {
      title: '节点',
      icon: 'Box'
    }
  },
  {
    path: '/kubernetes/namespace',
    name: 'kubernetes:namespace',
    component: () => import('@/views/kubernetes/namespace/index.vue'),
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
        component: () => import('@/views/kubernetes/workload/deployment/index.vue'),
        meta: {
          title: '无状态应用',
          icon: 'Document'
        }
      },
      {
        path: '/kubernetes/workload/statefulset',
        name: 'kubernetes:workload:statefulset',
        component: () => import('@/views/kubernetes/workload/statefulset/index.vue'),
        meta: {
          title: '有状态应用',
          icon: 'Collection'
        }
      },
      {
        path: '/kubernetes/workload/daemonset',
        name: 'kubernetes:workload:daemonset',
        component: () => import('@/views/kubernetes/workload/daemonset/index.vue'),
        meta: {
          title: '守护进程',
          icon: 'Monitor'
        }
      },
      {
        path: '/kubernetes/workload/job',
        name: 'kubernetes:workload:job',
        component: () => import('@/views/kubernetes/workload/job/index.vue'),
        meta: {
          title: '任务',
          icon: 'Timer'
        }
      },
      {
        path: '/kubernetes/workload/cronjob',
        name: 'kubernetes:workload:cronjob',
        component: () => import('@/views/kubernetes/workload/cronjob/index.vue'),
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
        component: () => import('@/views/kubernetes/config/configmap/index.vue'),
        meta: {
          title: '配置映射',
          icon: 'DocumentCopy'
        }
      },
      {
        path: '/kubernetes/config/secret',
        name: 'kubernetes:config:secret',
        component: () => import('@/views/kubernetes/config/secret/index.vue'),
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
        component: () => import('@/views/kubernetes/network/service/index.vue'),
        meta: {
          title: '服务',
          icon: 'Share'
        }
      },
      {
        path: '/kubernetes/network/ingress',
        name: 'kubernetes:network:ingress',
        component: () => import('@/views/kubernetes/network/ingress/index.vue'),
        meta: {
          title: '入口',
          icon: 'Guide'
        }
      },
      {
        path: '/kubernetes/network/networkpolicy',
        name: 'kubernetes:network:networkpolicy',
        component: () => import('@/views/kubernetes/network/networkpolicy/index.vue'),
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
        component: () => import('@/views/kubernetes/storage/pvc/index.vue'),
        meta: {
          title: '持久卷声明',
          icon: 'Document'
        }
      },
      {
        path: '/kubernetes/storage/pv',
        name: 'kubernetes:storage:pv',
        component: () => import('@/views/kubernetes/storage/pv/index.vue'),
        meta: {
          title: '持久卷',
          icon: 'Files'
        }
      },
      {
        path: '/kubernetes/storage/storageclass',
        name: 'kubernetes:storage:storageclass',
        component: () => import('@/views/kubernetes/storage/storageclass/index.vue'),
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
    component: () => import('@/views/kubernetes/crd/index.vue'),
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
        component: () => import('@/views/kubernetes/security/serviceaccount/index.vue'),
        meta: {
          title: '服务账号',
          icon: 'User'
        }
      },
      {
        path: '/kubernetes/security/role',
        name: 'kubernetes:security:role',
        component: () => import('@/views/kubernetes/security/role/index.vue'),
        meta: {
          title: '角色',
          icon: 'UserFilled'
        }
      },
      {
        path: '/kubernetes/security/clusterrole',
        name: 'kubernetes:security:clusterrole',
        component: () => import('@/views/kubernetes/security/clusterrole/index.vue'),
        meta: {
          title: '集群角色',
          icon: 'Avatar'
        }
      },
      {
        path: '/kubernetes/security/rolebinding',
        name: 'kubernetes:security:rolebinding',
        component: () => import('@/views/kubernetes/security/rolebinding/index.vue'),
        meta: {
          title: '角色绑定',
          icon: 'Link'
        }
      },
      {
        path: '/kubernetes/security/clusterrolebinding',
        name: 'kubernetes:security:clusterrolebinding',
        component: () => import('@/views/kubernetes/security/clusterrolebinding/index.vue'),
        meta: {
          title: '集群角色绑定',
          icon: 'Connection'
        }
      }
    ]
  }
]
