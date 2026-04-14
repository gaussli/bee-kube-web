import type { UserInfo } from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 生成请求 ID (UUID 格式，去除横线)
const generateRequestId = () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  return uuid.replace(/-/g, '')
}

// 用户信息
const mockUserInfo: UserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  email: 'admin@example.com',
  phone: '13800138000',
  roles: ['admin']
}

// 登录接口
export async function loginApi(data: { username: string; password: string }) {
  await delay(500)

  if (data.username === 'admin' && data.password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: `mock_token_${Date.now()}`,
        userInfo: mockUserInfo
      },
      requestId: generateRequestId()
    }
  }

  return {
    code: 401,
    message: '用户名或密码错误',
    data: null,
    requestId: generateRequestId()
  }
}

// 获取用户信息
export async function getUserInfoApi() {
  await delay(300)
  return {
    code: 200,
    message: '获取成功',
    data: mockUserInfo,
    requestId: generateRequestId()
  }
}

// 获取菜单列表
export async function getMenuListApi() {
  await delay(300)
  return {
    code: 200,
    message: '获取成功',
    data: [
      {
        id: 1,
        name: '首页',
        path: '/dashboard',
        icon: 'HomeFilled'
      },
      {
        id: 2,
        name: '系统管理',
        path: '/system',
        icon: 'Setting',
        children: [
          { id: 21, name: '用户管理', path: '/system/user', icon: 'User' },
          { id: 22, name: '角色管理', path: '/system/role', icon: 'Avatar' }
        ]
      }
    ],
    requestId: generateRequestId()
  }
}
