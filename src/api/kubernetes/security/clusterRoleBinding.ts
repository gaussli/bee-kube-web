/**
 * @fileOverview ClusterRoleBinding 资源相关 API
 * @module api/kubernetes/clusterRoleBinding
 */
import type { PageResp } from '@/types/common'
import type {
  ClusterRoleBindingResp,
  ClusterRoleBindingQueryReq,
  ClusterRoleBindingReq,
  ClusterRoleBindingLabelsReq,
  ClusterRoleBindingAnnotationsReq,
  ClusterRoleBindingSubjectsReq
} from '@/types/kubernetes/clusterRoleBinding'
import request from '@/utils/request'

/**
 * 获取 ClusterRoleBinding 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns ClusterRoleBinding 分页列表
 */
export function getClusterRoleBindingPage(clusterId: string, params: ClusterRoleBindingQueryReq) {
  return request.get<PageResp<ClusterRoleBindingResp>>(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, {
    params
  })
}

/**
 * 获取 ClusterRoleBinding 详情
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情
 */
export function getClusterRoleBindingDetail(clusterId: string, name: string) {
  return request.get<ClusterRoleBindingResp>(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}`)
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ClusterRoleBinding ID
 */
export function createClusterRoleBinding(clusterId: string, data: ClusterRoleBindingReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, data)
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ClusterRoleBinding ID
 */
export function updateClusterRoleBinding(clusterId: string, data: ClusterRoleBindingReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${data.name}`, data)
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleBindingLabels(clusterId: string, name: string, data: ClusterRoleBindingLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/labels`, data)
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleBindingAnnotations(clusterId: string, name: string, data: ClusterRoleBindingAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/annotations`, data)
}

/**
 * 更新 ClusterRoleBinding 主体
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param data - 主体更新参数
 */
export function manageClusterRoleBindingSubjects(clusterId: string, name: string, data: ClusterRoleBindingSubjectsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}/subjects`, data)
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 */
export function deleteClusterRoleBinding(clusterId: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterrolebindings/${name}`)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 待删除的 ClusterRoleBinding 名称列表
 */
export function deleteClusterRoleBindings(clusterId: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/clusterrolebindings`, {
    data
  })
}
