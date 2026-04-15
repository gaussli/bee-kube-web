import type { UserQueryReq } from '@/types'
import type { PageResp } from '@/types/common'
import type { UserResp } from '@/types/user'

// 生成32位随机ID（数字+小写字母）
function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Mock 用户数据（更真实）
const mockUsers: UserResp[] = [
  { id: generateId(), username: 'admin', nickname: '超级管理员', status: 1, createAt: '2024-01-15 09:30:22', createBy: 'system', updateAt: '2024-04-10 14:22:35', updateBy: 'admin' },
  { id: generateId(), username: 'zhangsan', nickname: '张三', status: 1, createAt: '2024-02-08 14:15:36', createBy: 'admin', updateAt: '2024-04-12 10:05:18', updateBy: 'admin' },
  { id: generateId(), username: 'lisi', nickname: '李四', status: 1, createAt: '2024-02-20 10:45:11', createBy: 'admin', updateAt: '2024-04-08 16:30:42', updateBy: 'zhangsan' },
  { id: generateId(), username: 'wangwu', nickname: '王五', status: 0, createAt: '2024-03-05 16:22:08', createBy: 'admin', updateAt: '2024-04-11 11:15:27', updateBy: 'admin' },
  { id: generateId(), username: 'zhaoliu', nickname: '赵六', status: 1, createAt: '2024-03-12 08:55:43', createBy: 'zhangsan', updateAt: '2024-04-09 09:42:51', updateBy: 'zhangsan' },
  { id: generateId(), username: 'sunqi', nickname: '孙七', status: 0, createAt: '2024-03-18 11:30:57', createBy: 'zhangsan', updateAt: '2024-04-07 14:58:33', updateBy: 'lisi' },
  { id: generateId(), username: 'zhouba', nickname: '周八', status: 1, createAt: '2024-03-25 15:10:22', createBy: 'lisi', updateAt: '2024-04-13 08:25:16', updateBy: 'lisi' },
  { id: generateId(), username: 'wujiu', nickname: '吴九', status: 1, createAt: '2024-04-02 09:42:18', createBy: 'lisi', updateAt: '2024-04-14 17:35:09', updateBy: 'admin' },
  { id: generateId(), username: 'zhengshi', nickname: '郑十', status: 0, createAt: '2024-04-10 13:25:34', createBy: 'admin', updateAt: '2024-04-10 13:25:34', updateBy: 'admin' },
  { id: generateId(), username: 'caihua', nickname: '蔡华', status: 1, createAt: '2024-04-15 17:08:45', createBy: 'zhangsan', updateAt: '2024-04-15 17:08:45', updateBy: 'zhangsan' }
]

function getUserPage(params: UserQueryReq): PageResp<UserResp> {
  const { page = 1, pageSize = 10, username, nickname, status } = params || {}
  let filtered = mockUsers

  // 按用户名模糊搜索
  if (username) {
    filtered = filtered.filter(u => u.username.toLowerCase().includes(username.toLowerCase()))
  }
  // 按昵称模糊搜索
  if (nickname) {
    filtered = filtered.filter(u => u.nickname.includes(nickname))
  }
  // 按状态筛选
  if (status !== undefined) {
    filtered = filtered.filter(u => u.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    list: filtered.slice(start, end),
    total,
    page,
    pageSize
  }
}

export default [
  {
    method: 'get',
    url: '/system/users',
    handler: (params: any) => getUserPage(params)
  }
]
