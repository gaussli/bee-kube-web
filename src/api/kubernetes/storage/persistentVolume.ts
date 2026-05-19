/**
 * PersistentVolume 资源 API
 * @module api/kubernetes/persistentVolume
 */
import type { PageResp } from '@/types/common'
import type { PersistentVolumeQueryReq, PersistentVolumeResp, PersistentVolumeLabelsReq, PersistentVolumeAnnotationsReq } from '@/types/kubernetes/storage/persistentVolume'
import { request } from '@/utils'

/**
 * 获取 PersistentVolume 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolume 列表
 */
export function getPersistentVolumePage(clusterId: string, params: Partial<PersistentVolumeQueryReq>): Promise<PageResp<PersistentVolumeResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/persistentvolumes`, { params })
}

/**
 * 获取 PersistentVolume 详情
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @returns PersistentVolume 详情
 */
export function getPersistentVolumeDetail(clusterId: string, name: string): Promise<PersistentVolumeResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}`)
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @param data - 标签更新参数
 */
export function managePersistentVolumeLabels(clusterId: string, name: string, data: Partial<PersistentVolumeLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}/labels`, { data })
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @param data - 注解更新参数
 */
export function managePersistentVolumeAnnotations(clusterId: string, name: string, data: Partial<PersistentVolumeAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}/annotations`, { data })
}

/**
 * 删除 PersistentVolume
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 */
export function deletePersistentVolume(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}`)
}

/**
 * 批量删除 PersistentVolume
 * @param clusterId - 集群 ID
 * @param names - 待删除的 PersistentVolume 名称列表
 */
export function deletePersistentVolumes(clusterId: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/persistentvolumes`, { data: names })
}
