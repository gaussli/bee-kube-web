/**
 * Role 资源 API
 * @module api/kubernetes/role
 */
import type { PageVo } from '@/types/common'
import type {
  RoleResp,
  RoleQueryReq,
  RoleReq,
  RoleLabelsReq,
  RoleAnnotationsReq,
  RoleRulesReq,
} from '@/types/kubernetes/security/role'

import { request } from '@/utils'

/**
 * 获取 Role 分页列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Role 列表
 */
export function getRolePage(
  clusterUid: string,
  namespaceName: string,
  params: Partial<RoleQueryReq>,
): Promise<PageVo<RoleResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles`, { params })
}

/**
 * 获取 Role 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @returns Role 详情
 */
export function getRoleDetail(clusterUid: string, namespaceName: string, name: string): Promise<RoleResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles/${name}`)
}

/**
 * 创建 Role
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 Role ID
 */
export function createRole(clusterUid: string, data: Partial<RoleReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/roles`, { data })
}

/**
 * 更新 Role
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 Role ID
 */
export function updateRole(clusterUid: string, data: Partial<RoleReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/roles/${data.name}`, { data })
}

/**
 * 更新 Role 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 标签更新参数
 */
export function manageRoleLabels(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles/${name}/labels`, { data })
}

/**
 * 更新 Role 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 注解更新参数
 */
export function manageRoleAnnotations(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles/${name}/annotations`, {
    data,
  })
}

/**
 * 更新 Role 规则
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param data - 规则更新参数
 */
export function updateRoleRules(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleRulesReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles/${name}/rules`, { data })
}

/**
 * 删除 Role
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 */
export function deleteRole(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles/${name}`)
}

/**
 * 批量删除 Role
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Role 名称列表
 */
export function deleteRoles(clusterUid: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/roles`, { data: names })
}
