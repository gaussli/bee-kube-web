/**
 * @fileOverview Role 资源相关 API
 * @module api/kubernetes/role
 */
import type { PageResp } from '@/types/common'
import type { RoleResp, RoleQueryReq, RoleReq, RoleLabelsReq, RoleAnnotationsReq, RoleRulesReq } from '@/types/kubernetes/role'
import request from '@/utils/request'

/**
 * 获取 Role 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns Role 分页列表
 */
export function getRolePage(clusterId: string, params: RoleQueryReq) {
  return request.get<PageResp<RoleResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${params.id}/roles`, {
    params
  })
}

/**
 * 获取 Role 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @returns Role 详情
 */
export function getRoleDetail(clusterId: string, namespaceName: string, name: string) {
  return request.get<RoleResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles/${name}`)
}

/**
 * 创建 Role
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 Role ID
 */
export function createRole(clusterId: string, data: RoleReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/roles`, data)
}

/**
 * 更新 Role
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 Role ID
 */
export function updateRole(clusterId: string, data: RoleReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/roles/${data.name}`, data)
}

/**
 * 更新 Role 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 标签更新参数
 */
export function manageRoleLabels(clusterId: string, namespaceName: string, name: string, data: RoleLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles/${name}/labels`, data)
}

/**
 * 更新 Role 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 注解更新参数
 */
export function manageRoleAnnotations(clusterId: string, namespaceName: string, name: string, data: RoleAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles/${name}/annotations`, data)
}

/**
 * 更新 Role 规则
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 规则更新参数
 */
export function updateRoleRules(clusterId: string, namespaceName: string, name: string, data: RoleRulesReq) {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles/${name}/rules`, data)
}

/**
 * 删除 Role
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 */
export function deleteRole(clusterId: string, namespaceName: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles/${name}`)
}

/**
 * 批量删除 Role
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param data - 待删除的 Role 名称列表
 */
export function deleteRoles(clusterId: string, namespaceName: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/roles`, {
    data
  })
}
