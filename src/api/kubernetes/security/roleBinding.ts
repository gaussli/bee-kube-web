/**
 * RoleBinding 资源 API
 * @module api/kubernetes/roleBinding
 */
import type { PageResp } from '@/types/common'
import type { RoleBindingResp, RoleBindingQueryReq, RoleBindingReq, RoleBindingLabelsReq, RoleBindingAnnotationsReq, RoleBindingSubjectsReq } from '@/types/kubernetes/security/roleBinding'
import { request } from '@/utils'

/**
 * 获取 RoleBinding 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 RoleBinding 列表
 */
export function getRoleBindingPage(clusterId: string, namespaceName: string, params: Partial<RoleBindingQueryReq>): Promise<PageResp<RoleBindingResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings`, { params })
}

/**
 * 获取 RoleBinding 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @returns RoleBinding 详情
 */
export function getRoleBindingDetail(clusterId: string, namespaceName: string, name: string): Promise<RoleBindingResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings/${name}`)
}

/**
 * 创建 RoleBinding
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 RoleBinding ID
 */
export function createRoleBinding(clusterId: string, data: Partial<RoleBindingReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/rolebindings`, { data })
}

/**
 * 更新 RoleBinding
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 RoleBinding ID
 */
export function updateRoleBinding(clusterId: string, data: Partial<RoleBindingReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/rolebindings/${data.name}`, { data })
}

/**
 * 更新 RoleBinding 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageRoleBindingLabels(clusterId: string, namespaceName: string, name: string, data: Partial<RoleBindingLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings/${name}/labels`, { data })
}

/**
 * 更新 RoleBinding 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageRoleBindingAnnotations(clusterId: string, namespaceName: string, name: string, data: Partial<RoleBindingAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings/${name}/annotations`, { data })
}

/**
 * 更新 RoleBinding 主体
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 主体更新参数
 */
export function manageRoleBindingSubjects(clusterId: string, namespaceName: string, name: string, data: Partial<RoleBindingSubjectsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings/${name}/subjects`, { data })
}

/**
 * 删除 RoleBinding
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 */
export function deleteRoleBinding(clusterId: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings/${name}`)
}

/**
 * 批量删除 RoleBinding
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 RoleBinding 名称列表
 */
export function deleteRoleBindings(clusterId: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/rolebindings`, { data: names })
}
