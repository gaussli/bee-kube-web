/**
 * 自定义资源定义（CustomResourceDefinition）管理 API
 * @module api/kubernetes/customresourcedefinition
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  CustomResourceDefinitionQueryForm,
  CustomResourceDefinitionListVo,
  CustomResourceDefinitionDetailVo,
  CustomResourceDefinitionYamlVo,
  CustomResourceDefinitionCreateForm,
  CustomResourceDefinitionUpdateForm,
  CustomResourceDefinitionExportQueryForm,
} from '@/types/kubernetes/customresourcedefinition'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取自定义资源定义（CustomResourceDefinition）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的自定义资源定义列表
 */
export function getCustomResourceDefinitionList(
  clusterUid: string,
  query: Partial<CustomResourceDefinitionQueryForm>,
): Promise<PageVo<CustomResourceDefinitionListVo>> {
  return request.get<PageVo<CustomResourceDefinitionListVo>>(
    `/kubernetes/clusters/${clusterUid}/customresourcedefinitions`,
    {
      params: query,
    },
  )
}

/**
 * 获取自定义资源定义（CustomResourceDefinition）详情
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @returns 自定义资源定义详情
 */
export function getCustomResourceDefinitionDetail(
  clusterUid: string,
  name: string,
): Promise<CustomResourceDefinitionDetailVo> {
  return request.get<CustomResourceDefinitionDetailVo>(
    `/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}`,
  )
}

/**
 * 获取自定义资源定义（CustomResourceDefinition）YAML
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @returns 自定义资源定义 YAML
 */
export function getCustomResourceDefinitionYaml(
  clusterUid: string,
  name: string,
): Promise<CustomResourceDefinitionYamlVo> {
  return request.get<CustomResourceDefinitionYamlVo>(
    `/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}/yaml`,
  )
}

/**
 * 获取自定义资源定义（CustomResourceDefinition）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getCustomResourceDefinitionEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createCustomResourceDefinition(
  clusterUid: string,
  data: Partial<CustomResourceDefinitionCreateForm>,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions`, data)
}

/**
 * 创建自定义资源定义（CustomResourceDefinition）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createCustomResourceDefinitionYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 更新请求对象
 */
export function updateCustomResourceDefinition(
  clusterUid: string,
  name: string,
  data: Partial<CustomResourceDefinitionUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}`, data)
}

/**
 * 更新自定义资源定义（CustomResourceDefinition）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param yaml - 更新 YAML 文本
 */
export function updateCustomResourceDefinitionYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置自定义资源定义（CustomResourceDefinition）标签
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 标签配置请求对象
 */
export function manageCustomResourceDefinitionLabels(
  clusterUid: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}/labels`, data)
}

/**
 * 配置自定义资源定义（CustomResourceDefinition）注解
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 注解配置请求对象
 */
export function manageCustomResourceDefinitionAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}/annotations`, data)
}

/**
 * 删除自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 */
export function deleteCustomResourceDefinition(clusterUid: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/${name}`)
}

/**
 * 批量删除自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param uids - 自定义资源定义 UID 数组
 */
export function deleteCustomResourceDefinitions(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions`, { data: uids })
}

/**
 * 导入自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importCustomResourceDefinition(
  clusterUid: string,
  formData: FormData,
  onProgress?: (e: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportCustomResourceDefinition(
  clusterUid: string,
  query: Partial<CustomResourceDefinitionExportQueryForm>,
): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/customresourcedefinitions/export`, {
    params: query,
  })
}
