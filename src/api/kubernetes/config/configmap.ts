/**
 * 配置映射（ConfigMap）管理 API
 * @module api/kubernetes/config/configmap
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  ConfigMapCreateForm,
  ConfigMapDetailVo,
  ConfigMapExportQueryForm,
  ConfigMapListVo,
  ConfigMapQueryForm,
  ConfigMapUpdateForm,
  ConfigMapYamlVo,
} from '@/types/kubernetes/config/configmap'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取配置映射（ConfigMap）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的配置映射列表
 */
export function getConfigMapList(
  clusterUid: string,
  query: Partial<ConfigMapQueryForm>,
): Promise<PageVo<ConfigMapListVo>> {
  return request.get<PageVo<ConfigMapListVo>>(`/kubernetes/clusters/${clusterUid}/configmaps`, { params: query })
}

/**
 * 获取配置映射（ConfigMap）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @returns 配置映射详情
 */
export function getConfigMapDetail(clusterUid: string, namespace: string, name: string): Promise<ConfigMapDetailVo> {
  return request.get<ConfigMapDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 获取配置映射（ConfigMap）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @returns 配置映射 YAML
 */
export function getConfigMapYaml(clusterUid: string, namespace: string, name: string): Promise<ConfigMapYamlVo> {
  return request.get<ConfigMapYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/yaml`,
  )
}

/**
 * 获取配置映射（ConfigMap）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getConfigMapEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createConfigMap(clusterUid: string, data: Partial<ConfigMapCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/configmaps`, data)
}

/**
 * 创建配置映射（ConfigMap）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createConfigMapYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/configmaps/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 更新请求对象
 */
export function updateConfigMap(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ConfigMapUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`, data)
}

/**
 * 更新配置映射（ConfigMap）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param yaml - 更新 YAML 文本
 */
export function updateConfigMapYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置配置映射（ConfigMap）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 标签配置请求对象
 */
export function manageConfigMapLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/labels`,
    data,
  )
}

/**
 * 配置配置映射（ConfigMap）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 注解配置请求对象
 */
export function manageConfigMapAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/annotations`,
    data,
  )
}

/**
 * 删除配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 */
export function deleteConfigMap(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 批量删除配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param uids - 配置映射 UID 数组
 */
export function deleteConfigMaps(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/configmaps`, { data: uids })
}

/**
 * 导入配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importConfigMap(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/configmaps/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportConfigMap(clusterUid: string, query: Partial<ConfigMapExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/configmaps/export`, { params: query })
}
