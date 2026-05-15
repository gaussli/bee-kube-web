/**
 * 命名空间管理 API
 * @module api/namespace
 */
import { request } from '@/utils'
import type { NamespaceQueryReq, NamespaceResp, NamespaceLabelsReq, NamespaceReq, NamespaceAnnotationsReq, PageResp } from '@/types'

/**
 * 获取命名空间分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的命名空间列表
 */
export function getNamespacePage(clusterId: string, params: Partial<NamespaceQueryReq>) {
  return request.get<PageResp<NamespaceResp>>(`/kubernetes/clusters/${clusterId}/namespaces`, { params: params })
}

/**
 * 获取命名空间详情
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
export function getNamespaceDetail(clusterId: string, name: string) {
  return request.get<NamespaceResp>(`/kubernetes/clusters/${clusterId}/namespaces/${name}`)
}

/**
 * 创建命名空间
 * @param clusterId - 集群ID
 * @param data - 创建参数
 * @returns 创建的命名空间ID
 */
export function createNamespace(clusterId: string, data: Partial<NamespaceReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces`, { data: data })
}

/**
 * 更新命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 更新参数
 * @returns 更新后的命名空间ID
 */
export function updateNamespace(clusterId: string, name: string, data: Partial<NamespaceReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${name}`, { data: data })
}

/**
 * 更新命名空间标签
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 标签数据
 */
export function manageNamespaceLabels(clusterId: string, name: string, data: NamespaceLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${name}/labels`, { data: data })
}

/**
 * 更新命名空间注解
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 注解数据
 */
export function manageNamespaceAnnotations(clusterId: string, name: string, data: NamespaceAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${name}/annotations`, { data: data })
}

/**
 * 删除命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
export function deleteNamespace(clusterId: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${name}`)
}

/**
 * 批量删除命名空间
 * @param clusterId - 集群ID
 * @param names - 命名空间名称数组
 */
export function deleteNamespaces(clusterId: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/batch`, { data: names })
}
