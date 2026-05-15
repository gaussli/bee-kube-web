import type { PageResp, RoleDetailResp, RoleQueryReq, RoleResp } from '@/types'

// 生成32位随机ID（数字+小写字母）
function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Mock 角色数据（12条）
let mockRoles: RoleResp[] = [
  {
    id: generateId(),
    code: 'super_admin',
    name: '超级管理员',
    description: '拥有系统所有权限，可进行系统配置和管理',
    sort: 1,
    status: 1,
    isSystem: true,
    createAt: '2024-01-15 09:30:22',
    createBy: 'system',
    updateAt: '2024-04-10 14:22:35',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'admin',
    name: '管理员',
    description: '系统管理员，可管理用户、角色和菜单',
    sort: 2,
    status: 1,
    isSystem: true,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-04-08 16:30:42',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'user_manager',
    name: '用户管理员',
    description: '负责用户账号的创建、编辑、禁用启用等操作。该角色拥有用户管理的全部权限，包括查看用户列表、新增用户账号、编辑用户信息、重置密码、批量导入导出等操作',
    sort: 3,
    status: 1,
    createAt: '2024-02-01 14:15:36',
    createBy: 'admin',
    updateAt: '2024-04-12 10:05:18',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'viewer',
    name: '查看者',
    description: '仅可查看系统数据，无修改权限',
    sort: 4,
    status: 1,
    createAt: '2024-02-10 11:22:08',
    createBy: 'admin',
    updateAt: '2024-03-15 09:45:27',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'operator',
    name: '操作员',
    description: '可进行日常业务操作和数据录入。该角色适用于一线业务人员，负责日常业务的受理和处理。包括表单填写、数据录入、流程发起、任务认领和办理等业务操作',
    sort: 5,
    status: 1,
    createAt: '2024-02-20 08:55:43',
    createBy: 'admin',
    updateAt: '2024-04-01 13:42:51',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'auditor',
    name: '审计员',
    description: '查看系统操作日志和审计信息',
    sort: 6,
    status: 0,
    createAt: '2024-03-01 16:30:57',
    createBy: 'admin',
    updateAt: '2024-04-05 11:58:33',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'finance',
    name: '财务人员',
    description: '财务相关模块的访问和操作权限',
    sort: 7,
    status: 1,
    createAt: '2024-03-10 10:45:22',
    createBy: 'admin',
    updateAt: '2024-04-10 08:25:16',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'hr',
    name: '人事专员',
    description: '人事管理模块的操作权限',
    sort: 8,
    status: 1,
    createAt: '2024-03-15 14:20:18',
    createBy: 'admin',
    updateAt: '2024-04-08 17:35:09',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'guest',
    name: '访客',
    description: '临时访问账号，权限受限',
    sort: 9,
    status: 0,
    createAt: '2024-03-20 09:15:34',
    createBy: 'admin',
    updateAt: '2024-04-02 15:22:41',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'developer',
    name: '开发人员',
    description: '开发相关配置和测试权限',
    sort: 10,
    status: 1,
    createAt: '2024-03-25 11:30:45',
    createBy: 'admin',
    updateAt: '2024-04-12 14:08:52',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'tester',
    name: '测试人员',
    description: '测试环境访问和测试数据操作权限',
    sort: 11,
    status: 1,
    createAt: '2024-04-01 08:42:18',
    createBy: 'admin',
    updateAt: '2024-04-11 10:15:33',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    code: 'ops',
    name: '运维人员',
    description: '系统运维和监控相关权限',
    sort: 12,
    status: 0,
    createAt: '2024-04-05 15:55:28',
    createBy: 'admin',
    updateAt: '2024-04-14 16:42:17',
    updateBy: 'admin'
  }
]

// 获取角色详情
function getRoleDetail(id: string): RoleDetailResp | undefined {
  const role = mockRoles.find(r => r.id === id)
  if (role) {
    return role as unknown as RoleDetailResp
  }
  return undefined
}

export default [
  // 分页查询角色列表
  {
    method: 'get',
    url: '/system/roles',
    handler: (params: RoleQueryReq): PageResp<RoleResp> => {
      let filtered = [...mockRoles]

      // 按 ID 精确搜索
      if (params.id) {
        filtered = filtered.filter(r => r.id.includes(params.id!))
      }

      // 按名称模糊搜索
      if (params.name) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(params.name!.toLowerCase()))
      }

      // 按编码模糊搜索
      if (params.code) {
        filtered = filtered.filter(r => r.code.toLowerCase().includes(params.code!.toLowerCase()))
      }

      // 按状态筛选
      if (params.status !== undefined) {
        filtered = filtered.filter(r => r.status === params.status)
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filtered.slice(start, end)

      return {
        list,
        total: filtered.length,
        page,
        pageSize
      }
    }
  },

  // 获取角色详情
  {
    method: 'get',
    url: '/system/roles/:id',
    handler: (params: { id: string }): RoleDetailResp | undefined => {
      return getRoleDetail(params.id)
    }
  },

  // 创建角色
  {
    method: 'post',
    url: '/system/roles',
    handler: (payload: any): string => {
      const newRole: RoleResp = {
        id: generateId(),
        code: payload.code,
        name: payload.name,
        description: payload.description,
        sort: payload.sort || 99,
        status: payload.status,
        createAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        createBy: 'admin',
        updateAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateBy: 'admin'
      }
      mockRoles.unshift(newRole)
      return newRole.id
    }
  },

  // 更新角色
  {
    method: 'put',
    url: '/system/roles/:id',
    handler: (params: { id: string }, payload: any): string => {
      const index = mockRoles.findIndex(r => r.id === params.id)
      if (index !== -1) {
        mockRoles[index] = {
          ...mockRoles[index],
          ...payload,
          updateAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updateBy: 'admin'
        }
        return mockRoles[index].id
      }
      throw new Error('角色不存在')
    }
  },

  // 修改角色状态
  {
    method: 'post',
    url: '/system/roles/:id/status',
    handler: (params: { id: string }, payload: { status: number }): void => {
      const role = mockRoles.find(r => r.id === params.id)
      if (role) {
        role.status = payload.status
        role.updateAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
        role.updateBy = 'admin'
      }
    }
  },

  // 删除角色
  {
    method: 'delete',
    url: '/system/roles/:id',
    handler: (params: { id: string }): void => {
      const index = mockRoles.findIndex(r => r.id === params.id)
      if (index !== -1) {
        mockRoles.splice(index, 1)
      }
    }
  },

  // 批量删除角色
  {
    method: 'delete',
    url: '/system/roles',
    handler: (params: { ids: string[] }): void => {
      mockRoles = mockRoles.filter(r => !params.ids.includes(r.id))
    }
  }
]
