import type { MenuDetailResp, MenuQueryReq, MenuResp, PageVo } from '@/types'

// 生成32位随机ID（数字+小写字母）
function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// 预定义父级ID
const systemId = generateId()
const userId = generateId()
const businessId = generateId()
const reportId = generateId()

// Mock 菜单数据
const mockMenus: MenuResp[] = [
  {
    id: systemId,
    code: 'system',
    name: '系统配置',
    frontPath: '/system',
    frontIcon: 'Setting',
    type: 0,
    status: 1,
    createAt: '2024-01-15 09:30:22',
    createBy: 'system',
    updateAt: '2024-04-10 14:22:35',
    updateBy: 'admin',
  },
  {
    id: userId,
    code: 'user',
    name: '用户管理',
    parentId: systemId,
    parentName: '系统配置',
    parentCode: 'system',
    frontPath: '/system/user',
    frontIcon: 'User',
    type: 1,
    status: 1,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-04-12 10:05:18',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'role',
    name: '角色管理',
    parentId: systemId,
    parentName: '系统配置',
    parentCode: 'system',
    frontPath: '/system/role',
    frontIcon: 'Avatar',
    type: 1,
    status: 1,
    createAt: '2024-01-15 10:05:00',
    createBy: 'system',
    updateAt: '2024-04-11 16:30:42',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'menu',
    name: '菜单管理',
    parentId: systemId,
    parentName: '系统配置',
    parentCode: 'system',
    frontPath: '/system/menu',
    frontIcon: 'Menu',
    type: 1,
    status: 1,
    createAt: '2024-01-15 10:10:00',
    createBy: 'system',
    updateAt: '2024-04-09 11:15:27',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'user-create',
    name: '创建用户',
    parentId: userId,
    parentName: '用户管理',
    parentCode: 'user',
    permission: 'system:user:create',
    type: 2,
    status: 1,
    createAt: '2024-01-16 09:00:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:30:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'user-update',
    name: '编辑用户',
    parentId: userId,
    parentName: '用户管理',
    parentCode: 'user',
    permission: 'system:user:edit',
    type: 2,
    status: 1,
    createAt: '2024-01-16 09:05:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:35:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'user-delete',
    name: '删除用户',
    parentId: userId,
    parentName: '用户管理',
    parentCode: 'user',
    permission: 'system:user:delete',
    type: 2,
    status: 1,
    createAt: '2024-01-16 09:10:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:40:00',
    updateBy: 'admin',
  },
  {
    id: businessId,
    code: 'business',
    name: '业务管理',
    frontPath: '/business',
    frontIcon: 'Goods',
    type: 0,
    status: 1,
    createAt: '2024-02-01 14:15:36',
    createBy: 'admin',
    updateAt: '2024-04-08 09:42:51',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'order',
    name: '订单管理',
    parentId: businessId,
    parentName: '业务管理',
    parentCode: 'business',
    frontPath: '/business/order',
    frontIcon: 'Document',
    type: 1,
    status: 1,
    createAt: '2024-02-05 10:45:22',
    createBy: 'admin',
    updateAt: '2024-04-05 15:30:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'product',
    name: '商品管理',
    parentId: businessId,
    parentName: '业务管理',
    parentCode: 'business',
    frontPath: '/business/product',
    frontIcon: 'Goods',
    type: 1,
    status: 1,
    createAt: '2024-02-10 11:22:08',
    createBy: 'admin',
    updateAt: '2024-04-03 16:25:16',
    updateBy: 'admin',
  },
  {
    id: reportId,
    code: 'report',
    name: '报表中心',
    frontPath: '/report',
    frontIcon: 'DataLine',
    type: 0,
    status: 0,
    createAt: '2024-03-01 16:30:57',
    createBy: 'admin',
    updateAt: '2024-04-02 11:58:33',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    code: 'sales-report',
    name: '销售报表',
    parentId: reportId,
    parentName: '报表中心',
    parentCode: 'report',
    frontPath: '/report/sales',
    frontIcon: 'TrendCharts',
    type: 1,
    status: 0,
    createAt: '2024-03-05 08:55:43',
    createBy: 'admin',
    updateAt: '2024-04-01 13:42:51',
    updateBy: 'admin',
  },
]

