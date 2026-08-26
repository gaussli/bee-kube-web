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
 * 查看持久卷（PersistentVolume）YAML
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @returns 持久卷 YAML
 */
export function getPersistentVolumeYaml(clusterUid: string, name: string): Promise<PersistentVolumeYamlVo> {
  return request.get<PersistentVolumeYamlVo>(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/yaml`)
}

/**
 * 获取持久卷（PersistentVolume）事件列表
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
 * 创建 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 PersistentVolume ID
 */
export function createPersistentVolume(clusterUid: string, data: Partial<PersistentVolumeCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, data)
}

/**
 * 通过 YAML 创建 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param yaml - PersistentVolume YAML 文本
 */
export function createPersistentVolumeYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param data - 更新参数
 * @returns 更新的 PersistentVolume ID
 */
export function updatePersistentVolume(
  clusterUid: string,
  name: string,
  data: Partial<PersistentVolumeUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}`, data)
}

/**
 * 通过 YAML 更新 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param yaml - PersistentVolume YAML 文本
 */
export function updatePersistentVolumeYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param data - 标签更新参数
 */
export function managePersistentVolumeLabel(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/labels`, data)
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterUid - 集群 UID
 * @param name - PersistentVolume 名称
 * @param data - 注解更新参数
 */
export function managePersistentVolumeAnnotation(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumes/${name}/annotations`, data)
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
 * @param uids - 待删除的 PersistentVolume UID 列表
 */
export function deletePersistentVolumes(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/persistentvolumes`, { data: uids })
}

/**
 * 导入 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
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
 * 导出 PersistentVolume
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportPersistentVolume(clusterUid: string, params: Partial<PersistentVolumeQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/persistentvolumes/export`, { params })
}
