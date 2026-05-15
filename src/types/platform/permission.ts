// 权限相关类型

// 权限查询参数
export interface PermissionQueryReq {
  id?: string
  name?: string
  code?: string
  status?: number
  page?: number
  pageSize?: number
}

// 权限响应
export interface PermissionResp {
  id: string
  code: string
  name: string
  description?: string
  status: number
  sort?: number
  createBy?: string
  createAt?: string
  updateBy?: string
  updateAt?: string
}

// 权限详情响应
export interface PermissionDetailResp extends PermissionResp {}

// 创建权限请求
export interface PermissionCreateReq {
  code: string
  name: string
  description?: string
  status?: number
  sort?: number
}

// 更新权限请求
export interface PermissionUpdateReq {
  code?: string
  name?: string
  description?: string
  status?: number
  sort?: number
}

// 修改权限状态请求
export interface PermissionChangeStatusReq {
  status: number
}
