/**
 * @fileOverview ClusterRole 资源相关 API
 * @module api/kubernetes/clusterRole
 */
import type { PageResp } from '@/types/common'
import type { ClusterRoleResp, ClusterRoleQueryReq, ClusterRoleReq, ClusterRoleLabelsReq, ClusterRoleAnnotationsReq, ClusterRoleRulesReq } from '@/types/kubernetes/clusterRole'
import request from '@/utils/request'

/**
 * 获取 ClusterRole 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns ClusterRole 分页列表
 */
export function getClusterRolePage(clusterId: string, params: ClusterRoleQueryReq) {
  return request.get<PageResp<ClusterRoleResp>>(`/kubernetes/clusters/${clusterId}/clusterroles`, {
    params
  })
}

/**
 * 获取 ClusterRole 详情
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @returns ClusterRole 详情
 */
export function getClusterRoleDetail(clusterId: string, name: string) {
  return request.get<ClusterRoleResp>(`/kubernetes/clusters/${clusterId}/clusterroles/${name}`)
}

/**
 * 创建 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ClusterRole ID
 */
export function createClusterRole(clusterId: string, data: ClusterRoleReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/clusterroles`, data)
}

/**
 * 更新 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ClusterRole ID
 */
export function updateClusterRole(clusterId: string, data: ClusterRoleReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/clusterroles/${data.name}`, data)
}

/**
 * 更新 ClusterRole 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleLabels(clusterId: string, name: string, data: ClusterRoleLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/labels`, data)
}

/**
 * 更新 ClusterRole 注解
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleAnnotations(clusterId: string, name: string, data: ClusterRoleAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/annotations`, data)
}

/**
 * 更新 ClusterRole 规则
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param data - 规则更新参数
 */
export function updateClusterRoleRules(clusterId: string, name: string, data: ClusterRoleRulesReq) {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterroles/${name}/rules`, data)
}

/**
 * 删除 ClusterRole
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 */
export function deleteClusterRole(clusterId: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterroles/${name}`)
}

/**
 * 批量删除 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 待删除的 ClusterRole 名称列表
 */
export function deleteClusterRoles(clusterId: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterroles`, {
    data
  })
}
