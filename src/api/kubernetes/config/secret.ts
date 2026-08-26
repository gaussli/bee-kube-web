/**
 * 密钥（Secret）管理 API
 * @module api/kubernetes/config/secret
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  SecretCreateForm,
  SecretDetailVo,
  SecretListVo,
  SecretQueryForm,
  SecretUpdateForm,
  SecretYamlVo,
} from '@/types/kubernetes/config/secret'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取密钥（Secret）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的密钥列表
 */
export function getSecretList(clusterUid: string, query: Partial<SecretQueryForm>): Promise<PageVo<SecretListVo>> {
  return request.get<PageVo<SecretListVo>>(`/kubernetes/clusters/${clusterUid}/secrets`, { params: query })
}

/**
 * 获取 Secret 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
export function getSecretDetail(clusterUid: string, namespace: string, name: string): Promise<SecretDetailVo> {
  return request.get<SecretDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 查看 Secret YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret YAML 配置
 */
export function getSecretYaml(clusterUid: string, namespace: string, name: string): Promise<SecretYamlVo> {
  return request.get<SecretYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/yaml`)
}

/**
 * 获取 Secret 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getSecretEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createSecret(clusterUid: string, namespace: string, data: Partial<SecretCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets`, data)
}

/**
 * 创建 Secret（YAML 方式）
 * @param clusterUid - 集群 UID
 * @param yaml - Secret YAML 文本
 */
export function createSecretYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/secrets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新参数
 */
export function updateSecret(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<SecretUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`, data)
}

/**
 * 通过 YAML 更新 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param yaml - Secret YAML 文本
 */
export function updateSecretYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Secret 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签更新参数
 */
export function manageSecretLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/labels`, data)
}

/**
 * 更新 Secret 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解更新参数
 */
export function manageSecretAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/annotations`, data)
}

/**
 * 删除 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
export function deleteSecret(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 批量删除 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - Secret UID 数组
 */
export function deleteSecrets(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets`, { data: uids })
}

/**
 * 导入 Secret
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importSecret(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/secrets/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 Secret CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportSecret(clusterUid: string, params: Partial<SecretQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/secrets/export`, { params })
}
