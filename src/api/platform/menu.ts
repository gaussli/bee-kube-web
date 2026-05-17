import type { MenuChangeStatusReq, MenuCreateReq, MenuDetailResp, MenuQueryReq, MenuResp, MenuUpdateReq, PageResp, RoleQueryReq, RoleResp } from '@/types'
import { request } from '@/utils'

// 分页查询菜单列表
export function getMenuPage(data: MenuQueryReq) {
  return request.get<PageResp<MenuResp>>('/system/menus', data)
}

// 获取菜单详情
export function getMenuDetail(id: string) {
  return request.get<MenuDetailResp>(`/system/menus/${id}`)
}

// 创建菜单
export function createMenu(data: MenuCreateReq) {
  return request.post<string>('/system/menus', data)
}

// 更新菜单
export function updateMenu(id: string, data: MenuUpdateReq) {
  return request.put<string>(`/system/menus/${id}`, data)
}

// 修改菜单状态
export function changeMenuStatus(id: string, data: MenuChangeStatusReq) {
  return request.post<void>(`/system/menus/${id}/status`, data)
}

// 删除菜单
export function removeMenu(id: string) {
  return request.delete<void>(`/system/menus/${id}`)
}

// 批量删除菜单
export function batchRemoveMenus(ids: string[]) {
  return request.delete('/system/menus', { ids })
}

// 获取菜单关联的角色
export function getMenuRoles(id: string, data: RoleQueryReq) {
  return request.get<PageResp<RoleResp>>(`/system/menus/${id}/roles`, data)
}

// 批量绑定菜单关联的角色
export function bindMenuRoles(id: string, roleIds: string[]) {
  return request.post<void>(`/system/menus/${id}/roles`, { roleIds })
}

// 批量解绑菜单关联的角色
export function unbindMenuRoles(id: string, roleIds: string[]) {
  return request.delete<void>(`/system/menus/${id}/roles`, { roleIds })
}
