/**
 * StatefulSet 资源管理 API
 * @module api/kubernetes/workload/statefulset
 */
import type { PageVo } from '@/types/common'
import type {
  StatefulSetAnnotationForm,
  StatefulSetCreateForm,
  StatefulSetDetailVo,
  StatefulSetEventListVo,
  StatefulSetHistoryRevisionListVo,
  StatefulSetMonitorVo,
  StatefulSetNetworkVo,
  StatefulSetPodListVo,
  StatefulSetStorageListVo,
  StatefulSetUpdateForm,
  StatefulSetLabelForm,
  StatefulSetListVo,
  StatefulSetQueryForm,
  StatefulSetScaleForm,
  StatefulSetScheduleVo,
  StatefulSetYamlForm,
} from '@/types/kubernetes/workload/statefulset'

import { request } from '@/utils'

/**
 * 获取 StatefulSet 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 StatefulSet 列表
 */
export function getStatefulSetList(
  clusterUid: string,
  params: Partial<StatefulSetQueryForm>,
): Promise<PageVo<StatefulSetListVo>> {
  return request.get<PageVo<StatefulSetListVo>>(`/kubernetes/clusters/${clusterUid}/statefulsets`, { params })
}

/**
 * 获取 StatefulSet 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
export function getStatefulSetDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetDetailVo> {
  return request.get<StatefulSetDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`,
  )
}

/**
 * 获取 StatefulSet Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet Pod 列表
 */
export function getStatefulSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetPodListVo[]> {
  return request.get<StatefulSetPodListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/pods`,
  )
}

/**
 * 获取 StatefulSet 调度策略
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 调度策略
 */
export function getStatefulSetSchedule(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetScheduleVo> {
  return request.get<StatefulSetScheduleVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/schedule`,
  )
}

/**
 * 获取 StatefulSet 历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 历史版本列表
 */
export function getStatefulSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetHistoryRevisionListVo[]> {
  return request.get<StatefulSetHistoryRevisionListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/history`,
  )
}

/**
 * 获取 StatefulSet 网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 网络资源
 */
export function getStatefulSetNetwork(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetNetworkVo> {
  return request.get<StatefulSetNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/network`,
  )
}

/**
 * 获取 StatefulSet 存储列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 存储列表
 */
export function getStatefulSetStorageList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetStorageListVo[]> {
  return request.get<StatefulSetStorageListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/storages`,
  )
}

/**
 * 获取 StatefulSet 监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 监控数据
 */
export function getStatefulSetMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetMonitorVo> {
  return request.get<StatefulSetMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/monitor`,
  )
}

/**
 * 获取 StatefulSet 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet 事件列表
 */
export function getStatefulSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<StatefulSetEventListVo[]> {
  return request.get<StatefulSetEventListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/events`,
  )
}

/**
 * 查看 StatefulSet YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @returns StatefulSet YAML 配置
 */
export function getStatefulSetYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/yaml`)
}

/**
 * 创建 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createStatefulSet(clusterUid: string, namespace: string, data: StatefulSetCreateForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets`, data)
}

/**
 * 更新 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
export function updateStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`, data)
}

/**
 * 更新 StatefulSet 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
export function manageStatefulSetLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/labels`, data)
}

/**
 * 更新 StatefulSet 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
export function manageStatefulSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/annotations`,
    data,
  )
}

/**
 * 删除 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function deleteStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 批量删除 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - StatefulSet 名称数组
 */
export function deleteStatefulSets(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/batch`, {
    data: names,
  })
}

/**
 * 导出 StatefulSet CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportStatefulSet(clusterUid: string, params: Partial<StatefulSetQueryForm>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/statefulsets/export`, {
    params,
    config: { responseType: 'blob' },
  })
}

/**
 * 导入 StatefulSet
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importStatefulSet(clusterUid: string, data: StatefulSetYamlForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/statefulsets/import`, data)
}

/**
 * 扩缩容 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
export function scaleStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetScaleForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/scale`, data)
}

/**
 * 重启 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function restartStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/restart`)
}

/**
 * 回滚 StatefulSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - StatefulSet 名称
 */
export function rollbackStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/rollback`)
}
