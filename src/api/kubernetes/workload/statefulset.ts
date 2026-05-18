/**
 * StatefulSet 资源管理 API
 * @module api/kubernetes/workload/statefulset
 */
import type { PageResp } from '@/types/common'
import type {
  StatefulSetQueryReq,
  StatefulSetResp,
  StatefulSetReq,
  StatefulSetLabelsReq,
  StatefulSetAnnotationsReq,
  StatefulSetScaleReq,
  StatefulSetYamlReq
} from '@/types/kubernetes/workload/statefulset'
import { request } from '@/utils'

/**
 * 获取 StatefulSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 StatefulSet 列表
 */
export function getStatefulSetPage(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>): Promise<PageResp<StatefulSetResp>> {
  return request.get<PageResp<StatefulSetResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets`, { params: params })
}

/**
 * 获取 StatefulSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
export function getStatefulSetDetail(clusterId: string, namespace: string, name: string): Promise<StatefulSetResp> {
  return request.get<StatefulSetResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets`, { data: data })
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
export function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`, { data: data })
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
export function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetScaleReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/scale`, { data: data })
}

/**
 * 重启 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function restartStatefulSet(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/restart`)
}

/**
 * 回滚 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function rollbackStatefulSet(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/rollback`)
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
export function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/labels`, { data: data })
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
export function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetAnnotationsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/annotations`, { data: data })
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function deleteStatefulSet(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - StatefulSet 名称数组
 */
export function deleteStatefulSets(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/batch`, { data: names })
}

/**
 * 查看 StatefulSet YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet YAML 配置
 */
export function getStatefulSetYaml(clusterId: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/yaml`)
}

/**
 * 导出 StatefulSet CSV
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 */
export function exportStatefulSet(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/export`, { params: params, responseType: 'blob' })
}

/**
 * 导入 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - YAML 配置
 */
export function importStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetYamlReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/import`, { data: data })
}
