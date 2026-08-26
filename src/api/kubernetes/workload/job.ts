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
  JobListVo,
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
 * 查看 Job YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns Job YAML 响应对象（完整 YAML 文本）
 */
export function getJobYaml(clusterUid: string, namespace: string, name: string) {
  return request.get<JobYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/yaml`)
}

/**
 * 查看 Job 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param params Job 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态）
 * @returns Job 关联 Pod 分页列表
 */
export function getJobPodList(clusterUid: string, namespace: string, name: string, params: Partial<PodQueryForm>) {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/pods`,
    { params },
  )
}

/**
 * 查看 Job 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param params 事件查询条件请求对象
 * @returns Job 关联事件分页列表
 */
export function getJobEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>) {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/events`,
    { params },
  )
}

/**
 * 查看 Job 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns Job 监控响应对象
 */
export function getJobMonitor(clusterUid: string, namespace: string, name: string) {
  return request.get<JobMonitorVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/monitor`)
}

/**
 * 创建 Job
 * @param clusterUid 集群 UID
 * @param data Job 创建请求对象（description / metadata / spec）
 */
export function createJob(clusterUid: string, data: Partial<JobCreateForm>) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/jobs`, data)
}

/**
 * YAML 创建 Job
 * @param clusterUid 集群 UID
 * @param yaml Job YAML 字符串
 */
export function createJobYaml(clusterUid: string, yaml: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/jobs/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data Job 更新请求对象（description / metadata / spec）
 */
export function updateJob(clusterUid: string, namespace: string, name: string, data: Partial<JobUpdateForm>) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`, data)
}

/**
 * YAML 更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param yaml Job YAML 字符串
 */
export function updateJobYaml(clusterUid: string, namespace: string, name: string, yaml: string) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 管理 Job 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 */
export function manageJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/labels`, data)
}

/**
 * 管理 Job 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 */
export function manageJobAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/annotations`, data)
}

/**
 * 删除 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 */
export function deleteJob(clusterUid: string, namespace: string, name: string) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 批量删除 Job
 * @param clusterUid 集群 UID
 * @param uids Job UID 列表
 */
export function deleteJobs(clusterUid: string, uids: string[]) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/jobs`, { data: uids })
}

/**
 * 导入 Job
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
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
 * 导出 Job
 * @param clusterUid 集群 UID
 * @param params Job 查询条件请求对象（名称、命名空间、状态）
 */
export function exportJob(clusterUid: string, params: Partial<JobQueryForm>) {
  return request.download(`/kubernetes/clusters/${clusterUid}/jobs/export`, { params })
}

/**
 * 手动重跑 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 */
export function rerunJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/rerun`)
}

/**
 * 暂停更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 */
export function pauseJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/pause`)
}

/**
 * 恢复更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 */
export function resumeJob(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/resume`)
}
