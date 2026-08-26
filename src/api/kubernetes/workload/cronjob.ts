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
  CronJobJobListVo,
  CronJobJobQueryForm,
  CronJobListVo,
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
 * 查看 CronJob 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob 详情响应对象
 */
export function getCronJobDetail(clusterUid: string, namespace: string, name: string) {
  return request.get<CronJobDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 查看 CronJob YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob YAML 响应对象（完整 YAML 文本）
 */
export function getCronJobYaml(clusterUid: string, namespace: string, name: string) {
  return request.get<CronJobYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/yaml`)
}

/**
 * 查看 CronJob 关联 Job 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param params CronJob 关联 Job 查询条件请求对象（Job 名称、Job 状态）
 * @returns CronJob 关联 Job 分页列表
 */
export function getCronJobJobList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<CronJobJobQueryForm>,
) {
  return request.get<PageVo<CronJobJobListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/jobs`,
    { params },
  )
}

/**
 * 查看 CronJob 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param params 事件查询条件请求对象
 * @returns CronJob 关联事件分页列表
 */
export function getCronJobEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<EventQueryForm>,
) {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/events`,
    { params },
  )
}

/**
 * 查看 CronJob 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob 监控响应对象
 */
export function getCronJobMonitor(clusterUid: string, namespace: string, name: string) {
  return request.get<CronJobMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/monitor`,
  )
}

/**
 * 创建 CronJob
 * @param clusterUid 集群 UID
 * @param data CronJob 创建请求对象（description / metadata / spec）
 */
export function createCronJob(clusterUid: string, data: Partial<CronJobCreateForm>) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/cronjobs`, data)
}

/**
 * YAML 创建 CronJob
 * @param clusterUid 集群 UID
 * @param yaml CronJob YAML 字符串
 */
export function createCronJobYaml(clusterUid: string, yaml: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/cronjobs/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data CronJob 更新请求对象（description / metadata / spec）
 */
export function updateCronJob(clusterUid: string, namespace: string, name: string, data: Partial<CronJobUpdateForm>) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`, data)
}

/**
 * YAML 更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param yaml CronJob YAML 字符串
 */
export function updateCronJobYaml(clusterUid: string, namespace: string, name: string, yaml: string) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 管理 CronJob 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 */
export function manageCronJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/labels`, data)
}

/**
 * 管理 CronJob 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 */
export function manageCronJobAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/annotations`,
    data,
  )
}

/**
 * 删除 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 */
export function deleteCronJob(clusterUid: string, namespace: string, name: string) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 批量删除 CronJob
 * @param clusterUid 集群 UID
 * @param uids CronJob UID 列表
 */
export function deleteCronJobs(clusterUid: string, uids: string[]) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/cronjobs`, { data: uids })
}

/**
 * 导入 CronJob
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 */
export function importCronJob(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/cronjobs/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 CronJob
 * @param clusterUid 集群 UID
 * @param params CronJob 查询条件请求对象（名称、命名空间、状态）
 */
export function exportCronJob(clusterUid: string, params: Partial<CronJobQueryForm>) {
  return request.download(`/kubernetes/clusters/${clusterUid}/cronjobs/export`, { params })
}

/**
 * 立即触发 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 */
export function triggerCronJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/trigger`)
}

/**
 * 暂停更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 */
export function pauseCronJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/pause`)
}

/**
 * 恢复更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 */
export function resumeCronJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/resume`)
}
