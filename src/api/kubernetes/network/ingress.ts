/**
 * 路由（Ingress）管理 API
 * @module api/kubernetes/ingress
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  IngressCreateForm,
  IngressDetailVo,
  IngressListVo,
  IngressQueryForm,
  IngressUpdateForm,
  IngressYamlVo,
} from '@/types/kubernetes/network/ingress'

import { request } from '@/utils'

/**
 * 获取路由（Ingress）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的路由列表
 */
export function getIngressList(clusterUid: string, query: Partial<IngressQueryForm>): Promise<PageVo<IngressListVo>> {
  return request.get<PageVo<IngressListVo>>(`/kubernetes/clusters/${clusterUid}/ingresses`, {
    params: query,
  })
}

/**
 * 获取路由（Ingress）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 路由名称
 * @returns 路由详情
 */
export function getIngressDetail(clusterUid: string, namespace: string, name: string): Promise<IngressDetailVo> {
  return request.get<IngressDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`)
}

/**
 * 查看路由（Ingress）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 路由名称
 * @returns 路由 YAML
 */
export function getIngressYaml(clusterUid: string, namespace: string, name: string): Promise<IngressYamlVo> {
  return request.get<IngressYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/yaml`)
}

/**
 * 获取 Ingress 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
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
 * 创建 Ingress
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 Ingress ID
 */
export function createIngress(clusterUid: string, data: Partial<IngressCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/ingresses`, data)
}

/**
 * 通过 YAML 创建 Ingress
 * @param clusterUid - 集群 UID
 * @param yaml - Ingress YAML 文本
 */
export function createIngressYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/ingresses/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Ingress
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 更新参数
 * @returns 更新的 Ingress ID
 */
export function updateIngress(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<IngressUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`, data)
}

/**
 * 通过 YAML 更新 Ingress
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 * @param yaml - Ingress YAML 文本
 */
export function updateIngressYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Ingress 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 标签更新参数
 */
export function manageIngressLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/labels`, data)
}

/**
 * 更新 Ingress 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 * @param data - 注解更新参数
 */
export function manageIngressAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/annotations`, data)
}

/**
 * 删除 Ingress
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 */
export function deleteIngress(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}`)
}

/**
 * 批量删除 Ingress
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 Ingress UID 列表
 */
export function deleteIngresses(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses`, {
    data: uids,
  })
}

/**
 * 导入 Ingress
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importIngress(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/ingresses/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 Ingress
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Ingress 名称
 */
export function exportIngress(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/ingresses/${name}/export`)
}
