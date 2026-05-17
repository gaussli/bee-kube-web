/**
 * @fileOverview PersistentVolumeClaim 资源管理 API
 */
import type { PersistentVolumeClaimQueryReq, PersistentVolumeClaimResp, PersistentVolumeClaimReq, PersistentVolumeClaimLabelsReq, PersistentVolumeClaimAnnotationsReq, PageResp } from '@/types'
import { request } from '@/utils'

/**
 * 获取 PersistentVolumeClaim 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolumeClaim 列表
 */
export function getPersistentVolumeClaimPage(clusterId: string, namespace: string, params: Partial<PersistentVolumeClaimQueryReq>) {
  return request.get<PageResp<PersistentVolumeClaimResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims`, {
    params: params
  })
}

/**
 * 获取 PersistentVolumeClaim 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 详情
 */
export function getPersistentVolumeClaimDetail(clusterId: string, namespace: string, name: string) {
  return request.get<PersistentVolumeClaimResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/${name}`)
}

/**
 * 创建 PersistentVolumeClaim
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 PersistentVolumeClaim ID
 */
export function createPersistentVolumeClaim(clusterId: string, namespace: string, data: Partial<PersistentVolumeClaimReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims`, {
    data: data
  })
}

/**
 * 更新 PersistentVolumeClaim
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 更新参数
 * @returns 更新后的 PersistentVolumeClaim ID
 */
export function updatePersistentVolumeClaim(clusterId: string, namespace: string, name: string, data: Partial<PersistentVolumeClaimReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/${name}`, {
    data: data
  })
}

/**
 * 更新 PersistentVolumeClaim 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 标签数据
 */
export function managePersistentVolumeClaimLabels(clusterId: string, namespace: string, name: string, data: PersistentVolumeClaimLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/${name}/labels`, { data: data })
}

/**
 * 更新 PersistentVolumeClaim 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 注解数据
 */
export function managePersistentVolumeClaimAnnotations(clusterId: string, namespace: string, name: string, data: PersistentVolumeClaimAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/${name}/annotations`, { data: data })
}

/**
 * 删除 PersistentVolumeClaim
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 */
export function deletePersistentVolumeClaim(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/${name}`)
}

/**
 * 批量删除 PersistentVolumeClaim
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - PersistentVolumeClaim 名称数组
 */
export function deletePersistentVolumeClaims(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/persistentvolumeclaims/batch`, {
    data: names
  })
}
