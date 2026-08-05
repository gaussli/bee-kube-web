/**
 * Job 资源管理 API
 * @module api/kubernetes/workload/job
 */
import type { PageVo } from '@/types/common'
import type {
  JobAnnotationsReq,
  JobDetailResp,
  JobLabelsReq,
  JobListResp,
  JobQueryReq,
  JobReq,
  JobYamlReq,
} from '@/types/kubernetes/workload/job'

import { request } from '@/utils'

/**
 * 获取 Job 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数（namespace 可选，默认查询所有命名空间）
 * @returns 分页后的 Job 列表
 */
export function getJobList(clusterUid: string, params: Partial<JobQueryReq>): Promise<PageVo<JobListResp>> {
  return request.get<PageVo<JobListResp>>(`/kubernetes/clusters/${clusterUid}/jobs`, params)
}

/**
 * 获取 Job 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job 详情
 */
export function getJobDetail(clusterUid: string, namespace: string, name: string): Promise<JobDetailResp> {
  return request.get<JobDetailResp>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 查看 Job YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job YAML 配置
 */
export function getJobYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/yaml`)
}

/**
 * 创建 Job
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createJob(clusterUid: string, namespace: string, data: JobReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs`, data)
}

/**
 * 更新 Job
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 更新参数
 */
export function updateJob(clusterUid: string, namespace: string, name: string, data: Partial<JobReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`, data)
}

/**
 * 更新 Job 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 标签数据
 */
export function manageJobLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: JobLabelsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/labels`, data)
}

/**
 * 更新 Job 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 注解数据
 */
export function manageJobAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: JobAnnotationsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}/annotations`, data)
}

/**
 * 删除 Job
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 */
export function deleteJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/${name}`)
}

/**
 * 批量删除 Job
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - Job 名称数组
 */
export function deleteJobs(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/jobs/batch`, { data: names })
}

/**
 * 导出 Job CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportJob(clusterUid: string, params: Partial<JobQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/jobs/export`, { params, config: { responseType: 'blob' } })
}

/**
 * 导入 Job
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importJob(clusterUid: string, data: JobYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/jobs/import`, data)
}
