/**
 * 无状态应用（StatefulSet）管理 API
 * @module api/kubernetes/workload/statefulset
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  StatefulSetCreateForm,
  StatefulSetDetailVo,
  StatefulSetExportQueryForm,
  StatefulSetHistoryRevisionListVo,
  StatefulSetHistoryRevisionQueryForm,
  StatefulSetListVo,
  StatefulSetMonitorQueryForm,
  StatefulSetMonitorVo,
  StatefulSetNetworkVo,
  StatefulSetPartitionForm,
  StatefulSetQueryForm,
  StatefulSetRollbackForm,
  StatefulSetScaleForm,
  StatefulSetUpdateForm,
  StatefulSetYamlVo,
} from '@/types/kubernetes/workload/statefulset'

import { request } from '@/utils'

/**
 * 获取无状态应用（StatefulSet）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的无状态应用列表
 */
export function getStatefulSetList(
  clusterUid: string,
  query: Partial<StatefulSetQueryForm>,
): Promise<PageVo<StatefulSetListVo>> {
  return request.get<PageVo<StatefulSetListVo>>(`/kubernetes/clusters/${clusterUid}/statefulsets`, { params: query })
}

/**
 * 获取无状态应用（StatefulSet）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 无状态应用详情
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
 * 获取无状态应用（StatefulSet）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 无状态应用 YAML
 */
export function getStatefulSetYaml(clusterUid: string, namespace: string, name: string): Promise<StatefulSetYamlVo> {
  return request.get<StatefulSetYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/yaml`,
  )
}

/**
 * 获取无状态应用（StatefulSet）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页后的容器组（Pod）列表
 */
export function getStatefulSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
) {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/pods`,
    { params: query },
  )
}

/**
 * 获取无状态应用（StatefulSet）历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 历史版本查询条件
 * @returns 分页后的历史版本（History）列表
 */
export function getStatefulSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetHistoryRevisionQueryForm>,
) {
  return request.get<PageVo<StatefulSetHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/history`,
    { params: query },
  )
}

/**
 * 获取无状态应用（StatefulSet）关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 关联网络资源数据
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
 * 获取无状态应用（StatefulSet）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getStatefulSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/events`,
    { params: query },
  )
}

/**
 * 获取无状态应用（StatefulSet）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 监控查询条件
 * @returns 无状态应用监控数据
 */
export function getStatefulSetMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetMonitorQueryForm>,
): Promise<StatefulSetMonitorVo> {
  return request.get<StatefulSetMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/monitor`,
    {
      params: query,
    },
  )
}

/**
 * 创建无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createStatefulSet(clusterUid: string, data: Partial<StatefulSetCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/statefulsets`, data)
}

/**
 * 创建无状态应用（StatefulSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createStatefulSetYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/statefulsets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 更新请求对象
 */
export function updateStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`, data)
}

/**
 * 更新无状态应用（StatefulSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param yaml - 更新 YAML 文本
 */
export function updateStatefulSetYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置无状态应用（StatefulSet）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 标签配置请求对象
 */
export function manageStatefulSetLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/labels`,
    data,
  )
}

/**
 * 配置无状态应用（statefulset）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 注解配置请求对象
 */
export function manageStatefulSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/annotations`,
    data,
  )
}

/**
 * 删除无状态应用（statefulset）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
export function deleteStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 批量删除无状态应用（statefulset）
 * @param clusterUid - 集群 UID
 * @param uids - 无状态应用 UID 数组
 */
export function deleteStatefulSets(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/statefulsets`, { data: uids })
}

/**
 * 导入无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importStatefulSet(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/statefulsets/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出无状态应用（statefulset）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportStatefulSet(clusterUid: string, query: Partial<StatefulSetExportQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/statefulsets/export`, { params: query })
}

/**
 * 扩缩容无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 扩缩容请求对象
 */
export function scaleStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetScaleForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/scale`,
    data,
  )
}

/**
 * 配置无状态应用（StatefulSet）滚动更新分区
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 滚动更新分区配置请求对象
 */
export function partitionStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetPartitionForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/partition`,
    data,
  )
}

/**
 * 重启无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
export function restartStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/restart`)
}

/**
 * 回滚无状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 回滚请求对象
 */
export function rollbackStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetRollbackForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/rollback`,
    data,
  )
}

/**
 * 暂停无状态应用（StatefulSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
export function pauseStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/pause`)
}

/**
 * 恢复无状态应用（StatefulSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
export function resumeStatefulSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/resume`)
}
