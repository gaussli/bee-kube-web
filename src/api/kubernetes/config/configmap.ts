/**
 * 配置（ConfigMap）管理 API
 * @module api/kubernetes/config/configmap
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  ConfigMapCreateForm,
  ConfigMapDetailVo,
  ConfigMapListVo,
  ConfigMapQueryForm,
  ConfigMapUpdateForm,
  ConfigMapYamlVo,
} from '@/types/kubernetes/config/configmap'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取配置（ConfigMap）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的配置列表
 */
export function getConfigMapList(
  clusterUid: string,
  query: Partial<ConfigMapQueryForm>,
): Promise<PageVo<ConfigMapListVo>> {
  return request.get<PageVo<ConfigMapListVo>>(`/kubernetes/clusters/${clusterUid}/configmaps`, { params: query })
}

/**
 * 获取配置（ConfigMap）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置名称
 * @returns 配置详情
 */
export function getConfigMapDetail(clusterUid: string, namespace: string, name: string): Promise<ConfigMapDetailVo> {
  return request.get<ConfigMapDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 查看配置（ConfigMap）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置名称
 * @returns 配置 YAML
 */
export function getConfigMapYaml(clusterUid: string, namespace: string, name: string): Promise<ConfigMapYamlVo> {
  return request.get<ConfigMapYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/yaml`,
  )
}

/**
 * 获取 ConfigMap 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
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
 * 创建 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createConfigMap(clusterUid: string, data: Partial<ConfigMapCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/configmaps`, data)
}

/**
 * 创建 ConfigMap（YAML 方式）
 * @param clusterUid - 集群 UID
 * @param yaml - ConfigMap YAML 文本
 */
export function createConfigMapYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/configmaps/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 更新参数
 */
export function updateConfigMap(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ConfigMapUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`, data)
}

/**
 * 通过 YAML 更新 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param yaml - ConfigMap YAML 文本
 */
export function updateConfigMapYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 ConfigMap 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 标签更新参数
 */
export function manageConfigMapLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/labels`, data)
}

/**
 * 更新 ConfigMap 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 注解数据
 */
export function manageConfigMapAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/annotations`, data)
}

/**
 * 删除 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 */
export function deleteConfigMap(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 批量删除 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - ConfigMap UID 数组
 */
export function deleteConfigMaps(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps`, { data: uids })
}

/**
 * 导入 ConfigMap
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importConfigMap(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/configmaps/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 ConfigMap CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportConfigMap(clusterUid: string, params: Partial<ConfigMapQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/configmaps/export`, { params })
}
