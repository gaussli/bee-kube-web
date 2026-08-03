/**
 * StorageClass 资源 API
 * @module api/kubernetes/storageClass
 */
import type { PageVo } from '@/types/common'
import type {
  StorageClassQueryReq,
  StorageClassResp,
  StorageClassLabelsReq,
  StorageClassAnnotationsReq
} from '@/types/kubernetes/storage/storageClass'
import { request } from '@/utils'

/**
 * 获取 StorageClass 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页后的 StorageClass 列表
 */
export function getStorageClassPage(
  clusterId: string,
  params: Partial<StorageClassQueryReq>
): Promise<PageVo<StorageClassResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/storageclasses`, { params })
}

/**
 * 获取 StorageClass 详情
 * @param clusterId - 集群 ID
 * @param name - StorageClass 名称
 * @returns StorageClass 详情
 */
export function getStorageClassDetail(clusterId: string, name: string): Promise<StorageClassResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/storageclasses/${name}`)
}

/**
 * 更新 StorageClass 标签
 * @param clusterId - 集群 ID
 * @param name - StorageClass 名称
 * @param data - 标签更新参数
 */
export function manageStorageClassLabels(
  clusterId: string,
  name: string,
  data: Partial<StorageClassLabelsReq>
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/storageclasses/${name}/labels`, { data })
}

/**
 * 更新 StorageClass 注解
 * @param clusterId - 集群 ID
 * @param name - StorageClass 名称
 * @param data - 注解更新参数
 */
export function manageStorageClassAnnotations(
  clusterId: string,
  name: string,
  data: Partial<StorageClassAnnotationsReq>
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/storageclasses/${name}/annotations`, { data })
}
