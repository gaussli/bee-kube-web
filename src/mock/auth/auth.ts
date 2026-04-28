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

// 平台管理菜单
const platformMenus: CurrentMenu[] = [
  {
    id: '1',
    code: 'system',
    name: '系统配置',
    frontPath: '/system',
    frontIcon: 'Setting',
    type: 0,
    children: [
      {
        id: '1-1',
        code: 'user',
        name: '用户管理',
        frontPath: '/system/user',
        frontIcon: 'User',
        frontComponent: 'system/user/index',
        type: 1
      },
      {
        id: '1-2',
        code: 'role',
        name: '角色管理',
        frontPath: '/system/role',
        frontIcon: 'Avatar',
        frontComponent: 'system/role/index',
        type: 1
      },
      {
        id: '1-3',
        code: 'menu',
        name: '菜单管理',
        frontPath: '/system/menu',
        frontIcon: 'Menu',
        frontComponent: 'system/menu/index',
        type: 1
      }
    ]
  }
]

// 集群管理菜单
const clusterMenus: CurrentMenu[] = [
  {
    id: 'cluster-overview',
    code: 'overview',
    name: '概览',
    frontPath: '/cluster/overview',
    frontIcon: 'Odometer',
    frontComponent: 'cluster/overview/index',
    type: 1
  },
  {
    id: 'cluster-node',
    code: 'node',
    name: '节点',
    frontPath: '/cluster/node',
    frontIcon: 'Box',
    frontComponent: 'cluster/node/index',
    type: 1
  },
  {
    id: 'cluster-namespace',
    code: 'namespace',
    name: '命名空间',
    frontPath: '/cluster/namespace',
    frontIcon: 'FolderOpened',
    frontComponent: 'cluster/namespace/index',
    type: 1
  },
  {
    id: 'cluster-workload',
    code: 'workload',
    name: '工作负载',
    frontPath: '/cluster/workload',
    frontIcon: 'Cpu',
    type: 0,
    children: [
      {
        id: 'cluster-workload-deployment',
        code: 'deployment',
        name: '无状态应用',
        frontPath: '/cluster/workload/deployment',
        frontIcon: 'Document',
        frontComponent: 'cluster/workload/deployment/index',
        type: 1
      },
      {
        id: 'cluster-workload-statefulset',
        code: 'statefulset',
        name: '有状态应用',
        frontPath: '/cluster/workload/statefulset',
        frontIcon: 'Collection',
        frontComponent: 'cluster/workload/statefulset/index',
        type: 1
      },
      {
        id: 'cluster-workload-daemonset',
        code: 'daemonset',
        name: '守护进程',
        frontPath: '/cluster/workload/daemonset',
        frontIcon: 'Monitor',
        frontComponent: 'cluster/workload/daemonset/index',
        type: 1
      }
    ]
  },
  {
    id: 'cluster-config',
    code: 'config',
    name: '配置',
    frontPath: '/cluster/config',
    frontIcon: 'Setting',
    type: 0,
    children: [
      {
        id: 'cluster-config-configmap',
        code: 'configmap',
        name: '配置映射',
        frontPath: '/cluster/config/configmap',
        frontIcon: 'DocumentCopy',
        frontComponent: 'cluster/config/configmap/index',
        type: 1
      },
      {
        id: 'cluster-config-secret',
        code: 'secret',
        name: '密钥',
        frontPath: '/cluster/config/secret',
        frontIcon: 'Lock',
        frontComponent: 'cluster/config/secret/index',
        type: 1
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
    menus: platformMenus,
    clusterMenus: clusterMenus,
    permissions: [
      'system:user:view',
      'system:user:edit',
      'system:user:delete',
      'system:role:view',
      'system:role:edit',
      'system:role:delete',
      'system:menu:view',
      'system:menu:edit',
      'system:menu:delete'
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
