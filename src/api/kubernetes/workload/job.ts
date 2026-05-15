/**
 * @fileOverview Job 资源管理 API
 */
import { request } from '@/utils'
import type { JobQueryReq, JobResp, JobReq, JobLabelsReq, JobAnnotationsReq, PageResp } from '@/types'

/**
 * 获取 Job 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Job 列表
 */
export function getJobPage(clusterId: string, namespace: string, params: Partial<JobQueryReq>) {
  return request.get<PageResp<JobResp>>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs`, {
    params: params
  })
}

/**
 * 获取 Job 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job 详情
 */
export function getJobDetail(clusterId: string, namespace: string, name: string) {
  return request.get<JobResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 创建 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 * @returns 创建的 Job ID
 */
export function createJob(clusterId: string, namespace: string, data: Partial<JobReq>) {
  return request.post<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs`, {
    data: data
  })
}

/**
 * 更新 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 更新参数
 * @returns 更新后的 Job ID
 */
export function updateJob(clusterId: string, namespace: string, name: string, data: Partial<JobReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`, {
    data: data
  })
}

/**
 * 删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 */
export function deleteJob(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 批量删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Job 名称数组
 */
export function deleteJobs(clusterId: string, namespace: string, names: string[]) {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/batch`, {
    data: names
  })
}

/**
 * 更新 Job 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 标签数据
 */
export function manageJobLabels(clusterId: string, namespace: string, name: string, data: JobLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}/labels`, { data: data })
}

/**
 * 更新 Job 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 注解数据
 */
export function manageJobAnnotations(clusterId: string, namespace: string, name: string, data: JobAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/jobs/${name}/annotations`, { data: data })
}
