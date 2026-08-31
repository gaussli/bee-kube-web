/**
 * 网络策略（NetworkPolicy）管理 API
 * @module api/kubernetes/networkpolicy
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NetworkPolicyCreateForm,
  NetworkPolicyDetailVo,
  NetworkPolicyExportQueryForm,
  NetworkPolicyListVo,
  NetworkPolicyQueryForm,
  NetworkPolicyUpdateForm,
  NetworkPolicyYamlVo,
} from '@/types/kubernetes/network/networkpolicy'

import { request } from '@/utils'

/**
 * 获取网络策略（NetworkPolicy）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的网络策略列表
 */
export function getNetworkPolicyList(
  clusterUid: string,
  query: Partial<NetworkPolicyQueryForm>,
): Promise<PageVo<NetworkPolicyListVo>> {
  return request.get<PageVo<NetworkPolicyListVo>>(`/kubernetes/clusters/${clusterUid}/networkpolicies`, {
    params: query,
  })
}

/**
 * 获取网络策略（NetworkPolicy）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @returns 网络策略详情
 */
export function getNetworkPolicyDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NetworkPolicyDetailVo> {
  return request.get<NetworkPolicyDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}`,
  )
}

/**
 * 获取网络策略（NetworkPolicy）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @returns 网络策略 YAML
 */
export function getNetworkPolicyYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<NetworkPolicyYamlVo> {
  return request.get<NetworkPolicyYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/yaml`,
  )
}

/**
 * 获取网络策略（NetworkPolicy）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getNetworkPolicyEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createNetworkPolicy(clusterUid: string, data: Partial<NetworkPolicyCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies`, data)
}

/**
 * 创建网络策略（NetworkPolicy）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createNetworkPolicyYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 更新请求对象
 */
export function updateNetworkPolicy(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NetworkPolicyUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}`, data)
}

/**
 * 更新网络策略（NetworkPolicy）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param yaml - 更新 YAML 文本
 */
export function updateNetworkPolicyYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置网络策略（NetworkPolicy）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 标签配置请求对象
 */
export function manageNetworkPolicyLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/labels`,
    data,
  )
}

/**
 * 配置网络策略（NetworkPolicy）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 注解配置请求对象
 */
export function manageNetworkPolicyAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/annotations`,
    data,
  )
}

/**
 * 删除网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 */
export function deleteNetworkPolicy(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}`)
}

/**
 * 批量删除网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param uids - 网络策略 UID 数组
 */
export function deleteNetworkPolicies(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies`, {
    data: uids,
  })
}

/**
 * 导入网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importNetworkPolicy(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportNetworkPolicy(clusterUid: string, query: Partial<NetworkPolicyExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies/export`, { params: query })
}
