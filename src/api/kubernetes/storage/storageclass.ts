/**
 * StorageClass 资源 API
 * @module api/kubernetes/storageclass
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  StorageClassCreateForm,
  StorageClassDetailVo,
  StorageClassListVo,
  StorageClassQueryForm,
  StorageClassUpdateForm,
  StorageClassYamlVo,
} from '@/types/kubernetes/storage/storageclass'

import { request } from '@/utils'

/**
 * 获取 StorageClass 列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 StorageClass 列表
 */
export function getStorageClassList(
  clusterUid: string,
  params: Partial<StorageClassQueryForm>,
): Promise<PageVo<StorageClassListVo>> {
  return request.get<PageVo<StorageClassListVo>>(`/kubernetes/clusters/${clusterUid}/storageclasses`, { params })
}

/**
 * 获取 StorageClass 详情
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @returns StorageClass 详情
 */
export function getStorageClassDetail(clusterUid: string, name: string): Promise<StorageClassDetailVo> {
  return request.get<StorageClassDetailVo>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`)
}

/**
 * 查看 StorageClass YAML
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @returns StorageClass 完整 YAML 文本
 */
export function getStorageClassYaml(clusterUid: string, name: string): Promise<StorageClassYamlVo> {
  return request.get<StorageClassYamlVo>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/yaml`)
}

/**
 * 获取 StorageClass 事件列表
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getStorageClassEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/events`, {
    params: query,
  })
}

/**
 * 创建 StorageClass
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 StorageClass ID
 */
export function createStorageClass(clusterUid: string, data: Partial<StorageClassCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/storageclasses`, data)
}

/**
 * 通过 YAML 创建 StorageClass
 * @param clusterUid - 集群 UID
 * @param yaml - StorageClass YAML 文本
 */
export function createStorageClassYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/storageclasses/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 StorageClass
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param data - 更新参数
 * @returns 更新的 StorageClass ID
 */
export function updateStorageClass(
  clusterUid: string,
  name: string,
  data: Partial<StorageClassUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`, data)
}

/**
 * 通过 YAML 更新 StorageClass
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param yaml - StorageClass YAML 文本
 */
export function updateStorageClassYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 StorageClass 标签
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param data - 标签更新参数
 */
export function manageStorageClassLabel(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/labels`, data)
}

/**
 * 更新 StorageClass 注解
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param data - 注解更新参数
 */
export function manageStorageClassAnnotation(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/annotations`, data)
}

/**
 * 删除 StorageClass
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 */
export function deleteStorageClass(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`)
}

/**
 * 批量删除 StorageClass
 * @param clusterUid - 集群 UID
 * @param uids - 待删除的 StorageClass UID 列表
 */
export function deleteStorageClasses(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/storageclasses`, { data: uids })
}

/**
 * 导入 StorageClass
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importStorageClass(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 StorageClass
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportStorageClass(clusterUid: string, params: Partial<StorageClassQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/storageclasses/export`, { params })
}
