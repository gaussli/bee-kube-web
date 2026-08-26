import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceLimitRangeCreateForm,
  NamespaceLimitRangeDetailVo,
  NamespaceLimitRangeUpdateForm,
  NamespaceLimitRangeYamlVo,
} from '@/types/kubernetes/namespace/limitrange'

import { request } from '@/utils'

/**
 * 获取命名空间（Namespace）的限制范围（LimitRange）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @returns 命名空间限制范围详情
 */
export function getNamespaceLimitRangeDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NamespaceLimitRangeDetailVo> {
  return request.get<NamespaceLimitRangeDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}`,
  )
}

/**
 * 获取命名空间（Namespace）的限制范围（LimitRange）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @returns 命名空间限制范围 YAML
 */
export function getNamespaceLimitRangeYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NamespaceLimitRangeYamlVo> {
  return request.get<NamespaceLimitRangeYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}/yaml`,
  )
}

/**
 * 获取命名空间（Namespace）的限制范围（LimitRange）事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getNamespaceLimitRangeEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建命名空间（Namespace）的限制范围（LimitRange）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建请求对象
 */
export function createNamespaceLimitRange(
  clusterUid: string,
  namespace: string,
  data: Partial<NamespaceLimitRangeCreateForm>,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges`, data)
}

/**
 * 创建命名空间（Namespace）的限制范围（LimitRange）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param yaml - 创建 YAML 文本
 */
export function createNamespaceLimitRangeYaml(clusterUid: string, namespace: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新命名空间（Namespace）的限制范围（LimitRange）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @param data - 更新请求对象
 */
export function updateNamespaceLimitRange(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NamespaceLimitRangeUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}`, data)
}

/**
 * 更新命名空间（Namespace）的限制范围（LimitRange）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @param yaml - 更新 YAML 文本
 */
export function updateNamespaceLimitRangeYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置命名空间（Namespace）的限制范围（LimitRange）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @param data - 标签配置请求对象
 */
export function manageNamespaceLimitRangeLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}/labels`,
    data,
  )
}

/**
 * 配置命名空间（Namespace）的限制范围（LimitRange）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 * @param data - 注解配置请求对象
 */
export function manageNamespaceLimitRangeAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}/annotations`,
    data,
  )
}

/**
 * 删除命名空间（Namespace）的限制范围（LimitRange）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 限制范围名称
 */
export function deleteNamespaceLimitRange(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/limitranges/${name}`)
}
