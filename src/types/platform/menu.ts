// 权限相关类型

import type { AuditEntity, PageForm } from '@/types/common'

// 菜单查询请求参数
export interface MenuQueryReq extends PageForm {
  id?: string
  code?: string
  name?: string
  parentId?: string
  type?: number
  status?: number
}

// 菜单创建请求参数
export interface MenuCreateReq {
  code: string
  name: string
  parentId?: string
  description?: string
  frontPath?: string
  frontComponent?: string
  frontIcon?: string
  type: number
  permission?: string
  sort?: number
  status: number
}

// 菜单更新请求参数
export interface MenuUpdateReq {
  name?: string
  description?: string
  frontPath?: string
  frontComponent?: string
  frontIcon?: string
  type?: number
  permission?: string
  sort?: number
  status?: number
}

// 菜单修改状态请求参数
export interface MenuChangeStatusReq {
  status: number
}

// 菜单列表响应
export interface MenuResp extends AuditEntity {
  code: string
  name: string
  parentId?: string
  parentName?: string
  parentCode?: string
  description?: string
  type: number
  status: number
  permission?: string
}

// 菜单详情响应
export interface MenuDetailResp extends AuditEntity {
  code: string
  name: string
  parentId?: string
  parentName?: string
  parentCode?: string
  description?: string
  frontPath?: string
  frontComponent?: string
  frontIcon?: string
  type: number
  permission?: string
  sort?: number
  status: number
}
