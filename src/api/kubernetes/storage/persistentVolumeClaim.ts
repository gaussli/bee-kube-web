/**
 * PersistentVolumeClaim 资源 API
 * @module api/kubernetes/persistentVolumeClaim
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PersistentVolumeClaimCreateForm,
  PersistentVolumeClaimDetailVo,
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimQueryForm,
  PersistentVolumeClaimUpdateForm,
  PersistentVolumeClaimYamlVo,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import { request } from '@/utils'

/**
 * 获取 PersistentVolumeClaim 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 PersistentVolumeClaim 列表
 */
export function getPersistentVolumeClaimList(
  clusterUid: string,
  namespace: string,
  params: Partial<PersistentVolumeClaimQueryForm>,
): Promise<PageVo<PersistentVolumeClaimListVo>> {
  return request.get<PageVo<PersistentVolumeClaimListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims`,
    { params },
  )
}

/**
 * 获取 PersistentVolumeClaim 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 详情
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
 * 查看 PersistentVolumeClaim YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 完整 YAML 文本
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
 * 获取 PersistentVolumeClaim 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
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
 * 创建 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 PersistentVolumeClaim ID
 */
export function createPersistentVolumeClaim(
  clusterUid: string,
  data: Partial<PersistentVolumeClaimCreateForm>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/persistentvolumeclaims`, data)
}

/**
 * 通过 YAML 创建 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param yaml - PersistentVolumeClaim YAML 文本
 */
export function createPersistentVolumeClaimYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/persistentvolumeclaims/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 更新参数
 * @returns 更新的 PersistentVolumeClaim ID
 */
export function updatePersistentVolumeClaim(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<PersistentVolumeClaimUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}`, data)
}

/**
 * 通过 YAML 更新 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param yaml - PersistentVolumeClaim YAML 文本
 */
export function updatePersistentVolumeClaimYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 更新 PersistentVolumeClaim 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 标签更新参数
 */
export function managePersistentVolumeClaimLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/labels`,
    data,
  )
}

/**
 * 更新 PersistentVolumeClaim 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param data - 注解更新参数
 */
export function managePersistentVolumeClaimAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}/annotations`,
    data,
  )
}

/**
 * 删除 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 */
export function deletePersistentVolumeClaim(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/${name}`)
}

/**
 * 批量删除 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 PersistentVolumeClaim UID 列表
 */
export function deletePersistentVolumeClaims(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims`, {
    data: uids,
  })
}

/**
 * 导入 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
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
 * 导出 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 */
export function exportPersistentVolumeClaim(
  clusterUid: string,
  namespace: string,
  params: Partial<PersistentVolumeClaimQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/persistentvolumeclaims/export`, {
    params,
  })
}
