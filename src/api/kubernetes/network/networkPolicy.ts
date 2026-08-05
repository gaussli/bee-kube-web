/**
 * NetworkPolicy 资源 API
 * @module api/kubernetes/networkPolicy
 */
import type { PageVo } from '@/types/common'
import type {
  NetworkPolicyResp,
  NetworkPolicyQueryReq,
  NetworkPolicyReq,
  NetworkPolicyLabelsReq,
  NetworkPolicyAnnotationsReq,
} from '@/types/kubernetes/network/networkPolicy'

import { request } from '@/utils'

/**
 * 获取 NetworkPolicy 分页列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 NetworkPolicy 列表
 */
export function getNetworkPolicyPage(
  clusterUid: string,
  namespaceName: string,
  params: Partial<NetworkPolicyQueryReq>,
): Promise<PageVo<NetworkPolicyResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies`, { params })
}

/**
 * 获取 NetworkPolicy 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @returns NetworkPolicy 详情
 */
export function getNetworkPolicyDetail(
  clusterUid: string,
  namespaceName: string,
  name: string,
): Promise<NetworkPolicyResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies/${name}`)
}

/**
 * 创建 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 NetworkPolicy ID
 */
export function createNetworkPolicy(clusterUid: string, data: Partial<NetworkPolicyReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/networkpolicies`, { data })
}

/**
 * 更新 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 NetworkPolicy ID
 */
export function updateNetworkPolicy(clusterUid: string, data: Partial<NetworkPolicyReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/networkpolicies/${data.name}`, {
    data,
  })
}

/**
 * 更新 NetworkPolicy 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 标签更新参数
 */
export function manageNetworkPolicyLabels(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<NetworkPolicyLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies/${name}/labels`, {
    data,
  })
}

/**
 * 更新 NetworkPolicy 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 注解更新参数
 */
export function manageNetworkPolicyAnnotations(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<NetworkPolicyAnnotationsReq>,
): Promise<void> {
  return request.put(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies/${name}/annotations`,
    { data },
  )
}

/**
 * 删除 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 */
export function deleteNetworkPolicy(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies/${name}`)
}

/**
 * 批量删除 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 NetworkPolicy 名称列表
 */
export function deleteNetworkPolicys(clusterUid: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/networkpolicies`, {
    data: names,
  })
}
