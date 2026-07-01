/**
 * ClusterRoleBinding 资源 API
 * @module api/kubernetes/clusterRoleBinding
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterRoleBindingResp,
  ClusterRoleBindingQueryReq,
  ClusterRoleBindingReq,
  ClusterRoleBindingLabelsReq,
  ClusterRoleBindingAnnotationsReq,
  ClusterRoleBindingSubjectsReq
} from '@/types/kubernetes/security/clusterRoleBinding'
import { request } from '@/utils'

/**
 * 获取 ClusterRoleBinding 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页后的 ClusterRoleBinding 列表
 */
export function getClusterRoleBindingPage(clusterId: string, params: Partial<ClusterRoleBindingQueryReq>): Promise<PageVo<ClusterRoleBindingResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, { params })
}

/**
 * 获取 ClusterRoleBinding 详情
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情
 */
export function getClusterRoleBindingDetail(clusterId: string, name: string): Promise<ClusterRoleBindingResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}`)
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ClusterRoleBinding ID
 */
export function createClusterRoleBinding(clusterId: string, data: Partial<ClusterRoleBindingReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, { data })
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ClusterRoleBinding ID
 */
export function updateClusterRoleBinding(clusterId: string, data: Partial<ClusterRoleBindingReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${data.name}`, { data })
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleBindingLabels(clusterId: string, name: string, data: Partial<ClusterRoleBindingLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/labels`, { data })
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleBindingAnnotations(clusterId: string, name: string, data: Partial<ClusterRoleBindingAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/annotations`, { data })
}

/**
 * 更新 ClusterRoleBinding 主体
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 主体更新参数
 */
export function manageClusterRoleBindingSubjects(clusterId: string, name: string, data: Partial<ClusterRoleBindingSubjectsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/subjects`, { data })
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 */
export function deleteClusterRoleBinding(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}`)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param names - 待删除的 ClusterRoleBinding 名称列表
 */
export function deleteClusterRoleBindings(clusterId: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, { data: names })
}
