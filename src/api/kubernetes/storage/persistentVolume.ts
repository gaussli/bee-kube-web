/**
 * @fileOverview PersistentVolume 资源管理 API
 */
import { request } from '@/utils'
import type { PersistentVolumeQueryReq, PersistentVolumeResp, PersistentVolumeLabelsReq, PersistentVolumeAnnotationsReq, PageResp } from '@/types'

/**
 * 获取 PersistentVolume 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolume 列表
 */
export function getPersistentVolumePage(clusterId: string, params: Partial<PersistentVolumeQueryReq>) {
  return request.get<PageResp<PersistentVolumeResp>>(`/kubernetes/clusters/${clusterId}/persistentvolumes`, {
    params: params
  })
}

/**
 * 获取 PersistentVolume 详情
 * @param clusterId - 集群ID
 * @param name - PersistentVolume 名称
 * @returns PersistentVolume 详情
 */
export function getPersistentVolumeDetail(clusterId: string, name: string) {
  return request.get<PersistentVolumeResp>(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}`)
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterId - 集群ID
 * @param name - PersistentVolume 名称
 * @param data - 标签数据
 */
export function managePersistentVolumeLabels(clusterId: string, name: string, data: PersistentVolumeLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}/labels`, { data: data })
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterId - 集群ID
 * @param name - PersistentVolume 名称
 * @param data - 注解数据
 */
export function managePersistentVolumeAnnotations(clusterId: string, name: string, data: PersistentVolumeAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}/annotations`, { data: data })
}

/**
 * 删除 PersistentVolume
 * @param clusterId - 集群ID
 * @param name - PersistentVolume 名称
 */
export function deletePersistentVolume(clusterId: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/persistentvolumes/${name}`)
}

/**
 * 批量删除 PersistentVolume
 * @param clusterId - 集群ID
 * @param names - PersistentVolume 名称数组
 */
export function deletePersistentVolumes(clusterId: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/persistentvolumes/batch`, {
    data: names
  })
}
