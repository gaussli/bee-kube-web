/**
 * Service 资源 API
 * @module api/kubernetes/service
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ServiceCreateForm,
  ServiceListVo,
  ServiceQueryForm,
  ServiceUpdateForm,
  ServiceYamlVo,
} from '@/types/kubernetes/network/service'

import { request } from '@/utils'

/**
 * 获取 Service 列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Service 列表
 */
export function getServiceList(
  clusterUid: string,
  namespaceName: string,
  params: Partial<ServiceQueryForm>,
): Promise<PageVo<ServiceListVo>> {
  return request.get<PageVo<ServiceListVo>>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services`, {
    params,
  })
}

/**
 * 获取 Service 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @returns Service 详情
 */
export function getServiceDetail(clusterUid: string, namespaceName: string, name: string): Promise<ServiceListVo> {
  return request.get<ServiceListVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 查看 Service YAML
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @returns Service 完整 YAML 文本
 */
export function getServiceYaml(clusterUid: string, namespaceName: string, name: string): Promise<ServiceYamlVo> {
  return request.get<ServiceYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/yaml`,
  )
}

/**
 * 获取 Service 事件列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getServiceEventList(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建 Service
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 Service ID
 */
export function createService(clusterUid: string, data: Partial<ServiceCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/services`, data)
}

/**
 * 通过 YAML 创建 Service
 * @param clusterUid - 集群 UID
 * @param yaml - Service YAML 文本
 */
export function createServiceYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/services/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Service
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 更新参数
 * @returns 更新的 Service ID
 */
export function updateService(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}`, data)
}

/**
 * 通过 YAML 更新 Service
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param yaml - Service YAML 文本
 */
export function updateServiceYaml(
  clusterUid: string,
  namespaceName: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Service 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 标签更新参数
 */
export function manageServiceLabel(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/labels`, data)
}

/**
 * 更新 Service 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 注解更新参数
 */
export function manageServiceAnnotation(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/annotations`,
    data,
  )
}

/**
 * 删除 Service
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 */
export function deleteService(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 批量删除 Service
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param uids - 待删除的 Service UID 列表
 */
export function deleteServices(clusterUid: string, namespaceName: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/batch`, {
    data: uids,
  })
}

/**
 * 导入 Service
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importService(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/services/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 Service
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 */
export function exportService(clusterUid: string, namespaceName: string, name: string): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespaceName}/services/${name}/export`)
}
