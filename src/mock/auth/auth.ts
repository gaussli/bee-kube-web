import type { CurrentUserResp, LoginReq, LoginResp, CurrentMenu } from '@/types'

function login(req: LoginReq): LoginResp {
  return {
    id: '1',
    username: req.username,
    token: `mock_token_${Date.now()}`
  }
}

function logout() {
  return {}
}

// Kubernetes 菜单
const kubernetesMenus: CurrentMenu[] = [
  {
    id: 'k8s1d2a3s4h5b6o7a8r9d0a1s2h3b4o5a6',
    code: 'kubernetes:dashboard',
    name: 'Dashboard',
    frontPath: '/kubernetes/dashboard',
    frontIcon: 'Odometer',
    frontComponent: '/src/views/kubernetes/dashboard/index.vue',
    type: 1
  },
  {
    id: 'k8s2n3o4d5e6f7g8h9i0j1k2l3m4n5o6p7',
    code: 'kubernetes:node',
    name: '节点',
    frontPath: '/kubernetes/node',
    frontIcon: 'Box',
    frontComponent: '/src/views/kubernetes/node/index.vue',
    type: 1
  },
  {
    id: 'k8s3n4a5m6e7s8p9a0c1e2f3g4h5i6j7k8l9',
    code: 'kubernetes:namespace',
    name: '命名空间',
    frontPath: '/kubernetes/namespace',
    frontIcon: 'FolderOpened',
    frontComponent: '/src/views/kubernetes/namespace/index.vue',
    type: 1
  },
  {
    id: 'k8s4w5o6r7k8l9o0a1d2e3f4g5h6i7j8k9l0',
    code: 'kubernetes:workload',
    name: '工作负载',
    frontPath: '/kubernetes/workload',
    frontIcon: 'Cpu',
    frontRedirect: '/kubernetes/workload/deployment',
    type: 0,
    children: [
      {
        id: 'k8s5d6e7p8l9o0y1m2e3n4t5f6o7r8m9a0t1',
        code: 'kubernetes:workload:deployment',
        name: '无状态应用',
        frontPath: '/kubernetes/workload/deployment',
        frontIcon: 'Document',
        frontComponent: '/src/views/kubernetes/workload/deployment/index.vue',
        type: 1
      },
      {
        id: 'k8s6s7t8a9t0e1f2u3l4s5e6t7f8o9r0m1a2t3',
        code: 'kubernetes:workload:statefulset',
        name: '有状态应用',
        frontPath: '/kubernetes/workload/statefulset',
        frontIcon: 'Collection',
        frontComponent: '/src/views/kubernetes/workload/statefulset/index.vue',
        type: 1
      },
      {
        id: 'k8s7d8a9e0m1o2n3s4e5t6f7o8r9m0a1n2a3g4',
        code: 'kubernetes:workload:daemonset',
        name: '守护进程',
        frontPath: '/kubernetes/workload/daemonset',
        frontIcon: 'Monitor',
        frontComponent: '/src/views/kubernetes/workload/daemonset/index.vue',
        type: 1
      },
      {
        id: 'k8s8j9o0b1t2a3s4k5c6r7o8n9j0o1b2m3a4n5',
        code: 'kubernetes:workload:job',
        name: '任务',
        frontPath: '/kubernetes/workload/job',
        frontIcon: 'Timer',
        frontComponent: '/src/views/kubernetes/workload/job/index.vue',
        type: 1
      },
      {
        id: 'k8s9c0r1o2n3j4o5b6s7c8h9e0d1u2l3e4t5a6s',
        code: 'kubernetes:workload:cronjob',
        name: '定时任务',
        frontPath: '/kubernetes/workload/cronjob',
        frontIcon: 'Clock',
        frontComponent: '/src/views/kubernetes/workload/cronjob/index.vue',
        type: 1
      }
    ]
  },
  {
    id: 'k8s0c1o2n3f4i5g6u7r8e9t0a1b2c3d4e5f6',
    code: 'kubernetes:config',
    name: '配置',
    frontPath: '/kubernetes/config',
    frontIcon: 'Setting',
    frontRedirect: '/kubernetes/config/configmap',
    type: 0,
    children: [
      {
        id: 'k8s1c2o3n4f5i6g7m8a9p0b1c2d3e4f5g6h7i8',
        code: 'kubernetes:config:configmap',
        name: '配置映射',
        frontPath: '/kubernetes/config/configmap',
        frontIcon: 'DocumentCopy',
        frontComponent: '/src/views/kubernetes/config/configmap/index.vue',
        type: 1
      },
      {
        id: 'k8s2s3e4c5r6e7t8f9g0h1i2j3k4l5m6n7o8',
        code: 'kubernetes:config:secret',
        name: '密钥',
        frontPath: '/kubernetes/config/secret',
        frontIcon: 'Lock',
        frontComponent: '/src/views/kubernetes/config/secret/index.vue',
        type: 1
      }
    ]
  },
  {
    id: 'k8s3n4e5t6w7o8r9k0p1o2l3i4c5y6q7r8s9t0',
    code: 'kubernetes:network',
    name: '网络',
    frontPath: '/kubernetes/network',
    frontIcon: 'Connection',
    frontRedirect: '/kubernetes/network/service',
    type: 0,
    children: [
      {
        id: 'k8s4s5e6r7v8i9c0e1f2g3h4i5j6k7l8m9n0o1',
        code: 'kubernetes:network:service',
        name: '服务',
        frontPath: '/kubernetes/network/service',
        frontIcon: 'Share',
        frontComponent: '/src/views/kubernetes/network/service/index.vue',
        type: 1
      },
      {
        id: 'k8s5i6n7g8r9e0s1s2o3u4r5c6e7f8g9h0i1j2',
        code: 'kubernetes:network:ingress',
        name: '入口',
        frontPath: '/kubernetes/network/ingress',
        frontIcon: 'Guide',
        frontComponent: '/src/views/kubernetes/network/ingress/index.vue',
        type: 1
      },
      {
        id: 'k8s6n7e8t9w0o1r2k3p4o5l6i7c8y9p0o1l2i3c4y',
        code: 'kubernetes:network:networkpolicy',
        name: '网络策略',
        frontPath: '/kubernetes/network/networkpolicy',
        frontIcon: 'Aim',
        frontComponent: '/src/views/kubernetes/network/networkpolicy/index.vue',
        type: 1
      }
    ]
  },
  {
    id: 'k8s7s8t9o0r1a2g3e4p5r6o7v8i9s0i1o2n3',
    code: 'kubernetes:storage',
    name: '存储',
    frontPath: '/kubernetes/storage',
    frontIcon: 'Box',
    frontRedirect: '/kubernetes/storage/pvc',
    type: 0,
    children: [
      {
        id: 'k8s8p9v0c1r2e3s4i5s6t7e8n9t0c1l2a3i4m5e6n7t',
        code: 'kubernetes:storage:pvc',
        name: '持久卷声明',
        frontPath: '/kubernetes/storage/pvc',
        frontIcon: 'Document',
        frontComponent: '/src/views/kubernetes/storage/pvc/index.vue',
        type: 1
      },
      {
        id: 'k8s9p0v1e2r3s4i5s6t7e8n9v0o1l2u3m4e5',
        code: 'kubernetes:storage:pv',
        name: '持久卷',
        frontPath: '/kubernetes/storage/pv',
        frontIcon: 'Files',
        frontComponent: '/src/views/kubernetes/storage/pv/index.vue',
        type: 1
      },
      {
        id: 'k8s0s1t2o3r4a5g6e7c8l9a0s1s2s3s4c5o6',
        code: 'kubernetes:storage:storageclass',
        name: '存储类',
        frontPath: '/kubernetes/storage/storageclass',
        frontIcon: 'Grid',
        frontComponent: '/src/views/kubernetes/storage/storageclass/index.vue',
        type: 1
      }
    ]
  },
  {
    id: 'k8s1c2r3d4r5e6s7o8u9r0c1e2d3e4f5i6n7i8t9',
    code: 'kubernetes:crd',
    name: '资源定义',
    frontPath: '/kubernetes/crd',
    frontIcon: 'Coin',
    frontComponent: '/src/views/kubernetes/crd/index.vue',
    type: 1
  },
  {
    id: 'k8s2s3e4c5u6r7i8t9y0p1o2l3i4c5y6s7e8c9u0',
    code: 'kubernetes:security',
    name: '安全',
    frontPath: '/kubernetes/security',
    frontIcon: 'Key',
    frontRedirect: '/kubernetes/security/serviceaccount',
    type: 0,
    children: [
      {
        id: 'k8s3s4e5r6v7i8c9e0a1c2c3o4u5n6t7a8c9c0o1u2n3t',
        code: 'kubernetes:security:serviceaccount',
        name: '服务账号',
        frontPath: '/kubernetes/security/serviceaccount',
        frontIcon: 'User',
        frontComponent: '/src/views/kubernetes/security/serviceaccount/index.vue',
        type: 1
      },
      {
        id: 'k8s4r5o6l7e8c9b0i1n2d3i4n5g6o7r8i9g0',
        code: 'kubernetes:security:role',
        name: '角色',
        frontPath: '/kubernetes/security/role',
        frontIcon: 'UserFilled',
        frontComponent: '/src/views/kubernetes/security/role/index.vue',
        type: 1
      },
      {
        id: 'k8s5c6l7u8s9t0e1r2c3l4u5s6t7e8r9o0l1e2',
        code: 'kubernetes:security:clusterrole',
        name: '集群角色',
        frontPath: '/kubernetes/security/clusterrole',
        frontIcon: 'Avatar',
        frontComponent: '/src/views/kubernetes/security/clusterrole/index.vue',
        type: 1
      },
      {
        id: 'k8s6r7o8l9e0b1i2n3d4i5n6g7o8r9i0b1n2d3i4n5g',
        code: 'kubernetes:security:rolebinding',
        name: '角色绑定',
        frontPath: '/kubernetes/security/rolebinding',
        frontIcon: 'Link',
        frontComponent: '/src/views/kubernetes/security/rolebinding/index.vue',
        type: 1
      },
      {
        id: 'k8s7c8l9u0s1t2e3r4c5l6u7s8t9e0r1b2i3n4d5',
        code: 'kubernetes:security:clusterrolebinding',
        name: '集群角色绑定',
        frontPath: '/kubernetes/security/clusterrolebinding',
        frontIcon: 'Connection',
        frontComponent: '/src/views/kubernetes/security/clusterrolebinding/index.vue',
        type: 1
      }
    ]
  }
]

