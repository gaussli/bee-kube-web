/**
 * PersistentVolume 资源 API
 * @module api/kubernetes/persistentVolume
 */
import type { PageVo } from '@/types/common'
import type {
  PersistentVolumeQueryReq,
  PersistentVolumeResp,
  PersistentVolumeLabelsReq,
  PersistentVolumeAnnotationsReq,
} from '@/types/kubernetes/storage/persistentVolume'

import { request } from '@/utils'

/**
 * 获取 PersistentVolume 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolume 列表
 */
export function getPersistentVolumePage(
  clusterUid: string,
  params: Partial<PersistentVolumeQueryReq>,
): Promise<PageVo<PersistentVolumeResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, { params })
}

/**
 * 获取 PersistentVolume 详情
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @returns PersistentVolume 详情
 */
export function getPersistentVolumeDetail(clusterUid: string, name: string): Promise<PersistentVolumeResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`)
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param data - 标签更新参数
 */
export function managePersistentVolumeLabels(
  clusterUid: string,
  name: string,
  data: Partial<PersistentVolumeLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/labels`, { data })
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param data - 注解更新参数
 */
export function managePersistentVolumeAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<PersistentVolumeAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/annotations`, { data })
}

/**
 * 删除 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 */
export function deletePersistentVolume(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`)
}

/**
 * 批量删除 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param names - 待删除的 PersistentVolume 名称列表
 */
export function deletePersistentVolumes(clusterUid: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, { data: names })
}
