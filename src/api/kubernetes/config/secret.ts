/**
 * @fileOverview Secret 资源管理 API
 */
import { request } from '@/utils'
import type { SecretQueryReq, SecretResp, SecretReq, SecretDataReq, SecretLabelsReq, SecretAnnotationsReq, PageResp } from '@/types'

/**
 * 获取 Secret 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Secret 列表
 */
export function getSecretPage(clusterId: string, namespace: string, params: Partial<SecretQueryReq>) {
  return request.get<PageResp<SecretResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets`, {
    params: params
  })
}

/**
 * 获取 Secret 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
export function getSecretDetail(clusterId: string, namespace: string, name: string) {
  return request.get<SecretResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 创建 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 Secret ID
 */
export function createSecret(clusterId: string, namespace: string, data: Partial<SecretReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets`, {
    data: data
  })
}

/**
 * 更新 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新参数
 * @returns 更新后的 Secret ID
 */
export function updateSecret(clusterId: string, namespace: string, name: string, data: Partial<SecretReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`, {
    data: data
  })
}

/**
 * 更新 Secret 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 数据参数
 */
export function manageSecretData(clusterId: string, namespace: string, name: string, data: SecretDataReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/data`, { data: data })
}

/**
 * 更新 Secret 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签数据
 */
export function manageSecretLabels(clusterId: string, namespace: string, name: string, data: SecretLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/labels`, { data: data })
}

/**
 * 更新 Secret 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解数据
 */
export function manageSecretAnnotations(clusterId: string, namespace: string, name: string, data: SecretAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}/annotations`, { data: data })
}

/**
 * 删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
export function deleteSecret(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/${name}`)
}

/**
 * 批量删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Secret 名称数组
 */
export function deleteSecrets(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/secrets/batch`, {
    data: names
  })
}
