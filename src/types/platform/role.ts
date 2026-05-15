// 角色相关类型

import type { BaseEntity, PageReq } from './common'

// 角色查询请求参数
export interface RoleQueryReq extends PageReq {
  id?: string
  code?: string
  name?: string
  status?: number
}

// 角色创建请求参数
export interface RoleCreateReq {
  code: string
  name: string
  description?: string
  sort?: number
  status: number
}

// 角色更新请求参数
export interface RoleUpdateReq {
  name?: string
  description?: string
  sort?: number
  status?: number
}

// 角色修改状态请求参数
export interface RoleChangeStatusReq {
  status: number
}

// 角色列表响应
export interface RoleResp extends BaseEntity {
  code: string
  name: string
  description?: string
  sort?: number
  status: number
  isSystem?: boolean
}

// 角色详情响应
export interface RoleDetailResp extends BaseEntity {
  code: string
  name: string
  description?: string
  sort?: number
  status: number
  isSystem: boolean
}
