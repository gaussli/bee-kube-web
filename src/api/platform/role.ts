import type { MenuQueryReq, MenuResp, PageVo, RoleChangeStatusReq, RoleCreateReq, RoleDetailResp, RoleQueryReq, RoleResp, RoleUpdateReq, UserQueryReq, UserResp } from '@/types'
import { request } from '@/utils'

// 分页查询角色列表
export function getRolePage(data: RoleQueryReq) {
  return request.get<PageVo<RoleResp>>('/system/roles', data)
}

// 获取角色详情
export function getRoleDetail(id: string) {
  return request.get<RoleDetailResp>(`/system/roles/${id}`)
}

// 创建角色
export function createRole(data: RoleCreateReq) {
  return request.post<string>('/system/roles', data)
}

// 更新角色
export function updateRole(id: string, data: RoleUpdateReq) {
  return request.put<string>(`/system/roles/${id}`, data)
}

// 修改角色状态
export function changeRoleStatus(id: string, data: RoleChangeStatusReq) {
  return request.post<void>(`/system/roles/${id}/status`, data)
}

// 删除角色
export function removeRole(id: string) {
  return request.delete<void>(`/system/roles/${id}`)
}

// 批量删除角色
export function batchRemoveRoles(ids: string[]) {
  return request.delete('/system/roles', { ids })
}

// 获取角色关联的菜单列表
export function getRoleMenus(id: string, data: MenuQueryReq) {
  return request.get<MenuResp[]>(`/system/roles/${id}/menus`, data)
}

// 绑定角色关联的菜单
export function bindRoleMenus(id: string, menuIds: string[]) {
  return request.post<void>(`/system/roles/${id}/menus`, { menuIds })
}

// 解绑角色关联的菜单
export function unbindRoleMenus(id: string, menuIds: string[]) {
  return request.delete<void>(`/system/roles/${id}/menus`, { menuIds })
}

// 分页查询角色关联的用户列表
export function getRoleUsers(id: string, data: UserQueryReq) {
  return request.get<PageVo<UserResp>>(`/system/roles/${id}/users`, data)
}

// 绑定角色关联的用户
export function bindRoleUsers(id: string, userIds: string[]) {
  return request.post<void>(`/system/roles/${id}/users`, { userIds })
}

// 解绑角色关联的用户
export function unbindRoleUsers(id: string, userIds: string[]) {
  return request.delete<void>(`/system/roles/${id}/users`, { userIds })
}
