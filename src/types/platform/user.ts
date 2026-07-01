// 用户相关类型
import type { BaseEntity, PageForm } from '@/types/common'

// 用户查询请求参数
export interface UserQueryReq extends PageForm {
  id?: string
  username?: string
  nickname?: string
  status?: number
}

// 用户创建请求参数
export interface UserCreateReq {
  username: string
  nickname?: string
  password: string
  email?: string
  mobile?: string
  realname?: string
  idCard?: string
  gender?: number
  birthday?: string
  avatarId?: string
  description?: string
  status: number
}

// 用户更新请求参数
export interface UserUpdateReq {
  nickname?: string
  email?: string
  mobile?: string
  realname?: string
  idCard?: string
  gender?: number
  birthday?: string
  avatarId?: string
  description?: string
  status?: number
}

// 用户修改状态请求参数
export interface UserChangeStatusReq {
  status: number
}

// 用户列表响应
export interface UserResp extends BaseEntity {
  username: string
  nickname: string
  gender?: number
  status: number
}

// 用户详情响应
export interface UserDetailResp extends BaseEntity {
  username: string
  nickname: string
  email?: string
  mobile?: string
  realname?: string
  idCard?: string
  gender?: number
  birthday?: string
  avatarId?: string
  description?: string
  status: number
}
