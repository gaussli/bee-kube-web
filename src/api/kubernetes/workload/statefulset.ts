/**
 * StatefulSet 资源管理 API
 * @module api/kubernetes/workload/statefulset
 */
import type { PageResp } from '@/types/common'
import type {
  StatefulSetAnnotationsReq,
  StatefulSetDetailResp,
  StatefulSetLabelsReq,
  StatefulSetListResp,
  StatefulSetQueryReq,
  StatefulSetReq,
  StatefulSetScaleReq,
  StatefulSetYamlReq
} from '@/types/kubernetes/workload/statefulset'
import { request } from '@/utils'

/**
 * 获取 StatefulSet 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的 StatefulSet 列表
 */
export function getStatefulSetPage(clusterId: string, params: Partial<StatefulSetQueryReq>): Promise<PageResp<StatefulSetListResp>> {
  return request.get<PageResp<StatefulSetListResp>>(`/kubernetes/clusters/${clusterId}/statefulsets`, params)
}

/**
 * 获取 StatefulSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
export function getStatefulSetDetail(clusterId: string, namespace: string, name: string): Promise<StatefulSetDetailResp> {
  return request.get<StatefulSetDetailResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`)
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
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createStatefulSet(clusterId: string, namespace: string, data: StatefulSetReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets`, data)
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
export function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}`, data)
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
export function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: StatefulSetLabelsReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/labels`, data)
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
export function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: StatefulSetAnnotationsReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/annotations`, data)
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
 * 导出 StatefulSet CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
export function exportStatefulSet(clusterId: string, params: Partial<StatefulSetQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/statefulsets/export`, { params: params, responseType: 'blob' })
}

/**
 * 导入 StatefulSet
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
export function importStatefulSet(clusterId: string, data: StatefulSetYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/statefulsets/import`, data)
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
export function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: StatefulSetScaleReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/statefulsets/${name}/scale`, data)
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
