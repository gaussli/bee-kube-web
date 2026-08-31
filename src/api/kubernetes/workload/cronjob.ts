/**
 * 定时任务（CronJob）管理 API
 * @module api/kubernetes/workload/cronjob
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  CronJobCreateForm,
  CronJobDetailVo,
  CronJobExportQueryForm,
  CronJobJobListVo,
  CronJobJobQueryForm,
  CronJobListVo,
  CronJobMonitorQueryForm,
  CronJobMonitorVo,
  CronJobQueryForm,
  CronJobUpdateForm,
  CronJobYamlVo,
} from '@/types/kubernetes/workload/cronjob'

import { request } from '@/utils'

/**
 * 获取定时任务（CronJob）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的定时任务列表
 */
export function getCronJobList(clusterUid: string, query: Partial<CronJobQueryForm>): Promise<PageVo<CronJobListVo>> {
  return request.get<PageVo<CronJobListVo>>(`/kubernetes/clusters/${clusterUid}/cronjobs`, { params: query })
}

/**
 * 获取定时任务（CronJob）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @returns 定时任务详情
 */
export function getCronJobDetail(clusterUid: string, namespace: string, name: string): Promise<CronJobDetailVo> {
  return request.get<CronJobDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 获取定时任务（CronJob）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @returns 定时任务 YAML
 */
export function getCronJobYaml(clusterUid: string, namespace: string, name: string): Promise<CronJobYamlVo> {
  return request.get<CronJobYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/yaml`)
}

/**
 * 获取定时任务（CronJob）关联 Job 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 关联任务（Job）查询条件
 * @returns 分页后的任务（Job）列表
 */
export function getCronJobJobList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<CronJobJobQueryForm>,
): Promise<PageVo<CronJobJobListVo>> {
  return request.get<PageVo<CronJobJobListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/jobs`,
    { params: query },
  )
}

/**
 * 获取定时任务（CronJob）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getCronJobEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/events`,
    { params: query },
  )
}

/**
 * 获取定时任务（CronJob）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 监控查询条件
 * @returns 定时任务监控数据
 */
export function getCronJobMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<CronJobMonitorQueryForm>,
): Promise<CronJobMonitorVo> {
  return request.get<CronJobMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/monitor`,
    {
      params: query,
    },
  )
}

/**
 * 创建定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createCronJob(clusterUid: string, data: Partial<CronJobCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/cronjobs`, data)
}

/**
 * 创建定时任务（CronJob）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createCronJobYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/cronjobs/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 更新请求对象
 */
export function updateCronJob(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<CronJobUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`, data)
}

/**
 * 更新定时任务（CronJob）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param yaml - 更新 YAML 文本
 */
export function updateCronJobYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置定时任务（CronJob）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 标签配置请求对象
 */
export function manageCronJobLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/labels`, data)
}

/**
 * 配置定时任务（CronJob）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 注解配置请求对象
 */
export function manageCronJobAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/annotations`,
    data,
  )
}

/**
 * 删除定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
export function deleteCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 批量删除定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param uids - 定时任务 UID 数组
 */
export function deleteCronJobs(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/cronjobs`, { data: uids })
}

/**
 * 导入定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importCronJob(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/cronjobs/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportCronJob(clusterUid: string, query: Partial<CronJobExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/cronjobs/export`, { params: query })
}

/**
 * 立即触发定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
export function triggerCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/trigger`)
}

/**
 * 暂停更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
export function pauseCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/pause`)
}

/**
 * 恢复更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
export function resumeCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/resume`)
}
