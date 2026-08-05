/**
 * Ingress 资源 API
 * @module api/kubernetes/ingress
 */
import type { PageVo } from '@/types/common'
import type {
  IngressListVo,
  IngressQueryReq,
  IngressReq,
  IngressLabelsReq,
  IngressAnnotationsReq,
} from '@/types/kubernetes/network/ingress'

import { request } from '@/utils'

/**
 * 获取 Ingress 分页列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Ingress 列表
 */
export function getIngressPage(
  clusterUid: string,
  namespaceName: string,
  params: Partial<IngressQueryReq>,
): Promise<PageVo<IngressListVo>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses`, { params })
}

/**
 * 获取 Ingress 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @returns Ingress 详情
 */
export function getIngressDetail(clusterUid: string, namespaceName: string, name: string): Promise<IngressListVo> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 创建 Ingress
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 Ingress ID
 */
export function createIngress(clusterUid: string, data: Partial<IngressReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/ingresses`, { data })
}

/**
 * 更新 Ingress
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 * @returns 更新的 Ingress ID
 */
export function updateIngress(clusterUid: string, data: Partial<IngressReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/ingresses/${data.name}`, { data })
}

/**
 * 更新 Ingress 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 标签更新参数
 */
export function manageIngressLabels(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<IngressLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses/${name}/labels`, {
    data,
  })
}

/**
 * 更新 Ingress 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 注解更新参数
 */
export function manageIngressAnnotations(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<IngressAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses/${name}/annotations`, {
    data,
  })
}

/**
 * 删除 Ingress
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 */
export function deleteIngress(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses/${name}`)
}

/**
 * 批量删除 Ingress
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Ingress 名称列表
 */
export function deleteIngresses(clusterUid: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/ingresses`, { data: names })
}
