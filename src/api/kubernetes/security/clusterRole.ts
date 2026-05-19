/**
 * ClusterRole 资源 API
 * @module api/kubernetes/clusterRole
 */
import type { PageResp } from '@/types/common'
import type { ClusterRoleResp, ClusterRoleQueryReq, ClusterRoleReq, ClusterRoleLabelsReq, ClusterRoleAnnotationsReq, ClusterRoleRulesReq } from '@/types/kubernetes/security/clusterRole'
import { request } from '@/utils'

/**
 * 获取 ClusterRole 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页后的 ClusterRole 列表
 */
export function getClusterRolePage(clusterId: string, params: Partial<ClusterRoleQueryReq>): Promise<PageResp<ClusterRoleResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/clusterroles`, { params })
}

/**
 * 获取 ClusterRole 详情
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @returns ClusterRole 详情
 */
export function getClusterRoleDetail(clusterId: string, name: string): Promise<ClusterRoleResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/clusterroles/${name}`)
}

/**
 * 创建 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ClusterRole ID
 */
export function createClusterRole(clusterId: string, data: Partial<ClusterRoleReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterroles`, { data })
}

/**
 * 更新 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ClusterRole ID
 */
export function updateClusterRole(clusterId: string, data: Partial<ClusterRoleReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterroles/${data.name}`, { data })
}

/**
 * 更新 ClusterRole 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleLabels(clusterId: string, name: string, data: Partial<ClusterRoleLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/labels`, { data })
}

/**
 * 更新 ClusterRole 注解
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleAnnotations(clusterId: string, name: string, data: Partial<ClusterRoleAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/annotations`, { data })
}

/**
 * 更新 ClusterRole 规则
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 规则更新参数
 */
export function updateClusterRoleRules(clusterId: string, name: string, data: Partial<ClusterRoleRulesReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/rules`, { data })
}

/**
 * 删除 ClusterRole
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 */
export function deleteClusterRole(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterroles/${name}`)
}

/**
 * 批量删除 ClusterRole
 * @param clusterId - 集群 ID
 * @param names - 待删除的 ClusterRole 名称列表
 */
export function deleteClusterRoles(clusterId: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterroles`, { data: names })
}
