/**
 * 资源配额（ResourceQuota）管理 API
 * @module api/kubernetes/namespace/resourcequota
 */

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceResourceQuotaCreateForm,
  NamespaceResourceQuotaDetailVo,
  NamespaceResourceQuotaUpdateForm,
  NamespaceResourceQuotaYamlVo,
} from '@/types/kubernetes/namespace/resourcequota'

import { request } from '@/utils'

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @returns 命名空间资源配额详情
 */
export function getNamespaceResourceQuotaDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NamespaceResourceQuotaDetailVo> {
  return request.get<NamespaceResourceQuotaDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}`,
  )
}

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @returns 命名空间资源配额 YAML
 */
export function getNamespaceResourceQuotaYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NamespaceResourceQuotaYamlVo> {
  return request.get<NamespaceResourceQuotaYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}/yaml`,
  )
}

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getNamespaceResourceQuotaEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createNamespaceResourceQuota(
  clusterUid: string,
  data: Partial<NamespaceResourceQuotaCreateForm>,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/resourcequotas`, data)
}

/**
 * 创建命名空间（Namespace）的资源配额（ResourceQuota）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createNamespaceResourceQuotaYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/resourcequotas/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 更新请求对象
 */
export function updateNamespaceResourceQuota(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NamespaceResourceQuotaUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}`, data)
}

/**
 * 更新命名空间（Namespace）的资源配额（ResourceQuota）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param yaml - 更新 YAML 文本
 */
export function updateNamespaceResourceQuotaYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置命名空间（Namespace）的资源配额（ResourceQuota）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 标签配置请求对象
 */
export function manageNamespaceResourceQuotaLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}/labels`,
    data,
  )
}

/**
 * 配置命名空间（Namespace）的资源配额（ResourceQuota）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 注解配置请求对象
 */
export function manageNamespaceResourceQuotaAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}/annotations`,
    data,
  )
}

/**
 * 删除命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 */
export function deleteNamespaceResourceQuota(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/resourcequotas/${name}`)
}
