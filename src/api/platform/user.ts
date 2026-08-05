import type {
  PageVo,
  RoleQueryReq,
  RoleResp,
  UserChangeStatusReq,
  UserDetailResp,
  UserQueryReq,
  UserResp,
} from '@/types'

import { request } from '@/utils'

// 分页查询用户列表
/**
 *
 * @param data
 */
export function getUserPage(data: UserQueryReq) {
  return request.get<PageVo<UserResp>>('/system/users', data)
}

// 获取用户详情
/**
 *
 * @param id
 */
export function getUserDetail(id: string) {
  return request.get<UserDetailResp>(`/system/users/${id}`)
}

// 创建用户
/**
 *
 * @param data
 */
export function createUser(data: Omit<UserDetailResp, 'id'>) {
  return request.post<string>('/system/users', data)
}

// 更新用户
/**
 *
 * @param id
 * @param data
 */
export function updateUser(id: string, data: Omit<UserDetailResp, 'id'>) {
  return request.post<string>(`/system/users/${id}`, data)
}

// 修改用户状态
/**
 *
 * @param id
 * @param data
 */
export function changeUserStatus(id: string, data: UserChangeStatusReq) {
  return request.post<void>(`/system/users/${id}/status`, data)
}

// 删除用户
/**
 *
 * @param id
 */
export function remove(id: string) {
  return request.delete<void>(`/system/users/${id}`)
}

// 批量删除用户
/**
 *
 * @param ids
 */
export function batchRemove(ids: string[]) {
  return request.delete('/system/users', { data: { ids } })
}

// 分页查询用户关联的角色列表
/**
 *
 * @param id
 * @param data
 */
export function getUserRoles(id: string, data: RoleQueryReq) {
  return request.get<PageVo<RoleResp>>(`/system/users/${id}/roles`, data)
}

// 批量绑定用户关联的角色
/**
 *
 * @param id
 * @param roleIds
 */
export function bindUserRoles(id: string, roleIds: string[]) {
  return request.post<void>(`/system/users/${id}/roles`, { data: { roleIds } })
}

// 批量解绑用户关联的角色
/**
 *
 * @param id
 * @param roleIds
 */
export function unbindUserRoles(id: string, roleIds: string[]) {
  return request.delete<void>(`/system/users/${id}/roles`, { data: { roleIds } })
}