// 平台管理子菜单
const platformMenus: CurrentMenu[] = [
  {
    id: 'd1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7',
    code: 'platform:dashboard',
    name: '仪表盘',
    frontPath: '/platform/dashboard',
    frontIcon: 'Odometer',
    frontComponent: '/src/views/platform/dashboard/index.vue',
    type: 1
  },
  {
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    code: 'platform:system',
    name: '系统配置',
    frontPath: '/platform/system',
    frontIcon: 'Setting',
    type: 1,
    children: [
      {
        id: 'q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7',
        code: 'platform:system:user',
        name: '用户管理',
        frontPath: '/platform/system/user',
        frontIcon: 'User',
        type: 1,
        children: [
          {
            id: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
            code: 'platform:system:user:list',
            name: '用户列表',
            frontPath: '',
            frontIcon: 'User',
            frontComponent: '/src/views/platform/system/user/index.vue',
            permission: 'platform:system:user:view',
            type: 2,
            activeCode: 'platform:system:user'
          },
          {
            id: 'y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0',
            code: 'platform:system:user:detail',
            name: '用户详情',
            frontPath: ':id/detail',
            frontIcon: 'InfoFilled',
            frontComponent: '/src/views/platform/system/user/detail/index.vue',
            permission: 'platform:system:user:view',
            type: 2,
            activeCode: 'platform:system:user'
          },
          {
            id: 'o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6',
            code: 'platform:system:user:create',
            name: '创建用户',
            frontPath: 'create',
            frontIcon: 'Plus',
            frontComponent: '/src/views/platform/system/user/create/index.vue',
            permission: 'platform:system:user:create',
            type: 2,
            activeCode: 'platform:system:user'
          },
          {
            id: 'e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2',
            code: 'platform:system:user:edit',
            name: '编辑用户',
            frontPath: ':id/edit',
            frontIcon: 'EditPen',
            frontComponent: '/src/views/platform/system/user/edit/index.vue',
            permission: 'platform:system:user:edit',
            type: 2,
            activeCode: 'platform:system:user'
          },
          {
            id: 'u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j',
            code: 'platform:system:user:assign-roles',
            name: '配置角色',
            frontPath: ':id/assign-roles',
            frontIcon: 'Key',
            frontComponent: '/src/views/platform/system/user/assign-roles/index.vue',
            permission: 'platform:system:user:edit',
            type: 2,
            activeCode: 'platform:system:user'
          }
        ]
      },
      {
        id: 'k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4',
        code: 'platform:system:role',
        name: '角色管理',
        frontPath: '/platform/system/role',
        frontIcon: 'Avatar',
        type: 1,
        children: [
          {
            id: 'b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1',
            code: 'platform:system:role:list',
            name: '角色列表',
            frontPath: '',
            frontIcon: 'Avatar',
            frontComponent: '/src/views/platform/system/role/index.vue',
            permission: 'platform:system:role:view',
            type: 2,
            activeCode: 'platform:system:role'
          },
          {
            id: 's2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7',
            code: 'platform:system:role:detail',
            name: '角色详情',
            frontPath: ':id/detail',
            frontIcon: 'InfoFilled',
            frontComponent: '/src/views/platform/system/role/detail/index.vue',
            permission: 'platform:system:role:view',
            type: 2,
            activeCode: 'platform:system:role'
          },
          {
            id: 'i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y',
            code: 'platform:system:role:create',
            name: '创建角色',
            frontPath: 'create',
            frontIcon: 'Plus',
            frontComponent: '/src/views/platform/system/role/create/index.vue',
            permission: 'platform:system:role:create',
            type: 2,
            activeCode: 'platform:system:role'
          },
          {
            id: 'z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9',
            code: 'platform:system:role:edit',
            name: '编辑角色',
            frontPath: ':id/edit',
            frontIcon: 'EditPen',
            frontComponent: '/src/views/platform/system/role/edit/index.vue',
            permission: 'platform:system:role:edit',
            type: 2,
            activeCode: 'platform:system:role'
          },
          {
            id: 'p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5',
            code: 'platform:system:role:assign-permissions',
            name: '配置权限',
            frontPath: ':id/assign-permissions',
            frontIcon: 'Key',
            frontComponent: '/src/views/platform/system/role/assign-permissions/index.vue',
            permission: 'platform:system:role:edit',
            type: 2,
            activeCode: 'platform:system:role'
          },
          {
            id: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
            code: 'platform:system:role:assign-users',
            name: '配置用户',
            frontPath: ':id/assign-users',
            frontIcon: 'User',
            frontComponent: '/src/views/platform/system/role/assign-users/index.vue',
            permission: 'platform:system:role:edit',
            type: 2,
            activeCode: 'platform:system:role'
          }
        ]
      },
      {
        id: 'v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7',
        code: 'platform:system:menu',
        name: '菜单管理',
        frontPath: 'platform/system/menu',
        frontIcon: 'Menu',
        type: 1,
        children: [
          {
            id: 'l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3',
            code: 'platform:system:menu:list',
            name: '菜单列表',
            frontPath: '',
            frontIcon: 'Menu',
            frontComponent: '/src/views/platform/system/menu/index.vue',
            permission: 'platform:system:menu:view',
            type: 2,
            activeCode: 'platform:system:menu'
          },
          {
            id: 'b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9',
            code: 'platform:system:menu:detail',
            name: '菜单详情',
            frontPath: ':id/detail',
            frontIcon: 'InfoFilled',
            frontComponent: '/src/views/platform/system/menu/detail/index.vue',
            permission: 'platform:system:menu:view',
            type: 2,
            activeCode: 'platform:system:menu'
          },
          {
            id: 'r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5',
            code: 'platform:system:menu:create',
            name: '创建菜单',
            frontPath: 'create',
            frontIcon: 'Plus',
            frontComponent: '/src/views/platform/system/menu/create/index.vue',
            permission: 'platform:system:menu:create',
            type: 2,
            activeCode: 'platform:system:menu'
          },
          {
            id: 'h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1',
            code: 'platform:system:menu:edit',
            name: '编辑菜单',
            frontPath: ':id/edit',
            frontIcon: 'EditPen',
            frontComponent: '/src/views/platform/system/menu/edit/index.vue',
            permission: 'platform:system:menu:edit',
            type: 2,
            activeCode: 'platform:system:menu'
          },
          {
            id: 'x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7',
            code: 'platform:system:menu:assign-roles',
            name: '配置角色',
            frontPath: ':id/assign-roles',
            frontIcon: 'Key',
            frontComponent: '/src/views/platform/system/menu/assign-roles/index.vue',
            permission: 'platform:system:menu:edit',
            type: 2,
            activeCode: 'platform:system:menu'
          }
        ]
      },
      {
        id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5q6',
        code: 'platform:system:permission',
        name: '权限管理',
        frontPath: 'platform/system/permission',
        frontIcon: 'Key',
        type: 1,
        children: [
          {
            id: 'r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2',
            code: 'platform:system:permission:list',
            name: '权限列表',
            frontPath: '',
            frontIcon: 'Key',
            frontComponent: '/src/views/platform/system/permission/index.vue',
            permission: 'platform:system:permission:view',
            type: 2,
            activeCode: 'platform:system:permission'
          },
          {
            id: 'h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8',
            code: 'platform:system:permission:detail',
            name: '权限详情',
            frontPath: ':id/detail',
            frontIcon: 'InfoFilled',
            frontComponent: '/src/views/platform/system/permission/detail/index.vue',
            permission: 'platform:system:permission:view',
            type: 2,
            activeCode: 'platform:system:permission'
          },
          {
            id: 'x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4',
            code: 'platform:system:permission:create',
            name: '新增权限',
            frontPath: 'create',
            frontIcon: 'Plus',
            frontComponent: '/src/views/platform/system/permission/create/index.vue',
            permission: 'platform:system:permission:create',
            type: 2,
            activeCode: 'platform:system:permission'
          },
          {
            id: 'n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0',
            code: 'platform:system:permission:edit',
            name: '编辑权限',
            frontPath: ':id/edit',
            frontIcon: 'EditPen',
            frontComponent: '/src/views/platform/system/permission/edit/index.vue',
            permission: 'platform:system:permission:edit',
            type: 2,
            activeCode: 'platform:system:permission'
          }
        ]
      }
    ]
  }
]

