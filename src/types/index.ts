// 用户相关类型
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles?: string[]
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  requestId: string
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PageResult<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
