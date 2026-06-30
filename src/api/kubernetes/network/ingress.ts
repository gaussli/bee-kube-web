/**
 * Ingress 资源 API
 * @module api/kubernetes/ingress
 */
import type { PageResp } from '@/types/common'
import type { IngressListVo, IngressQueryReq, IngressReq, IngressLabelsReq, IngressAnnotationsReq } from '@/types/kubernetes/network/ingress'
import { request } from '@/utils'

/**
 * 获取 Ingress 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Ingress 列表
 */
export function getIngressPage(clusterId: string, namespaceName: string, params: Partial<IngressQueryReq>): Promise<PageResp<IngressListVo>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses`, { params })
}

/**
 * 获取 Ingress 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @returns Ingress 详情
 */
export function getIngressDetail(clusterId: string, namespaceName: string, name: string): Promise<IngressListVo> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 创建 Ingress
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 Ingress ID
 */
export function createIngress(clusterId: string, data: Partial<IngressReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/ingresses`, { data })
}

/**
 * 更新 Ingress
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 Ingress ID
 */
export function updateIngress(clusterId: string, data: Partial<IngressReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/ingresses/${data.name}`, { data })
}

/**
 * 更新 Ingress 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 标签更新参数
 */
export function manageIngressLabels(clusterId: string, namespaceName: string, name: string, data: Partial<IngressLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}/labels`, { data })
}

/**
 * 更新 Ingress 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 注解更新参数
 */
export function manageIngressAnnotations(clusterId: string, namespaceName: string, name: string, data: Partial<IngressAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}/annotations`, { data })
}

/**
 * 删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 */
export function deleteIngress(clusterId: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 批量删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Ingress 名称列表
 */
export function deleteIngresses(clusterId: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses`, { data: names })
}