// 当前用户菜单
const currentMenus: CurrentMenu[] = [
  {
    id: 'h1o2m3e4a5b6c7d8e9f0g1h2i3j4k5l6',
    code: 'home',
    name: 'Home',
    frontPath: '/',
    frontIcon: 'HomeFilled',
    frontRedirect: '/kubernetes',
    frontComponent: '/src/views/home/index.vue',
    type: 0,
    children: [
      {
        id: 'c1l2u3s4t5e6r7c8l9u0s1t2e3r4m5a6n7a8g9e0',
        code: 'kubernetes',
        name: '集群管理',
        frontPath: '/kubernetes',
        frontIcon: 'Box',
        frontRedirect: '/kubernetes/dashboard',
        type: 0,
        children: kubernetesMenus
      },
      {
        id: 'p1l2a3t4f5o6r7m8e9n0a1t2f3o4r5m6',
        code: 'platform',
        name: '平台管理',
        frontPath: '/platform',
        frontIcon: 'Monitor',
        frontRedirect: '/platform/dashboard',
        type: 0,
        children: platformMenus
      },
      {
        id: 'e4r4r0r1r2r3o4r5r6r7r8r9s0s1s2t3',
        code: '403',
        name: '403',
        frontPath: '/403',
        frontIcon: 'Box',
        frontComponent: '/src/views/error/403.vue',
        type: 2
      }
    ]
  }
]

function getCurrentUser(): CurrentUserResp {
  return {
    user: {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      mobile: '13800138000',
      gender: 1,
      avatarId: ''
    },
    menus: currentMenus,
    permissions: [
      'platform:system:user:view',
      'platform:system:user:create',
      'platform:system:user:edit',
      'platform:system:user:delete',
      'platform:system:role:view',
      'platform:system:role:create',
      'platform:system:role:edit',
      'platform:system:role:delete',
      'platform:system:menu:view',
      'platform:system:menu:create',
      'platform:system:menu:edit',
      'platform:system:menu:delete'
    ]
  }
}

export default [
  {
    method: 'post',
    url: '/auth/login',
    handler: (payload: any) => login(payload)
  },
  {
    method: 'post',
    url: '/auth/logout',
    handler: () => logout()
  },
  {
    method: 'get',
    url: '/auth/current',
    handler: () => getCurrentUser()
  }
]
