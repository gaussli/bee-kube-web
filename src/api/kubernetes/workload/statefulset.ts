/**
 * @fileOverview StatefulSet 资源管理 API
 */
import { request } from '@/utils'
import type { StatefulSetQueryReq, StatefulSetResp, StatefulSetReq, StatefulSetLabelsReq, StatefulSetAnnotationsReq, StatefulSetScaleReq, PageResp } from '@/types'

/**
 * 获取 StatefulSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 StatefulSet 列表
 */
export function getStatefulSetPage(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>) {
  return request.get<PageResp<StatefulSetResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets`, {
    params: params
  })
}

/**
 * 获取 StatefulSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
export function getStatefulSetDetail(clusterId: string, namespace: string, name: string) {
  return request.get<StatefulSetResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 StatefulSet ID
 */
export function createStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets`, {
    data: data
  })
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 * @returns 更新后的 StatefulSet ID
 */
export function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`, {
    data: data
  })
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
export function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: StatefulSetScaleReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/scale`, { data: data })
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
export function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: StatefulSetLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/labels`, { data: data })
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
export function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: StatefulSetAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/annotations`, { data: data })
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function deleteStatefulSet(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - StatefulSet 名称数组
 */
export function deleteStatefulSets(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/batch`, {
    data: names
  })
}
