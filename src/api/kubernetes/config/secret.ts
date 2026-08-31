/**
 * 密钥（Secret）管理 API
 * @module api/kubernetes/config/secret
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type {
  SecretCreateForm,
  SecretDetailVo,
  SecretExportQueryForm,
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
 * 获取密钥（Secret）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @returns 密钥详情
 */
export function getSecretDetail(clusterUid: string, namespace: string, name: string): Promise<SecretDetailVo> {
  return request.get<SecretDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 获取密钥（Secret）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @returns 密钥 YAML
 */
export function getSecretYaml(clusterUid: string, namespace: string, name: string): Promise<SecretYamlVo> {
  return request.get<SecretYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/yaml`)
}

/**
 * 获取密钥（Secret）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
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
 * 创建密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createSecret(clusterUid: string, data: Partial<SecretCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/secrets`, data)
}

/**
 * 创建密钥（Secret）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createSecretYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/secrets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 更新请求对象
 */
export function updateSecret(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<SecretUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`, data)
}

/**
 * 更新密钥（Secret）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param yaml - 更新 YAML 文本
 */
export function updateSecretYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置密钥（Secret）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 标签配置请求对象
 */
export function manageSecretLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/labels`, data)
}

/**
 * 配置密钥（Secret）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 注解配置请求对象
 */
export function manageSecretAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}/annotations`,
    data,
  )
}

/**
 * 删除密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 */
export function deleteSecret(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 批量删除密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param uids - 密钥 UID 数组
 */
export function deleteSecrets(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/secrets`, { data: uids })
}

/**
 * 导入密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importSecret(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/secrets/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportSecret(clusterUid: string, query: Partial<SecretExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/secrets/export`, { params: query })
}
