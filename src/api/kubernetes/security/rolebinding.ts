/**
 * RoleBinding 资源 API
 * @module api/kubernetes/roleBinding
 */
import type { PageVo } from '@/types/common'
import type {
  RoleBindingResp,
  RoleBindingQueryReq,
  RoleBindingReq,
  RoleBindingLabelsReq,
  RoleBindingAnnotationsReq,
  RoleBindingSubjectsReq,
} from '@/types/kubernetes/security/roleBinding'

import { request } from '@/utils'

/**
 * 获取 RoleBinding 分页列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 RoleBinding 列表
 */
export function getRoleBindingPage(
  clusterUid: string,
  namespaceName: string,
  params: Partial<RoleBindingQueryReq>,
): Promise<PageVo<RoleBindingResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings`, { params })
}

/**
 * 获取 RoleBinding 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @returns RoleBinding 详情
 */
export function getRoleBindingDetail(
  clusterUid: string,
  namespaceName: string,
  name: string,
): Promise<RoleBindingResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings/${name}`)
}

/**
 * 创建 RoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 RoleBinding ID
 */
export function createRoleBinding(clusterUid: string, data: Partial<RoleBindingReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/rolebindings`, { data })
}

/**
 * 更新 RoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 RoleBinding ID
 */
export function updateRoleBinding(clusterUid: string, data: Partial<RoleBindingReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/rolebindings/${data.name}`, {
    data,
  })
}

/**
 * 更新 RoleBinding 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageRoleBindingLabels(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleBindingLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings/${name}/labels`, {
    data,
  })
}

/**
 * 更新 RoleBinding 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageRoleBindingAnnotations(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleBindingAnnotationsReq>,
): Promise<void> {
  return request.put(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings/${name}/annotations`,
    {
      data,
    },
  )
}

/**
 * 更新 RoleBinding 主体
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 主体更新参数
 */
export function manageRoleBindingSubjects(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleBindingSubjectsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings/${name}/subjects`, {
    data,
  })
}

/**
 * 删除 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 */
export function deleteRoleBinding(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings/${name}`)
}

/**
 * 批量删除 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 RoleBinding 名称列表
 */
export function deleteRoleBindings(clusterUid: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/rolebindings`, { data: names })
}
