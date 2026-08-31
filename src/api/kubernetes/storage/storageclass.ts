/**
 * 存储类（StorageClass）管理 API
 * @module api/kubernetes/storageclass
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  StorageClassCreateForm,
  StorageClassDetailVo,
  StorageClassExportQueryForm,
  StorageClassListVo,
  StorageClassQueryForm,
  StorageClassUpdateForm,
  StorageClassYamlVo,
} from '@/types/kubernetes/storage/storageclass'

import { request } from '@/utils'

/**
 * 获取存储类（StorageClass）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的存储类列表
 */
export function getStorageClassList(
  clusterUid: string,
  query: Partial<StorageClassQueryForm>,
): Promise<PageVo<StorageClassListVo>> {
  return request.get<PageVo<StorageClassListVo>>(`/kubernetes/clusters/${clusterUid}/storageclasses`, { params: query })
}

/**
 * 获取存储类（StorageClass）详情
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @returns 存储类详情
 */
export function getStorageClassDetail(clusterUid: string, name: string): Promise<StorageClassDetailVo> {
  return request.get<StorageClassDetailVo>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`)
}

/**
 * 获取存储类（StorageClass）YAML
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @returns 存储类 YAML
 */
export function getStorageClassYaml(clusterUid: string, name: string): Promise<StorageClassYamlVo> {
  return request.get<StorageClassYamlVo>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/yaml`)
}

/**
 * 获取存储类（StorageClass）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
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
 * 创建存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createStorageClass(clusterUid: string, data: Partial<StorageClassCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/storageclasses`, data)
}

/**
 * 创建存储类（StorageClass）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createStorageClassYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 更新请求对象
 */
export function updateStorageClass(
  clusterUid: string,
  name: string,
  data: Partial<StorageClassUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`, data)
}

/**
 * 更新存储类（StorageClass）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param yaml - 更新 YAML 文本
 */
export function updateStorageClassYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置存储类（StorageClass）标签
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 标签配置请求对象
 */
export function manageStorageClassLabels(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/labels`, data)
}

/**
 * 配置存储类（StorageClass）注解
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 注解配置请求对象
 */
export function manageStorageClassAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}/annotations`, data)
}

/**
 * 删除存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 */
export function deleteStorageClass(clusterUid: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/${name}`)
}

/**
 * 批量删除存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param uids - 存储类 UID 数组
 */
export function deleteStorageClasses(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/storageclasses`, { data: uids })
}

/**
 * 导入存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importStorageClass(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportStorageClass(clusterUid: string, query: Partial<StorageClassExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/storageclasses/export`, { params: query })
}
