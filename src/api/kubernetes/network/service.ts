/**
 * Service 资源 API
 * @module api/kubernetes/service
 */
import type { PageResp } from '@/types/common'
import type { ServiceListVo, ServiceQueryReq, ServiceReq, ServiceLabelsReq, ServiceAnnotationsReq } from '@/types/kubernetes/network/service'
import { request } from '@/utils'

/**
 * 获取 Service 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Service 列表
 */
export function getServicePage(clusterId: string, namespaceName: string, params: Partial<ServiceQueryReq>): Promise<PageResp<ServiceListVo>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services`, { params })
}

/**
 * 获取 Service 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @returns Service 详情
 */
export function getServiceDetail(clusterId: string, namespaceName: string, name: string): Promise<ServiceListVo> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 创建 Service
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 Service ID
 */
export function createService(clusterId: string, data: Partial<ServiceReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/services`, { data })
}

/**
 * 更新 Service
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 Service ID
 */
export function updateService(clusterId: string, data: Partial<ServiceReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/services/${data.name}`, { data })
}

/**
 * 更新 Service 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 标签更新参数
 */
export function manageServiceLabels(clusterId: string, namespaceName: string, name: string, data: Partial<ServiceLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}/labels`, { data })
}

/**
 * 更新 Service 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 注解更新参数
 */
export function manageServiceAnnotations(clusterId: string, namespaceName: string, name: string, data: Partial<ServiceAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}/annotations`, { data })
}

/**
 * 删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 */
export function deleteService(clusterId: string, namespaceName: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 批量删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Service 名称列表
 */
export function deleteServices(clusterId: string, namespaceName: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services`, { data: names })
}
