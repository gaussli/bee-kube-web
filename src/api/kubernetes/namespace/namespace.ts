/**
 * 命名空间（Namespace）管理 API
 * @module api/kubernetes/namespace
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceCreateForm,
  NamespaceDetailVo,
  NamespaceExportQueryForm,
  NamespaceListVo,
  NamespaceMonitorQueryForm,
  NamespaceMonitorVo,
  NamespaceQueryForm,
  NamespaceSimpleListVo,
  NamespaceUpdateForm,
  NamespaceYamlVo,
} from '@/types/kubernetes/namespace'

import { request } from '@/utils'

/**
 * 获取命名空间（Namespace）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的命名空间列表
 */
export function getNamespaceList(
  clusterUid: string,
  query: Partial<NamespaceQueryForm>,
): Promise<PageVo<NamespaceListVo | NamespaceSimpleListVo>> {
  return request.get<PageVo<NamespaceListVo | NamespaceSimpleListVo>>(`/kubernetes/clusters/${clusterUid}/namespaces`, {
    params: query,
  })
}

/**
 * 获取命名空间（Namespace）详情
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
export function getNamespaceDetail(clusterUid: string, name: string): Promise<NamespaceDetailVo> {
  return request.get<NamespaceDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}`)
}

/**
 * 获取命名空间（Namespace）YAML
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML
 */
export function getNamespaceYaml(clusterUid: string, name: string): Promise<NamespaceYamlVo> {
  return request.get<NamespaceYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/yaml`)
}

/**
 * 获取命名空间（Namespace）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getNamespaceEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/events`, {
    params: query,
  })
}

/**
 * 获取命名空间（Namespace）监控数据
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param query - 监控查询条件
 * @returns 命名空间监控数据
 */
export function getNamespaceMonitor(
  clusterUid: string,
  name: string,
  query: Partial<NamespaceMonitorQueryForm>,
): Promise<NamespaceMonitorVo> {
  return request.get<NamespaceMonitorVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/monitor`, {
    params: query,
  })
}

/**
 * 创建命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createNamespace(clusterUid: string, data: Partial<NamespaceCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces`, data)
}

/**
 * 创建命名空间（Namespace）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createNamespaceYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 更新请求对象
 */
export function updateNamespace(clusterUid: string, name: string, data: Partial<NamespaceUpdateForm>): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}`, data)
}

/**
 * 更新命名空间（Namespace）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param yaml - 更新 YAML 文本
 */
export function updateNamespaceYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置命名空间（Namespace）标签
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 标签配置请求对象
 */
export function manageNamespaceLabels(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/labels`, data)
}

/**
 * 配置命名空间（Namespace）注解
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 注解配置请求对象
 */
export function manageNamespaceAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}/annotations`, data)
}

/**
 * 删除命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 */
export function deleteNamespace(clusterUid: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${name}`)
}

/**
 * 批量删除命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param uids - 命名空间 UID 数组
 */
export function deleteNamespaces(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces`, { data: uids })
}

/**
 * 导入命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importNamespace(
  clusterUid: string,
  formData: FormData,
  onProgress?: (e: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/namespaces/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportNamespace(clusterUid: string, query: Partial<NamespaceExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/namespaces/export`, { params: query })
}
