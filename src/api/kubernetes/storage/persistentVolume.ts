/**
 * 持久卷（PersistentVolume）管理 API
 * @module api/kubernetes/persistentVolume
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PersistentVolumeCreateForm,
  PersistentVolumeDetailVo,
  PersistentVolumeExportQueryForm,
  PersistentVolumeListVo,
  PersistentVolumeQueryForm,
  PersistentVolumeUpdateForm,
  PersistentVolumeYamlVo,
} from '@/types/kubernetes/storage/persistentvolume'

import { request } from '@/utils'

/**
 * 获取持久卷（PersistentVolume）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的持久卷列表
 */
export function getPersistentVolumeList(
  clusterUid: string,
  query: Partial<PersistentVolumeQueryForm>,
): Promise<PageVo<PersistentVolumeListVo>> {
  return request.get<PageVo<PersistentVolumeListVo>>(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, {
    params: query,
  })
}

/**
 * 获取持久卷（PersistentVolume）详情
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @returns 持久卷详情
 */
export function getPersistentVolumeDetail(clusterUid: string, name: string): Promise<PersistentVolumeDetailVo> {
  return request.get<PersistentVolumeDetailVo>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`)
}

/**
 * 获取持久卷（PersistentVolume）YAML
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @returns 持久卷 YAML
 */
export function getPersistentVolumeYaml(clusterUid: string, name: string): Promise<PersistentVolumeYamlVo> {
  return request.get<PersistentVolumeYamlVo>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/yaml`)
}

/**
 * 获取持久卷（PersistentVolume）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getPersistentVolumeEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/events`, {
    params: query,
  })
}

/**
 * 创建持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createPersistentVolume(clusterUid: string, data: Partial<PersistentVolumeCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, data)
}

/**
 * 创建持久卷（PersistentVolume）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createPersistentVolumeYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 更新请求对象
 */
export function updatePersistentVolume(
  clusterUid: string,
  name: string,
  data: Partial<PersistentVolumeUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`, data)
}

/**
 * 更新持久卷（PersistentVolume）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param yaml - 更新 YAML 文本
 */
export function updatePersistentVolumeYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置持久卷（PersistentVolume）标签
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 标签配置请求对象
 */
export function managePersistentVolumeLabels(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/labels`, data)
}

/**
 * 配置持久卷（persistentvolume）注解
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 注解配置请求对象
 */
export function managePersistentVolumeAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/annotations`, data)
}

/**
 * 删除持久卷（persistentvolume）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 */
export function deletePersistentVolume(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`)
}

/**
 * 批量删除持久卷（persistentvolume）
 * @param clusterUid - 集群 UID
 * @param uids - 持久卷 UID 数组
 */
export function deletePersistentVolumes(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, { data: uids })
}

/**
 * 导入持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importPersistentVolume(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出持久卷（persistentvolume）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportPersistentVolume(
  clusterUid: string,
  query: Partial<PersistentVolumeExportQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/persistentvolumes/export`, { params: query })
}
