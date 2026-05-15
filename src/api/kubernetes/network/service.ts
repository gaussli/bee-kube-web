/**
 * @fileOverview Service 资源相关 API
 * @module api/kubernetes/service
 */
import request from '@/utils/request'
import type { PageResp } from '@/types/common'
import type {
  ServiceResp,
  ServiceQueryReq,
  ServiceReq,
  ServiceLabelsReq,
  ServiceAnnotationsReq
} from '@/types/kubernetes/service'

/**
 * 获取 Service 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns Service 分页列表
 */
export function getServicePage(clusterId: string, params: ServiceQueryReq) {
  return request.get<PageResp<ServiceResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${params.id}/services`, {
    params
  })
}

/**
 * 获取 Service 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @returns Service 详情
 */
export function getServiceDetail(clusterId: string, namespaceName: string, name: string) {
  return request.get<ServiceResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 创建 Service
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 * @returns 创建的 Service ID
 */
export function createService(clusterId: string, data: ServiceReq) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/services`, data)
}

/**
 * 更新 Service
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 * @returns 更新的 Service ID
 */
export function updateService(clusterId: string, data: ServiceReq) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${data.namespace}/services/${data.name}`, data)
}

/**
 * 更新 Service 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 标签更新参数
 */
export function manageServiceLabels(clusterId: string, namespaceName: string, name: string, data: ServiceLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}/labels`, data)
}

/**
 * 更新 Service 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param data - 注解更新参数
 */
export function manageServiceAnnotations(clusterId: string, namespaceName: string, name: string, data: ServiceAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}/annotations`, data)
}

/**
 * 删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 */
export function deleteService(clusterId: string, namespaceName: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services/${name}`)
}

/**
 * 批量删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param data - 待删除的 Service 名称列表
 */
export function deleteServices(clusterId: string, namespaceName: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespaceName}/services`, {
    data
  })
}
