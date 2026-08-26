/**
 * 网络策略（NetworkPolicy）管理 API
 * @module api/kubernetes/networkpolicy
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NetworkPolicyCreateForm,
  NetworkPolicyDetailVo,
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
 * 查看网络策略（NetworkPolicy）YAML
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
 * 获取 NetworkPolicy 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
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
 * 创建 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 NetworkPolicy ID
 */
export function createNetworkPolicy(clusterUid: string, data: Partial<NetworkPolicyCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/networkpolicies`, data)
}

/**
 * 通过 YAML 创建 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param yaml - NetworkPolicy YAML 文本
 */
export function createNetworkPolicyYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/networkpolicies/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 更新参数
 * @returns 更新的 NetworkPolicy ID
 */
export function updateNetworkPolicy(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NetworkPolicyUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}`, data)
}

/**
 * 通过 YAML 更新 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param yaml - NetworkPolicy YAML 文本
 */
export function updateNetworkPolicyYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 NetworkPolicy 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 标签更新参数
 */
export function manageNetworkPolicyLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/labels`, data)
}

/**
 * 更新 NetworkPolicy 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param data - 注解更新参数
 */
export function manageNetworkPolicyAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/annotations`,
    data,
  )
}

/**
 * 删除 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 */
export function deleteNetworkPolicy(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}`)
}

/**
 * 批量删除 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 NetworkPolicy UID 列表
 */
export function deleteNetworkPolicies(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies`, {
    data: uids,
  })
}

/**
 * 导入 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importNetworkPolicy(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/networkpolicies/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 NetworkPolicy
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - NetworkPolicy 名称
 */
export function exportNetworkPolicy(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/networkpolicies/${name}/export`)
}
