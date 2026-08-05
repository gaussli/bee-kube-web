/**
 * ClusterRole 资源 API
 * @module api/kubernetes/clusterRole
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterRoleResp,
  ClusterRoleQueryReq,
  ClusterRoleReq,
  ClusterRoleLabelsReq,
  ClusterRoleAnnotationsReq,
  ClusterRoleRulesReq,
} from '@/types/kubernetes/security/clusterRole'

import { request } from '@/utils'

/**
 * 获取 ClusterRole 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 ClusterRole 列表
 */
export function getClusterRolePage(
  clusterUid: string,
  params: Partial<ClusterRoleQueryReq>,
): Promise<PageVo<ClusterRoleResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/clusterroles`, { params })
}

/**
 * 获取 ClusterRole 详情
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @returns ClusterRole 详情
 */
export function getClusterRoleDetail(clusterUid: string, name: string): Promise<ClusterRoleResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}`)
}

/**
 * 创建 ClusterRole
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 ClusterRole ID
 */
export function createClusterRole(clusterUid: string, data: Partial<ClusterRoleReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterroles`, { data })
}

/**
 * 更新 ClusterRole
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 ClusterRole ID
 */
export function updateClusterRole(clusterUid: string, data: Partial<ClusterRoleReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterroles/${data.name}`, { data })
}

/**
 * 更新 ClusterRole 标签
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleLabels(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/labels`, { data })
}

/**
 * 更新 ClusterRole 注解
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/annotations`, { data })
}

/**
 * 更新 ClusterRole 规则
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param data - 规则更新参数
 */
export function updateClusterRoleRules(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleRulesReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/rules`, { data })
}

/**
 * 删除 ClusterRole
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 */
export function deleteClusterRole(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}`)
}

/**
 * 批量删除 ClusterRole
 * @param clusterUid - 集群 UID
 * @param names - 待删除的 ClusterRole 名称列表
 */
export function deleteClusterRoles(clusterUid: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterroles`, { data: names })
}
