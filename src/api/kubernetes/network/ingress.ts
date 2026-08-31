/**
 * 入口（Ingress）管理 API
 * @module api/kubernetes/ingress
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  IngressCreateForm,
  IngressDetailVo,
  IngressExportQueryForm,
  IngressListVo,
  IngressQueryForm,
  IngressUpdateForm,
  IngressYamlVo,
} from '@/types/kubernetes/network/ingress'

import { request } from '@/utils'

/**
 * 获取入口（Ingress）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的入口列表
 */
export function getIngressList(clusterUid: string, query: Partial<IngressQueryForm>): Promise<PageVo<IngressListVo>> {
  return request.get<PageVo<IngressListVo>>(`/kubernetes/clusters/${clusterUid}/ingresses`, {
    params: query,
  })
}

/**
 * 获取入口（Ingress）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @returns 入口详情
 */
export function getIngressDetail(clusterUid: string, namespace: string, name: string): Promise<IngressDetailVo> {
  return request.get<IngressDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`)
}

/**
 * 获取入口（Ingress）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @returns 入口 YAML
 */
export function getIngressYaml(clusterUid: string, namespace: string, name: string): Promise<IngressYamlVo> {
  return request.get<IngressYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/yaml`)
}

/**
 * 获取入口（Ingress）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getIngressEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createIngress(clusterUid: string, data: Partial<IngressCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/ingresses`, data)
}

/**
 * 创建入口（Ingress）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createIngressYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/ingresses/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 更新请求对象
 */
export function updateIngress(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<IngressUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`, data)
}

/**
 * 更新入口（Ingress）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param yaml - 更新 YAML 文本
 */
export function updateIngressYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置入口（Ingress）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 标签配置请求对象
 */
export function manageIngressLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/labels`, data)
}

/**
 * 配置入口（Ingress）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 注解配置请求对象
 */
export function manageIngressAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/annotations`,
    data,
  )
}

/**
 * 删除入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 */
export function deleteIngress(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`)
}

/**
 * 批量删除入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param uids - 入口 UID 数组
 */
export function deleteIngresses(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/ingresses`, {
    data: uids,
  })
}

/**
 * 导入入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importIngress(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/ingresses/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportIngress(clusterUid: string, query: Partial<IngressExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/ingresses/export`, { params: query })
}
