/**
 * 命名空间管理 API
 * @module api/kubernetes/namespace
 */
import type { PageResp } from '@/types/common'
import type { NamespaceQueryReq, NamespaceListResp, NamespaceDetailResp, NamespaceLabelsReq, NamespaceReq, NamespaceAnnotationsReq, NamespaceQuotaReq, NamespaceImportReq } from '@/types/kubernetes/namespace'
import { request } from '@/utils'

/**
 * 获取命名空间分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的命名空间列表
 */
export function getNamespacePage(clusterId: string, params: Partial<NamespaceQueryReq>): Promise<PageResp<NamespaceListResp>> {
  return request.get<PageResp<NamespaceListResp>>(`/kubernetes/clusters/${clusterId}/namespaces`, params)
}

/**
 * 获取命名空间详情
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
export function getNamespaceDetail(clusterId: string, name: string): Promise<NamespaceDetailResp> {
  return request.get<NamespaceDetailResp>(`/kubernetes/clusters/${clusterId}/namespaces/${name}`)
}

/**
 * 创建命名空间
 * @param clusterId - 集群ID
 * @param data - 创建参数
 */
export function createNamespace(clusterId: string, data: Partial<NamespaceReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces`, data)
}

/**
 * 更新命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 更新参数
 */
export function updateNamespace(clusterId: string, name: string, data: Partial<NamespaceReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${name}`, data)
}

/**
 * 更新命名空间标签
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 标签数据
 */
export function manageNamespaceLabels(clusterId: string, name: string, data: Partial<NamespaceLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${name}/labels`, data)
}

/**
 * 更新命名空间注解
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 注解数据
 */
export function manageNamespaceAnnotations(clusterId: string, name: string, data: Partial<NamespaceAnnotationsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${name}/annotations`, data)
}

/**
 * 删除命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
export function deleteNamespace(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${name}`)
}

/**
 * 批量删除命名空间
 * @param clusterId - 集群ID
 * @param names - 命名空间名称数组
 */
export function deleteNamespaces(clusterId: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/batch`, names)
}

/**
 * 导出命名空间 CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
export function exportNamespaces(clusterId: string, params: Partial<NamespaceQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/export`, params, { responseType: 'blob' })
}

/**
 * 导入命名空间
 * @param clusterId - 集群ID
 * @param data - 导入配置
 */
export function importNamespaces(clusterId: string, data: Partial<NamespaceImportReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/import`, data)
}

/**
 * 创建命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
export function createNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${name}/quota`, data)
}

/**
 * 更新命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
export function updateNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${name}/quota`, data)
}

/**
 * 删除命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
export function deleteNamespaceQuota(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${name}/quota`)
}

/**
 * 查看命名空间 YAML
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML 配置
 */
export function getNamespaceYaml(clusterId: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterId}/namespaces/${name}/yaml`)
}
