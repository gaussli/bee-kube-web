/**
 * 服务（Service）管理 API
 * @module api/kubernetes/service
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ServiceCreateForm,
  ServiceDetailVo,
  ServiceExportQueryForm,
  ServiceListVo,
  ServiceQueryForm,
  ServiceUpdateForm,
  ServiceYamlVo,
} from '@/types/kubernetes/network/service'

import { request } from '@/utils'

/**
 * 获取服务（Service）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的服务列表
 */
export function getServiceList(clusterUid: string, query: Partial<ServiceQueryForm>): Promise<PageVo<ServiceListVo>> {
  return request.get<PageVo<ServiceListVo>>(`/kubernetes/clusters/${clusterUid}/services`, {
    params: query,
  })
}

/**
 * 获取服务（Service）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @returns 服务详情
 */
export function getServiceDetail(clusterUid: string, namespace: string, name: string): Promise<ServiceDetailVo> {
  return request.get<ServiceDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}`)
}

/**
 * 获取服务（Service）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @returns 服务 YAML
 */
export function getServiceYaml(clusterUid: string, namespace: string, name: string): Promise<ServiceYamlVo> {
  return request.get<ServiceYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}/yaml`)
}

/**
 * 获取服务（Service）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getServiceEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建服务（Service）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createService(clusterUid: string, data: Partial<ServiceCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/services`, data)
}

/**
 * 创建服务（Service）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createServiceYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/services/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新服务（Service）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 更新请求对象
 */
export function updateService(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ServiceUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}`, data)
}

/**
 * 更新服务（Service）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param yaml - 更新 YAML 文本
 */
export function updateServiceYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置服务（Service）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 标签配置请求对象
 */
export function manageServiceLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}/labels`, data)
}

/**
 * 配置服务（Service）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 注解配置请求对象
 */
export function manageServiceAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}/annotations`,
    data,
  )
}

/**
 * 删除服务（Service）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 */
export function deleteService(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/services/${name}`)
}

/**
 * 批量删除服务（Service）
 * @param clusterUid - 集群 UID
 * @param uids - 服务 UID 数组
 */
export function deleteServices(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/services`, {
    data: uids,
  })
}

/**
 * 导入服务（Service）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importService(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/services/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出服务（Service）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportService(clusterUid: string, query: Partial<ServiceExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/services/${name}/export`, { params: query })
}
