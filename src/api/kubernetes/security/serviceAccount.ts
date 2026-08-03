/**
 * ServiceAccount 资源 API
 * @module api/kubernetes/serviceAccount
 */
import type { PageVo } from '@/types/common'
import type {
  ServiceAccountResp,
  ServiceAccountQueryReq,
  ServiceAccountReq,
  ServiceAccountLabelsReq,
  ServiceAccountAnnotationsReq,
  ServiceAccountImagePullSecretsReq
} from '@/types/kubernetes/security/serviceAccount'
import { request } from '@/utils'

/**
 * 获取 ServiceAccount 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 ServiceAccount 列表
 */
export function getServiceAccountPage(
  clusterId: string,
  namespaceName: string,
  params: Partial<ServiceAccountQueryReq>
): Promise<PageVo<ServiceAccountResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts`, { params })
}

/**
 * 获取 ServiceAccount 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @returns ServiceAccount 详情
 */
export function getServiceAccountDetail(
  clusterId: string,
  namespaceName: string,
  name: string
): Promise<ServiceAccountResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}`)
}

/**
 * 创建 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 ServiceAccount ID
 */
export function createServiceAccount(clusterId: string, data: Partial<ServiceAccountReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/serviceaccounts`, { data })
}

/**
 * 更新 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 ServiceAccount ID
 */
export function updateServiceAccount(clusterId: string, data: Partial<ServiceAccountReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/serviceaccounts/${data.name}`, {
    data
  })
}

/**
 * 更新 ServiceAccount 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 标签更新参数
 */
export function manageServiceAccountLabels(
  clusterId: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceAccountLabelsReq>
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/labels`, {
    data
  })
}

/**
 * 更新 ServiceAccount 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 注解更新参数
 */
export function manageServiceAccountAnnotations(
  clusterId: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceAccountAnnotationsReq>
): Promise<void> {
  return request.put(
    `/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/annotations`,
    { data }
  )
}

/**
 * 更新 ServiceAccount 镜像拉取密钥
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 镜像拉取密钥更新参数
 */
export function manageServiceAccountImagePullSecrets(
  clusterId: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceAccountImagePullSecretsReq>
): Promise<void> {
  return request.put(
    `/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}/imagepullsecrets`,
    { data }
  )
}

/**
 * 删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 */
export function deleteServiceAccount(clusterId: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts/${name}`)
}

/**
 * 批量删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 ServiceAccount 名称列表
 */
export function deleteServiceAccounts(clusterId: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/serviceaccounts`, {
    data: names
  })
}
