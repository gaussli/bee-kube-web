/**
 * @fileOverview NetworkPolicy 资源相关 API
 * @module api/kubernetes/networkPolicy
 */
import request from '@/utils/request'
import type { PageResp } from '@/types/common'
import type {
  NetworkPolicyResp,
  NetworkPolicyQueryReq,
  NetworkPolicyReq,
  NetworkPolicyLabelsReq,
  NetworkPolicyAnnotationsReq
} from '@/types/kubernetes/networkPolicy'

/**
 * 获取 NetworkPolicy 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns NetworkPolicy 分页列表
 */
export function getNetworkPolicyPage(clusterId: string, params: NetworkPolicyQueryReq) {
  return request.get<PageResp<NetworkPolicyResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${params.id}/networkpolicies`, {
    params
  })
}

/**
 * 获取 NetworkPolicy 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @returns NetworkPolicy 详情
 */
export function getNetworkPolicyDetail(clusterId: string, namespaceName: string, name: string) {
  return request.get<NetworkPolicyResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/networkpolicies/${name}`)
}

/**
 * 创建 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 NetworkPolicy ID
 */
export function createNetworkPolicy(clusterId: string, data: NetworkPolicyReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/networkpolicies`, data)
}

/**
 * 更新 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 NetworkPolicy ID
 */
export function updateNetworkPolicy(clusterId: string, data: NetworkPolicyReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/networkpolicies/${data.name}`, data)
}

/**
 * 更新 NetworkPolicy 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 标签更新参数
 */
export function manageNetworkPolicyLabels(clusterId: string, namespaceName: string, name: string, data: NetworkPolicyLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/networkpolicies/${name}/labels`, data)
}

/**
 * 更新 NetworkPolicy 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 注解更新参数
 */
export function manageNetworkPolicyAnnotations(clusterId: string, namespaceName: string, name: string, data: NetworkPolicyAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/networkpolicies/${name}/annotations`, data)
}

/**
 * 删除 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 */
export function deleteNetworkPolicy(clusterId: string, namespaceName: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/networkpolicies/${name}`)
}

/**
 * 批量删除 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param data - 待删除的 NetworkPolicy 名称列表
 */
export function deleteNetworkPolicys(clusterId: string, namespaceName: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/networkpolicies`, {
    data
  })
}
