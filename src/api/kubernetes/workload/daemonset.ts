/**
 * DaemonSet 资源管理 API
 * @module api/kubernetes/workload/daemonset
 */
import type { PageVo } from '@/types/common'
import type {
  DaemonSetAnnotationsReq,
  DaemonSetDetailResp,
  DaemonSetLabelsReq,
  DaemonSetListResp,
  DaemonSetQueryReq,
  DaemonSetReq,
  DaemonSetYamlReq,
} from '@/types/kubernetes/workload/daemonset'

import { request } from '@/utils'

/**
 * 获取 DaemonSet 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 DaemonSet 列表
 */
export function getDaemonSetList(
  clusterUid: string,
  params: Partial<DaemonSetQueryReq>,
): Promise<PageVo<DaemonSetListResp>> {
  return request.get<PageVo<DaemonSetListResp>>(`/kubernetes/clusters/${clusterUid}/daemonsets`, { params })
}

/**
 * 获取 DaemonSet 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @returns DaemonSet 详情
 */
export function getDaemonSetDetail(clusterUid: string, namespace: string, name: string): Promise<DaemonSetDetailResp> {
  return request.get<DaemonSetDetailResp>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`,
  )
}

/**
 * 查看 DaemonSet YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @returns DaemonSet YAML 配置
 */
export function getDaemonSetYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/yaml`)
}

/**
 * 创建 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createDaemonSet(clusterUid: string, namespace: string, data: DaemonSetReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets`, data)
}

/**
 * 更新 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 更新参数
 */
export function updateDaemonSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DaemonSetReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`, data)
}

/**
 * 更新 DaemonSet 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 标签数据
 */
export function manageDaemonSetLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DaemonSetLabelsReq,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/labels`, data)
}

/**
 * 更新 DaemonSet 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 注解数据
 */
export function manageDaemonSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DaemonSetAnnotationsReq,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/annotations`, data)
}

/**
 * 删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function deleteDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 批量删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - DaemonSet 名称数组
 */
export function deleteDaemonSets(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/batch`, { data: names })
}

/**
 * 导出 DaemonSet CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportDaemonSet(clusterUid: string, params: Partial<DaemonSetQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/daemonsets/export`, {
    params,
    config: { responseType: 'blob' },
  })
}

/**
 * 导入 DaemonSet
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importDaemonSet(clusterUid: string, data: DaemonSetYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/daemonsets/import`, data)
}

/**
 * 重启 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function restartDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/restart`)
}
