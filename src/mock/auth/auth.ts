import type { CurrentUserResp, LoginReq, LoginResp } from '@/types'

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
    menus: [
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
    ],
    permissions: ['system:user:view', 'system:user:create', 'system:user:update', 'system:user:delete']
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
