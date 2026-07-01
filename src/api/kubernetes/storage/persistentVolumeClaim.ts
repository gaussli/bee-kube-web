/**
 * PersistentVolumeClaim 资源 API
 * @module api/kubernetes/persistentVolumeClaim
 */
import type { PageVo } from '@/types/common'
import type {
  PersistentVolumeClaimQueryReq,
  PersistentVolumeClaimResp,
  PersistentVolumeClaimReq,
  PersistentVolumeClaimLabelsReq,
  PersistentVolumeClaimAnnotationsReq
} from '@/types/kubernetes/storage/persistentVolumeClaim'
import { request } from '@/utils'

/**
 * 获取 PersistentVolumeClaim 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolumeClaim 列表
 */
export function getPersistentVolumeClaimPage(clusterId: string, namespaceName: string, params: Partial<PersistentVolumeClaimQueryReq>): Promise<PageVo<PersistentVolumeClaimResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims`, { params })
}

/**
 * 获取 PersistentVolumeClaim 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 详情
 */
export function getPersistentVolumeClaimDetail(clusterId: string, namespaceName: string, name: string): Promise<PersistentVolumeClaimResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims/${name}`)
}

/**
 * 创建 PersistentVolumeClaim
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 PersistentVolumeClaim ID
 */
export function createPersistentVolumeClaim(clusterId: string, data: Partial<PersistentVolumeClaimReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/persistentvolumeclaims`, { data })
}

/**
 * 更新 PersistentVolumeClaim
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 PersistentVolumeClaim ID
 */
export function updatePersistentVolumeClaim(clusterId: string, data: Partial<PersistentVolumeClaimReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/persistentvolumeclaims/${data.name}`, { data })
}

/**
 * 更新 PersistentVolumeClaim 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 标签更新参数
 */
export function managePersistentVolumeClaimLabels(clusterId: string, namespaceName: string, name: string, data: Partial<PersistentVolumeClaimLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims/${name}/labels`, { data })
}

/**
 * 更新 PersistentVolumeClaim 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 注解更新参数
 */
export function managePersistentVolumeClaimAnnotations(clusterId: string, namespaceName: string, name: string, data: Partial<PersistentVolumeClaimAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims/${name}/annotations`, { data })
}

/**
 * 删除 PersistentVolumeClaim
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 */
export function deletePersistentVolumeClaim(clusterId: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims/${name}`)
}

/**
 * 批量删除 PersistentVolumeClaim
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 PersistentVolumeClaim 名称列表
 */
export function deletePersistentVolumeClaims(clusterId: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/persistentvolumeclaims`, { data: names })
}
