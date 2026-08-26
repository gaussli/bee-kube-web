/**
 * 守护进程集（DaemonSet）管理 API
 * @module api/kubernetes/workload/daemonset
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DaemonSetCreateForm,
  DaemonSetDetailVo,
  DaemonSetHistoryRevisionListVo,
  DaemonSetHistoryRevisionQueryForm,
  DaemonSetListVo,
  DaemonSetMonitorQueryForm,
  DaemonSetMonitorVo,
  DaemonSetNetworkVo,
  DaemonSetQueryForm,
  DaemonSetRollbackForm,
  DaemonSetUpdateForm,
  DaemonSetYamlVo,
} from '@/types/kubernetes/workload/daemonset'

import { request } from '@/utils'

/**
 * 获取守护进程集（DaemonSet）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的守护进程集列表
 */
export function getDaemonSetList(
  clusterUid: string,
  query: Partial<DaemonSetQueryForm>,
): Promise<PageVo<DaemonSetListVo>> {
  return request.get<PageVo<DaemonSetListVo>>(`/kubernetes/clusters/${clusterUid}/daemonsets`, { params: query })
}

/**
 * 获取守护进程集（DaemonSet）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 守护进程集详情
 */
export function getDaemonSetDetail(clusterUid: string, namespace: string, name: string): Promise<DaemonSetDetailVo> {
  return request.get<DaemonSetDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 查看守护进程集（DaemonSet）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 守护进程集 YAML
 */
export function getDaemonSetYaml(clusterUid: string, namespace: string, name: string): Promise<DaemonSetYamlVo> {
  return request.get<DaemonSetYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/yaml`,
  )
}

/**
 * 查看 DaemonSet 关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param params - DaemonSet 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态）
 * @returns DaemonSet 关联 Pod 分页列表
 */
export function getDaemonSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<PodQueryForm>,
) {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/pods`,
    { params },
  )
}

/**
 * 查看 DaemonSet 历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param params - DaemonSet 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns DaemonSet 历史版本分页列表
 */
export function getDaemonSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<DaemonSetHistoryRevisionQueryForm>,
) {
  return request.get<PageVo<DaemonSetHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/history`,
    { params },
  )
}

/**
 * 查看 DaemonSet 关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @returns DaemonSet 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
export function getDaemonSetNetwork(clusterUid: string, namespace: string, name: string) {
  return request.get<DaemonSetNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/network`,
  )
}

/**
 * 获取守护进程集（DaemonSet）事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getDaemonSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/events`,
    { params: query },
  )
}

/**
 * 获取守护进程集（DaemonSet）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 监控查询条件
 * @returns 守护进程集监控数据
 */
export function getDaemonSetMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DaemonSetMonitorQueryForm>,
): Promise<DaemonSetMonitorVo> {
  return request.get<DaemonSetMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/monitor`,
    {
      params: query,
    },
  )
}

/**
 * 创建 DaemonSet
 * @param clusterUid - 集群 UID
 * @param data - DaemonSet 创建请求对象（description / metadata / spec）
 */
export function createDaemonSet(clusterUid: string, data: Partial<DaemonSetCreateForm>) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/daemonsets`, data)
}

/**
 * YAML 创建 DaemonSet
 * @param clusterUid - 集群 UID
 * @param yaml - DaemonSet YAML 字符串
 */
export function createDaemonSetYaml(clusterUid: string, yaml: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/daemonsets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - DaemonSet 更新请求对象（description / metadata / spec）
 */
export function updateDaemonSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DaemonSetUpdateForm>,
) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`, data)
}

/**
 * YAML 更新 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param yaml - DaemonSet YAML 字符串
 */
export function updateDaemonSetYaml(clusterUid: string, namespace: string, name: string, yaml: string) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 管理 DaemonSet 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 管理标签请求对象（labels 键值对、operation 操作类型）
 */
export function manageDaemonSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/labels`,
    data,
  )
}

/**
 * 管理 DaemonSet 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - 管理注解请求对象（annotations 键值对、operation 操作类型）
 */
export function manageDaemonSetAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/annotations`,
    data,
  )
}

/**
 * 删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function deleteDaemonSet(clusterUid: string, namespace: string, name: string) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 批量删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param uids - DaemonSet UID 列表
 */
export function deleteDaemonSets(clusterUid: string, uids: string[]) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/daemonsets`, { data: uids })
}

/**
 * 导入 DaemonSet
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importDaemonSet(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/daemonsets/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 DaemonSet
 * @param clusterUid - 集群 UID
 * @param params - DaemonSet 查询条件请求对象（名称、命名空间、状态）
 */
export function exportDaemonSet(clusterUid: string, params: Partial<DaemonSetQueryForm>) {
  return request.download(`/kubernetes/clusters/${clusterUid}/daemonsets/export`, { params })
}

/**
 * 重启 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function restartDaemonSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/restart`)
}

/**
 * 回滚 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 * @param data - DaemonSet 回滚请求对象（目标历史版本号）
 */
export function rollbackDaemonSet(clusterUid: string, namespace: string, name: string, data: DaemonSetRollbackForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/rollback`,
    data,
  )
}

/**
 * 暂停 DaemonSet 更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function pauseDaemonSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/pause`)
}

/**
 * 恢复 DaemonSet 更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - DaemonSet 名称
 */
export function resumeDaemonSet(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/resume`)
}
