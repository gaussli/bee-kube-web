/**
 * StatefulSet 管理 API
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
  StatefulSetHistoryRevisionListVo,
  StatefulSetHistoryRevisionQueryForm,
  StatefulSetListVo,
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
 * 查看 StatefulSet 列表
 * @param clusterUid 集群 UID
 * @param params StatefulSet 查询条件请求对象（名称、命名空间、状态）
 * @returns StatefulSet 分页列表
 */
export function getStatefulSetList(clusterUid: string, params: Partial<StatefulSetQueryForm>) {
  return request.get<PageVo<StatefulSetListVo>>(`/kubernetes/clusters/${clusterUid}/statefulsets`, { params })
}

/**
 * 查看 StatefulSet 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 详情响应对象
 */
export function getStatefulSetDetail(clusterUid: string, namespace: string, name: string) {
  return request.get<StatefulSetDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`,
  )
}

/**
 * 查看 StatefulSet YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet YAML 响应对象（完整 YAML 文本）
 */
export function getStatefulSetYaml(clusterUid: string, namespace: string, name: string) {
  return request.get<StatefulSetYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/yaml`,
  )
}

/**
 * 查看 StatefulSet 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param params StatefulSet 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态）
 * @returns StatefulSet 关联 Pod 分页列表
 */
export function getStatefulSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<PodQueryForm>,
) {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/pods`,
    { params },
  )
}

/**
 * 查看 StatefulSet 历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param params StatefulSet 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns StatefulSet 历史版本分页列表
 */
export function getStatefulSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<StatefulSetHistoryRevisionQueryForm>,
) {
  return request.get<PageVo<StatefulSetHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/history`,
    { params },
  )
}

/**
 * 查看 StatefulSet 关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
export function getStatefulSetNetwork(clusterUid: string, namespace: string, name: string) {
  return request.get<StatefulSetNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/network`,
  )
}

/**
 * 查看 StatefulSet 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param params 事件查询条件请求对象
 * @returns StatefulSet 关联事件分页列表
 */
export function getStatefulSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<EventQueryForm>,
) {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/events`,
    { params },
  )
}

/**
 * 查看 StatefulSet 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 监控响应对象
 */
export function getStatefulSetMonitor(clusterUid: string, namespace: string, name: string) {
  return request.get<StatefulSetMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/monitor`,
  )
}

/**
 * 创建 StatefulSet
 * @param clusterUid 集群 UID
 * @param data StatefulSet 创建请求对象（description / metadata / spec）
 * @returns void
 */
export function createStatefulSet(clusterUid: string, data: Partial<StatefulSetCreateForm>) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/statefulsets`, data)
}

/**
 * YAML 创建 StatefulSet
 * @param clusterUid 集群 UID
 * @param yaml StatefulSet YAML 字符串
 * @returns void
 */
export function createStatefulSetYaml(clusterUid: string, yaml: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/statefulsets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 更新请求对象（description / metadata / spec）
 * @returns void
 */
export function updateStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`, data)
}

/**
 * YAML 更新 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param yaml StatefulSet YAML 字符串
 * @returns void
 */
export function updateStatefulSetYaml(clusterUid: string, namespace: string, name: string, yaml: string) {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 管理 StatefulSet 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
export function manageStatefulSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/labels`,
    data,
  )
}

/**
 * 管理 StatefulSet 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
export function manageStatefulSetAnnotation(
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
 * 删除 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
export function deleteStatefulSet(clusterUid: string, namespace: string, name: string) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}`)
}

/**
 * 批量删除 StatefulSet
 * @param clusterUid 集群 UID
 * @param uids StatefulSet UID 列表
 * @returns void
 */
export function deleteStatefulSets(clusterUid: string, uids: string[]) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/statefulsets`, { data: uids })
}

/**
 * 导入 StatefulSet
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
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
 * 导出 StatefulSet
 * @param clusterUid 集群 UID
 * @param params StatefulSet 查询条件请求对象（名称、命名空间、状态）
 * @returns void
 */
export function exportStatefulSet(clusterUid: string, params: Partial<StatefulSetQueryForm>) {
  return request.download(`/kubernetes/clusters/${clusterUid}/statefulsets/export`, { params })
}

/**
 * 扩缩容 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 扩缩容请求对象（期望副本数）
 * @returns void
 */
export function scaleStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetScaleForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/scale`,
    data,
  )
}

/**
 * 滚动更新分区 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 滚动更新分区请求对象（分区序号）
 * @returns void
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
 * 重启 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
export function restartStatefulSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/restart`)
}

/**
 * 回滚 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 回滚请求对象（目标历史版本号）
 * @returns void
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
 * 暂停 StatefulSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
export function pauseStatefulSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/pause`)
}

/**
 * 恢复 StatefulSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
export function resumeStatefulSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/statefulsets/${name}/resume`)
}
