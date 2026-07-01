/**
 * Secret 资源管理 API
 * @module api/kubernetes/config/secret
 */
import type { PageVo } from '@/types/common'
import type { SecretAnnotationsReq, SecretDataReq, SecretDetailResp, SecretLabelsReq, SecretListResp, SecretQueryReq, SecretReq, SecretYamlReq } from '@/types/kubernetes/config/secret'
import { request } from '@/utils'

/**
 * 获取 Secret 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数（含 namespace 筛选）
 * @returns 分页后的 Secret 列表
 */
export function getSecretList(clusterId: string, params: Partial<SecretQueryReq>): Promise<PageVo<SecretListResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/secrets`, params)
}

/**
 * 获取 Secret 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
export function getSecretDetail(clusterId: string, namespace: string, name: string): Promise<SecretDetailResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 查看 Secret YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret YAML 配置
 */
export function getSecretYaml(clusterId: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/yaml`)
}

/**
 * 创建 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createSecret(clusterId: string, namespace: string, data: SecretReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets`, data)
}

/**
 * 更新 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新参数
 */
export function updateSecret(clusterId: string, namespace: string, name: string, data: Partial<SecretReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`, data)
}

/**
 * 更新 Secret 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签数据
 */
export function manageSecretLabels(clusterId: string, namespace: string, name: string, data: SecretLabelsReq): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/labels`, data)
}

/**
 * 更新 Secret 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解数据
 */
export function manageSecretAnnotations(clusterId: string, namespace: string, name: string, data: SecretAnnotationsReq): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/annotations`, data)
}

/**
 * 删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
export function deleteSecret(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 批量删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Secret 名称数组
 */
export function deleteSecrets(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/batch`, names)
}

/**
 * 导出 Secret CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
export function exportSecret(clusterId: string, params: Partial<SecretQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/secrets/export`, { params: params, responseType: 'blob' })
}

/**
 * 导入 Secret
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
export function importSecret(clusterId: string, data: SecretYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/secrets/import`, data)
}

/**
 * 更新 Secret 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 数据参数
 */
export function manageSecretData(clusterId: string, namespace: string, name: string, data: SecretDataReq): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/data`, data)
}
