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
  ClusterRoleBindingSubjectsReq,
} from '@/types/kubernetes/security/clusterRoleBinding'

import { request } from '@/utils'

/**
 * 获取 ClusterRoleBinding 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 ClusterRoleBinding 列表
 */
export function getClusterRoleBindingPage(
  clusterUid: string,
  params: Partial<ClusterRoleBindingQueryReq>,
): Promise<PageVo<ClusterRoleBindingResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, { params })
}

/**
 * 获取 ClusterRoleBinding 详情
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情
 */
export function getClusterRoleBindingDetail(clusterUid: string, name: string): Promise<ClusterRoleBindingResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}`)
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 ClusterRoleBinding ID
 */
export function createClusterRoleBinding(clusterUid: string, data: Partial<ClusterRoleBindingReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, { data })
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 ClusterRoleBinding ID
 */
export function updateClusterRoleBinding(clusterUid: string, data: Partial<ClusterRoleBindingReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${data.name}`, { data })
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleBindingLabels(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleBindingLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/labels`, { data })
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleBindingAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleBindingAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/annotations`, { data })
}

/**
 * 更新 ClusterRoleBinding 主体
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 主体更新参数
 */
export function manageClusterRoleBindingSubjects(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleBindingSubjectsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/subjects`, { data })
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 */
export function deleteClusterRoleBinding(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}`)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param names - 待删除的 ClusterRoleBinding 名称列表
 */
export function deleteClusterRoleBindings(clusterUid: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, { data: names })
}
