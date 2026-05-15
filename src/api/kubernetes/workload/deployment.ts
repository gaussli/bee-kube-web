/**
 * Deployment 资源管理 API
 * @module api/deployment
 */
import { request } from '@/utils'
import type { DeploymentQueryReq, DeploymentResp, DeploymentReq, DeploymentLabelsReq, DeploymentAnnotationsReq, DeploymentScaleReq, PageResp } from '@/types'

/**
 * 获取 Deployment 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Deployment 列表
 */
export function getDeploymentPage(clusterId: string, namespace: string, params: Partial<DeploymentQueryReq>) {
  return request.get<PageResp<DeploymentResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments`, {
    params: params
  })
}

/**
 * 获取 Deployment 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 详情
 */
export function getDeploymentDetail(clusterId: string, namespace: string, name: string) {
  return request.get<DeploymentResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 创建 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 Deployment ID
 */
export function createDeployment(clusterId: string, namespace: string, data: Partial<DeploymentReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments`, {
    data: data
  })
}

/**
 * 更新 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 更新参数
 * @returns 更新后的 Deployment ID
 */
export function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`, {
    data: data
  })
}

/**
 * 扩缩容 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
export function scaleDeployment(clusterId: string, namespace: string, name: string, data: DeploymentScaleReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/scale`, { data: data })
}

/**
 * 重启 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns 操作结果
 */
export function restartDeployment(clusterId: string, namespace: string, name: string) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/restart`)
}

/**
 * 回滚 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function rollbackDeployment(clusterId: string, namespace: string, name: string) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/rollback`)
}

/**
 * 更新 Deployment 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
export function manageDeploymentLabels(clusterId: string, namespace: string, name: string, data: DeploymentLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/labels`, { data: data })
}

/**
 * 更新 Deployment 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
export function manageDeploymentAnnotations(clusterId: string, namespace: string, name: string, data: DeploymentAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/annotations`, { data: data })
}

/**
 * 删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function deleteDeployment(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 批量删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Deployment 名称数组
 */
export function deleteDeployments(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/batch`, {
    data: names
  })
}