export default [
  // 分页查询菜单列表
  {
    method: 'get',
    url: '/system/menus',
    handler: ({ params }: { params: MenuQueryReq }): PageVo<MenuResp> => {
      let filtered = [...mockMenus]

      // 按 ID 精确搜索
      if (params.id) {
        filtered = filtered.filter(m => m.id.includes(params.id!))
      }

      // 按名称模糊搜索
      if (params.name) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(params.name!.toLowerCase()))
      }

      // 按编码模糊搜索
      if (params.code) {
        filtered = filtered.filter(m => m.code.toLowerCase().includes(params.code!.toLowerCase()))
      }

      // 按类型筛选
      if (params.type !== undefined) {
        filtered = filtered.filter(m => m.type === params.type)
      }

      // 按状态筛选
      if (params.status !== undefined) {
        filtered = filtered.filter(m => m.status === params.status)
      }

      // 按父级筛选
      if (params.parentId !== undefined) {
        filtered = filtered.filter(m => m.parentId === params.parentId)
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
        pageSize,
      }
    },
  },

  // 获取菜单详情
  {
    method: 'get',
    url: '/system/menus/:id',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): MenuDetailResp | undefined => {
      const menu = mockMenus.find(m => m.id === pathParams.id)
      if (menu) {
        const detail: MenuDetailResp = {
          ...menu,
          description: '菜单描述信息，用于说明该菜单的功能和用途',
          frontComponent: menu.type === 1 ? `${menu.code}/index` : undefined,
        }
        return detail
      }
      return undefined
    },
  },

  // 创建菜单
  {
    method: 'post',
    url: '/system/menus',
    handler: ({ data }: { data: any }): string => {
      const newMenu: MenuResp = {
        id: generateId(),
        code: data.code,
        name: data.name,
        parentId: data.parentId,
        description: data.description,
        frontPath: data.frontPath,
        frontComponent: data.frontComponent,
        frontIcon: data.frontIcon,
        type: data.type,
        permission: data.permission,
        sort: data.sort || 99,
        status: data.status,
        createAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        createBy: 'admin',
        updateAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateBy: 'admin',
      }
      mockMenus.unshift(newMenu)
      return newMenu.id
    },
  },

  // 更新菜单
  {
    method: 'put',
    url: '/system/menus/:id',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: any }): string => {
      const index = mockMenus.findIndex(m => m.id === pathParams.id)
      if (index !== -1) {
        mockMenus[index] = {
          ...mockMenus[index],
          ...data,
          updateAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updateBy: 'admin',
        }
        return mockMenus[index].id
      }
      throw new Error('菜单不存在')
    },
  },

  // 修改菜单状态
  {
    method: 'post',
    url: '/system/menus/:id/status',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: { status: number } }): void => {
      const menu = mockMenus.find(m => m.id === pathParams.id)
      if (menu) {
        menu.status = data.status
        menu.updateAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
        menu.updateBy = 'admin'
      }
    },
  },

  // 删除菜单
  {
    method: 'delete',
    url: '/system/menus/:id',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void => {
      const index = mockMenus.findIndex(m => m.id === pathParams.id)
      if (index !== -1) {
        mockMenus.splice(index, 1)
      }
    },
  },

  // 批量删除菜单
  {
    method: 'delete',
    url: '/system/menus',
    handler: ({ data }: { data: { ids: string[] } }): void => {
      for (const id of data.ids) {
        const index = mockMenus.findIndex(m => m.id === id)
        if (index !== -1) {
          mockMenus.splice(index, 1)
        }
      }
    },
  },
]
