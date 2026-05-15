/**
 * @fileOverview Ingress 资源相关 API
 * @module api/kubernetes/ingress
 */
import request from '@/utils/request'
import type { PageResp } from '@/types/common'
import type {
  IngressResp,
  IngressQueryReq,
  IngressReq,
  IngressLabelsReq,
  IngressAnnotationsReq
} from '@/types/kubernetes/ingress'

/**
 * 获取 Ingress 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns Ingress 分页列表
 */
export function getIngressPage(clusterId: string, params: IngressQueryReq) {
  return request.get<PageResp<IngressResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${params.id}/ingresses`, {
    params
  })
}

/**
 * 获取 Ingress 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @returns Ingress 详情
 */
export function getIngressDetail(clusterId: string, namespaceName: string, name: string) {
  return request.get<IngressResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 创建 Ingress
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 Ingress ID
 */
export function createIngress(clusterId: string, data: IngressReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/ingresses`, data)
}

/**
 * 更新 Ingress
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 Ingress ID
 */
export function updateIngress(clusterId: string, data: IngressReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/ingresses/${data.name}`, data)
}

/**
 * 更新 Ingress 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 标签更新参数
 */
export function manageIngressLabels(clusterId: string, namespaceName: string, name: string, data: IngressLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}/labels`, data)
}

/**
 * 更新 Ingress 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 注解更新参数
 */
export function manageIngressAnnotations(clusterId: string, namespaceName: string, name: string, data: IngressAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}/annotations`, data)
}

/**
 * 删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 */
export function deleteIngress(clusterId: string, namespaceName: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 批量删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param data - 待删除的 Ingress 名称列表
 */
export function deleteIngresses(clusterId: string, namespaceName: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/ingresses`, {
    data
  })
}
