import type {
  PageVo,
  PermissionChangeStatusReq,
  PermissionCreateReq,
  PermissionDetailResp,
  PermissionQueryReq,
  PermissionResp,
  PermissionUpdateReq,
} from '@/types/index'

import { request } from '@/utils'

// 分页查询权限列表
/**
 *
 * @param data
 */
export function getPermissionPage(data: PermissionQueryReq) {
  return request.get<PageVo<PermissionResp>>('/system/permissions', data)
}

// 获取权限详情
/**
 *
 * @param id
 */
export function getPermissionDetail(id: string) {
  return request.get<PermissionDetailResp>(`/system/permissions/${id}`)
}

// 创建权限
/**
 *
 * @param data
 */
export function createPermission(data: PermissionCreateReq) {
  return request.post<string>('/system/permissions', data)
}

// 更新权限
/**
 *
 * @param id
 * @param data
 */
export function updatePermission(id: string, data: PermissionUpdateReq) {
  return request.put<string>(`/system/permissions/${id}`, data)
}

// 修改权限状态
/**
 *
 * @param id
 * @param data
 */
export function changePermissionStatus(id: string, data: PermissionChangeStatusReq) {
  return request.post<void>(`/system/permissions/${id}/status`, data)
}

// 删除权限
/**
 *
 * @param id
 */
export function removePermission(id: string) {
  return request.delete<void>(`/system/permissions/${id}`)
}

// 批量删除权限
/**
 *
 * @param ids
 */
export function batchRemovePermissions(ids: string[]) {
  return request.delete('/system/permissions', { data: { ids } })
}
