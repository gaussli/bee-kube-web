/**
 * StorageClass 资源 API
 * @module api/kubernetes/storageClass
 */
import type { PageVo } from '@/types/common'
import type {
  StorageClassQueryReq,
  StorageClassResp,
  StorageClassLabelsReq,
  StorageClassAnnotationsReq,
} from '@/types/kubernetes/storage/storageClass'

import { request } from '@/utils'

/**
 * 获取 StorageClass 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 StorageClass 列表
 */
export function getStorageClassPage(
  clusterUid: string,
  params: Partial<StorageClassQueryReq>,
): Promise<PageVo<StorageClassResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/storageclasses`, { params })
}

/**
 * 获取 StorageClass 详情
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @returns StorageClass 详情
 */
export function getStorageClassDetail(clusterUid: string, name: string): Promise<StorageClassResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`)
}

/**
 * 更新 StorageClass 标签
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param data - 标签更新参数
 */
export function manageStorageClassLabels(
  clusterUid: string,
  name: string,
  data: Partial<StorageClassLabelsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/labels`, { data })
}

/**
 * 更新 StorageClass 注解
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param data - 注解更新参数
 */
export function manageStorageClassAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<StorageClassAnnotationsReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/annotations`, { data })
}
