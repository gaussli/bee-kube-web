/**
 * 守护进程集（DaemonSet）管理 API
 * @module api/kubernetes/workload/daemonset
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DaemonSetCreateForm,
  DaemonSetDetailVo,
  DaemonSetExportQueryForm,
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
 * 获取守护进程集（DaemonSet）YAML
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
 * 获取守护进程集（DaemonSet）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页后的容器组（Pod）列表
 */
export function getDaemonSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): Promise<PageVo<PodListVo>> {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/pods`,
    { params: query },
  )
}

/**
 * 获取守护进程集（DaemonSet）历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 历史版本查询条件
 * @returns 分页后的历史版本（History）列表
 */
export function getDaemonSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DaemonSetHistoryRevisionQueryForm>,
): Promise<PageVo<DaemonSetHistoryRevisionListVo>> {
  return request.get<PageVo<DaemonSetHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/history`,
    { params: query },
  )
}

/**
 * 获取守护进程集（DaemonSet）关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 关联网络资源数据
 */
export function getDaemonSetNetwork(clusterUid: string, namespace: string, name: string): Promise<DaemonSetNetworkVo> {
  return request.get<DaemonSetNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/network`,
  )
}

/**
 * 获取守护进程集（DaemonSet）事件（Event）列表
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
 * 创建守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createDaemonSet(clusterUid: string, data: Partial<DaemonSetCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/daemonsets`, data)
}

/**
 * 创建守护进程集（DaemonSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createDaemonSetYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/daemonsets/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 更新请求对象
 */
export function updateDaemonSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DaemonSetUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`, data)
}

/**
 * 更新守护进程集（DaemonSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param yaml - 更新 YAML 文本
 */
export function updateDaemonSetYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置守护进程集（DaemonSet）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 标签配置请求对象
 */
export function manageDaemonSetLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/labels`,
    data,
  )
}

/**
 * 配置守护进程集（DaemonSet）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 注解配置请求对象
 */
export function manageDaemonSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/annotations`,
    data,
  )
}

/**
 * 删除守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
export function deleteDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}`)
}

/**
 * 批量删除守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param uids - 守护进程集 UID 数组
 */
export function deleteDaemonSets(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/daemonsets`, { data: uids })
}

/**
 * 导入守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importDaemonSet(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/daemonsets/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportDaemonSet(clusterUid: string, query: Partial<DaemonSetExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/daemonsets/export`, { params: query })
}

/**
 * 重启守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
export function restartDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/restart`)
}

/**
 * 回滚守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 回滚请求对象
 */
export function rollbackDaemonSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DaemonSetRollbackForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/rollback`,
    data,
  )
}

/**
 * 暂停守护进程集（DaemonSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
export function pauseDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/pause`)
}

/**
 * 恢复守护进程集（DaemonSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
export function resumeDaemonSet(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/daemonsets/${name}/resume`)
}
