/**
 * @fileOverview StorageClass 资源管理 API
 */
import type { StorageClassQueryReq, StorageClassResp, StorageClassLabelsReq, StorageClassAnnotationsReq, PageResp } from '@/types'
import { request } from '@/utils'

/**
 * 获取 StorageClass 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的 StorageClass 列表
 */
export function getStorageClassPage(clusterId: string, params: Partial<StorageClassQueryReq>) {
  return request.get<PageResp<StorageClassResp>>(`/kubernetes/clusters/${clusterId}/storageclasses`, {
    params: params
  })
}

/**
 * 获取 StorageClass 详情
 * @param clusterId - 集群ID
 * @param name - StorageClass 名称
 * @returns StorageClass 详情
 */
export function getStorageClassDetail(clusterId: string, name: string) {
  return request.get<StorageClassResp>(`/kubernetes/clusters/${clusterId}/storageclasses/${name}`)
}

/**
 * 更新 StorageClass 标签
 * @param clusterId - 集群ID
 * @param name - StorageClass 名称
 * @param data - 标签数据
 */
export function manageStorageClassLabels(clusterId: string, name: string, data: StorageClassLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/storageclasses/${name}/labels`, { data: data })
}

/**
 * 更新 StorageClass 注解
 * @param clusterId - 集群ID
 * @param name - StorageClass 名称
 * @param data - 注解数据
 */
export function manageStorageClassAnnotations(clusterId: string, name: string, data: StorageClassAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/storageclasses/${name}/annotations`, { data: data })
}
