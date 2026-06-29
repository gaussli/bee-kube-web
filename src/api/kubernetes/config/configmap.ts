/**
 * ConfigMap 资源管理 API
 * @module api/kubernetes/config/configmap
 */
import type { PageResp } from '@/types/common'
import type { ConfigMapListResp, ConfigMapDetailResp, ConfigMapQueryReq, ConfigMapReq, ConfigMapDataReq, ConfigMapLabelsReq, ConfigMapAnnotationsReq } from '@/types/kubernetes/config/configmap'
import { request } from '@/utils'

/**
 * 获取 ConfigMap 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数（含 namespace 筛选）
 * @returns 分页后的 ConfigMap 列表
 */
export function getConfigMapPage(clusterId: string, params: Partial<ConfigMapQueryReq>): Promise<PageResp<ConfigMapListResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/configmaps`, params)
}

/**
 * 获取 ConfigMap 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap 详情
 */
export function getConfigMapDetail(clusterId: string, namespace: string, name: string): Promise<ConfigMapDetailResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 创建 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createConfigMap(clusterId: string, namespace: string, data: Partial<ConfigMapReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps`, data)
}

/**
 * 更新 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 更新参数
 */
export function updateConfigMap(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}`, data)
}

/**
 * 更新 ConfigMap 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 数据参数
 */
export function manageConfigMapData(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapDataReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}/data`, data)
}

/**
 * 更新 ConfigMap 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 标签数据
 */
export function manageConfigMapLabels(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}/labels`, data)
}

/**
 * 更新 ConfigMap 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 注解数据
 */
export function manageConfigMapAnnotations(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}/annotations`, data)
}

/**
 * 删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 */
export function deleteConfigMap(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 批量删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - ConfigMap 名称数组
 */
export function deleteConfigMaps(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/configmaps/batch`, names)
}
