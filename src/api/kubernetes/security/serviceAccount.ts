/**
 * @fileOverview ServiceAccount 资源相关 API
 * @module api/kubernetes/serviceAccount
 */
import type { PageResp } from '@/types/common'
import type {
  ServiceAccountResp,
  ServiceAccountQueryReq,
  ServiceAccountReq,
  ServiceAccountLabelsReq,
  ServiceAccountAnnotationsReq,
  ServiceAccountImagePullSecretsReq
} from '@/types/kubernetes/serviceAccount'
import request from '@/utils/request'

/**
 * 获取 ServiceAccount 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns ServiceAccount 分页列表
 */
export function getServiceAccountPage(clusterId: string, params: ServiceAccountQueryReq) {
  return request.get<PageResp<ServiceAccountResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${params.id}/serviceaccounts`, {
    params
  })
}

/**
 * 获取 ServiceAccount 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @returns ServiceAccount 详情
 */
export function getServiceAccountDetail(clusterId: string, namespaceName: string, name: string) {
  return request.get<ServiceAccountResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}`)
}

/**
 * 创建 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ServiceAccount ID
 */
export function createServiceAccount(clusterId: string, data: ServiceAccountReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/serviceaccounts`, data)
}

/**
 * 更新 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ServiceAccount ID
 */
export function updateServiceAccount(clusterId: string, data: ServiceAccountReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/serviceaccounts/${data.name}`, data)
}

/**
 * 更新 ServiceAccount 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 标签更新参数
 */
export function manageServiceAccountLabels(clusterId: string, namespaceName: string, name: string, data: ServiceAccountLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/labels`, data)
}

/**
 * 更新 ServiceAccount 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 注解更新参数
 */
export function manageServiceAccountAnnotations(clusterId: string, namespaceName: string, name: string, data: ServiceAccountAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/annotations`, data)
}

/**
 * 更新 ServiceAccount 镜像拉取密钥
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 镜像拉取密钥更新参数
 */
export function manageServiceAccountImagePullSecrets(clusterId: string, namespaceName: string, name: string, data: ServiceAccountImagePullSecretsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/imagepullsecrets`, data)
}

/**
 * 删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 */
export function deleteServiceAccount(clusterId: string, namespaceName: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}`)
}

/**
 * 批量删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param data - 待删除的 ServiceAccount 名称列表
 */
export function deleteServiceAccounts(clusterId: string, namespaceName: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts`, {
    data
  })
}
