// 用户相关类型
import type { BaseEntity, PageReq } from './common'

// 用户状态枚举
export const UserStatus = {
  Disabled: 0,
  Enabled: 1
} as const
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

// 用户性别枚举
export const UserGender = {
  Female: 0,
  Male: 1
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]

// 用户查询请求参数
export interface UserQueryReq extends PageReq {
  id?: string
  username?: string
  nickname?: string
  status?: UserStatus
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
  gender?: UserGender
  birthday?: string
  avatarId?: string
  description?: string
  status: UserStatus
}

// 用户更新请求参数
export interface UserUpdateReq {
  nickname?: string
  email?: string
  mobile?: string
  realname?: string
  idCard?: string
  gender?: UserGender
  birthday?: string
  avatarId?: string
  description?: string
  status?: UserStatus
}

// 用户修改状态请求参数
export interface UserChangeStatusReq {
  status: UserStatus
}

// 用户列表响应
export interface UserResp extends BaseEntity {
  username: string
  nickname: string
  gender?: UserGender
  status: UserStatus
}

// 用户详情响应
export interface UserDetailResp extends BaseEntity {
  username: string
  nickname: string
  email?: string
  mobile?: string
  realname?: string
  idCard?: string
  gender?: UserGender
  birthday?: string
  avatarId?: string
  description?: string
  status: UserStatus
}
