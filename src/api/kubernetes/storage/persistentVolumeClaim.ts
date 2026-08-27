/**
 * 持久卷声明（PersistentVolumeClaim）管理 API
 * @module api/kubernetes/persistentVolumeClaim
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PersistentVolumeClaimCreateForm,
  PersistentVolumeClaimDetailVo,
  PersistentVolumeClaimExportQueryForm,
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimQueryForm,
  PersistentVolumeClaimUpdateForm,
  PersistentVolumeClaimYamlVo,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import { request } from '@/utils'

/**
 * 获取持久卷声明（PersistentVolumeClaim）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的持久卷声明列表
 */
export function getPersistentVolumeClaimList(
  clusterUid: string,
  query: Partial<PersistentVolumeClaimQueryForm>,
): Promise<PageVo<PersistentVolumeClaimListVo>> {
  return request.get<PageVo<PersistentVolumeClaimListVo>>(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims`, {
    params: query,
  })
}

/**
 * 获取持久卷声明（PersistentVolumeClaim）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @returns 持久卷声明详情
 */
export function getPersistentVolumeClaimDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<PersistentVolumeClaimDetailVo> {
  return request.get<PersistentVolumeClaimDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}`,
  )
}

/**
 * 获取持久卷声明（PersistentVolumeClaim）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @returns 持久卷声明 YAML
 */
export function getPersistentVolumeClaimYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<PersistentVolumeClaimYamlVo> {
  return request.get<PersistentVolumeClaimYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/yaml`,
  )
}

/**
 * 获取持久卷声明（PersistentVolumeClaim）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getPersistentVolumeClaimEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createPersistentVolumeClaim(
  clusterUid: string,
  data: Partial<PersistentVolumeClaimCreateForm>,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims`, data)
}

/**
 * 创建持久卷声明（PersistentVolumeClaim）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createPersistentVolumeClaimYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 更新请求对象
 */
export function updatePersistentVolumeClaim(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<PersistentVolumeClaimUpdateForm>,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}`,
    data,
  )
}

/**
 * 更新持久卷声明（PersistentVolumeClaim）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param yaml - 更新 YAML 文本
 */
export function updatePersistentVolumeClaimYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置持久卷声明（PersistentVolumeClaim）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 标签配置请求对象
 */
export function managePersistentVolumeClaimLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/labels`,
    data,
  )
}

/**
 * 配置持久卷声明（persistentvolumeclaim）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 注解配置请求对象
 */
export function managePersistentVolumeClaimAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/annotations`,
    data,
  )
}

/**
 * 删除持久卷声明（persistentvolumeclaim）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 */
export function deletePersistentVolumeClaim(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}`,
  )
}

/**
 * 批量删除持久卷声明（persistentvolumeclaim）
 * @param clusterUid - 集群 UID
 * @param uids - 持久卷声明 UID 数组
 */
export function deletePersistentVolumeClaims(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims`, {
    data: uids,
  })
}

/**
 * 导入持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importPersistentVolumeClaim(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出持久卷声明（persistentvolumeclaim）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param query - 导出查询条件
 */
export function exportPersistentVolumeClaim(
  clusterUid: string,
  namespace: string,
  query: Partial<PersistentVolumeClaimExportQueryForm>,
): Promise<void> {
  return request.download<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/export`,
    {
      params: query,
    },
  )
}
