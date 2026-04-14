// 权限相关类型

import type { BaseEntity, PageReq } from './common'

// 菜单类型
export type MenuType = {
  0: '目录'
  1: '菜单'
  2: '按钮'
}

// 菜单状态
export type MenuStatus = {
  0: '已禁用'
  1: '已启用'
}

// 菜单查询请求参数
export interface MenuQueryReq extends PageReq {
  id?: string
  code?: string
  name?: string
  parentId?: string
  type?: MenuType
  status?: MenuStatus
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
  type: MenuType
  permission?: string
  sort?: number
  status: MenuStatus
}

// 菜单更新请求参数
export interface MenuUpdateReq {
  name?: string
  description?: string
  frontPath?: string
  frontComponent?: string
  frontIcon?: string
  type?: MenuType
  permission?: string
  sort?: number
  status?: MenuStatus
}

// 菜单修改状态请求参数
export interface MenuChangeStatusReq {
  status: MenuStatus
}

// 菜单列表响应
export interface MenuResp extends BaseEntity {
  code: string
  name: string
  parentId?: string
  description?: string
  type: MenuType
  status: MenuStatus
}

// 菜单详情响应
export interface MenuDetailResp extends BaseEntity {
  code: string
  name: string
  parentId?: string
  description?: string
  frontPath?: string
  frontComponent?: string
  frontIcon?: string
  type: MenuType
  permission?: string
  sort?: number
  status: MenuStatus
}
