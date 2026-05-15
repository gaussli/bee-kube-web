/**
 * @fileOverview DaemonSet 资源管理 API
 */
import { request } from '@/utils'
import type { DaemonSetQueryReq, DaemonSetResp, DaemonSetReq, DaemonSetLabelsReq, DaemonSetAnnotationsReq, PageResp } from '@/types'

/**
 * 获取 DaemonSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 DaemonSet 列表
 */
export function getDaemonSetPage(clusterId: string, namespace: string, params: Partial<DaemonSetQueryReq>) {
  return request.get<PageResp<DaemonSetResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets`, {
    params: params
  })
}

/**
 * 获取 DaemonSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @returns DaemonSet 详情
 */
export function getDaemonSetDetail(clusterId: string, namespace: string, name: string) {
  return request.get<DaemonSetResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 创建 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 DaemonSet ID
 */
export function createDaemonSet(clusterId: string, namespace: string, data: Partial<DaemonSetReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets`, {
    data: data
  })
}

/**
 * 更新 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 更新参数
 * @returns 更新后的 DaemonSet ID
 */
export function updateDaemonSet(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/${name}`, {
    data: data
  })
}

/**
 * 更新 DaemonSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 标签数据
 */
export function manageDaemonSetLabels(clusterId: string, namespace: string, name: string, data: DaemonSetLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/${name}/labels`, { data: data })
}

/**
 * 更新 DaemonSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 注解数据
 */
export function manageDaemonSetAnnotations(clusterId: string, namespace: string, name: string, data: DaemonSetAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/${name}/annotations`, { data: data })
}

/**
 * 删除 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function deleteDaemonSet(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 批量删除 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - DaemonSet 名称数组
 */
export function deleteDaemonSets(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/daemonsets/batch`, {
    data: names
  })
}
