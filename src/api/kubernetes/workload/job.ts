/**
 * 任务（Job）管理 API
 * @module api/kubernetes/workload/job
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  JobCreateForm,
  JobDetailVo,
  JobExportQueryForm,
  JobListVo,
  JobMonitorQueryForm,
  JobMonitorVo,
  JobQueryForm,
  JobUpdateForm,
  JobYamlVo,
} from '@/types/kubernetes/workload/job'

import { request } from '@/utils'

/**
 * 获取任务（Job）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的任务列表
 */
export function getJobList(clusterUid: string, query: Partial<JobQueryForm>): Promise<PageVo<JobListVo>> {
  return request.get<PageVo<JobListVo>>(`/kubernetes/clusters/${clusterUid}/jobs`, { params: query })
}

/**
 * 获取任务（Job）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @returns 任务详情
 */
export function getJobDetail(clusterUid: string, namespace: string, name: string): Promise<JobDetailVo> {
  return request.get<JobDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 获取任务（Job）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @returns 任务 YAML
 */
export function getJobYaml(clusterUid: string, namespace: string, name: string): Promise<JobYamlVo> {
  return request.get<JobYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/yaml`)
}

/**
 * 获取任务（Job）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页的容器组（Pod）列表
 */
export function getJobPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): Promise<PageVo<PodListVo>> {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/pods`,
    { params: query },
  )
}

/**
 * 获取任务（Job）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getJobEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/events`,
    { params: query },
  )
}

/**
 * 获取任务（Job）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 监控查询条件
 * @returns 任务监控数据
 */
export function getJobMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<JobMonitorQueryForm>,
): Promise<JobMonitorVo> {
  return request.get<JobMonitorVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/monitor`, {
    params: query,
  })
}

/**
 * 创建任务（Job）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createJob(clusterUid: string, data: Partial<JobCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/jobs`, data)
}

/**
 * 创建任务（Job）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createJobYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/jobs/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新任务（Job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 更新请求对象
 */
export function updateJob(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<JobUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`, data)
}

/**
 * 更新任务（Job）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param yaml - 更新 YAML 文本
 */
export function updateJobYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置任务（Job）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 标签配置请求对象
 */
export function manageJobLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/labels`, data)
}

/**
 * 配置任务（job）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 注解配置请求对象
 */
export function manageJobAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/annotations`, data)
}

/**
 * 删除任务（job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
export function deleteJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 批量删除任务（job）
 * @param clusterUid - 集群 UID
 * @param uids - 任务 UID 数组
 */
export function deleteJobs(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/jobs`, { data: uids })
}

/**
 * 导入任务（Job）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importJob(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/jobs/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出任务（job）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportJob(clusterUid: string, query: Partial<JobExportQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/jobs/export`, { params: query })
}

/**
 * 手动重跑任务（Job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
export function rerunJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/rerun`)
}

/**
 * 暂停任务（Job）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
export function pauseJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/pause`)
}

/**
 * 恢复任务（Job）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
export function resumeJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/resume`)
}
