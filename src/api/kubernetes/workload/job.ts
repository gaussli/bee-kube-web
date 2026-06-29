/**
 * Job 资源管理 API
 * @module api/kubernetes/workload/job
 */
import type { PageResp } from '@/types/common'
import type { JobQueryReq, JobListResp, JobDetailResp, JobReq, JobLabelsReq, JobAnnotationsReq } from '@/types/kubernetes/workload/job'
import { request } from '@/utils'

/**
 * 获取 Job 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数（namespace 可选，默认查询所有命名空间）
 * @returns 分页后的 Job 列表
 */
export function getJobPage(clusterId: string, params: Partial<JobQueryReq>): Promise<PageResp<JobListResp>> {
  return request.get<PageResp<JobListResp>>(`/kubernetes/clusters/${clusterId}/jobs`, params)
}

/**
 * 获取 Job 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job 详情
 */
export function getJobDetail(clusterId: string, namespace: string, name: string): Promise<JobDetailResp> {
  return request.get<JobDetailResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 创建 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createJob(clusterId: string, namespace: string, data: Partial<JobReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs`, data)
}

/**
 * 更新 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 更新参数
 */
export function updateJob(clusterId: string, namespace: string, name: string, data: Partial<JobReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`, data)
}

/**
 * 更新 Job 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 标签数据
 */
export function manageJobLabels(clusterId: string, namespace: string, name: string, data: Partial<JobLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}/labels`, data)
}

/**
 * 更新 Job 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 注解数据
 */
export function manageJobAnnotations(clusterId: string, namespace: string, name: string, data: Partial<JobAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}/annotations`, data)
}

/**
 * 删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 */
export function deleteJob(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 批量删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Job 名称数组
 */
export function deleteJobs(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/batch`, { data: names })
}
