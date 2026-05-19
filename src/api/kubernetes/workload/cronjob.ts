/**
 * CronJob 资源管理 API
 * @module api/kubernetes/workload/cronjob
 */
import type { PageResp } from '@/types/common'
import type { CronJobQueryReq, CronJobResp, CronJobReq, CronJobLabelsReq, CronJobAnnotationsReq } from '@/types/kubernetes/workload/cronjob'
import { request } from '@/utils'

/**
 * 获取 CronJob 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 CronJob 列表
 */
export function getCronJobPage(clusterId: string, namespace: string, params: Partial<CronJobQueryReq>): Promise<PageResp<CronJobResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs`, {
    params: params
  })
}

/**
 * 获取 CronJob 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob 详情
 */
export function getCronJobDetail(clusterId: string, namespace: string, name: string): Promise<CronJobResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 创建 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createCronJob(clusterId: string, namespace: string, data: Partial<CronJobReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs`, {
    data: data
  })
}

/**
 * 更新 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 更新参数
 */
export function updateCronJob(clusterId: string, namespace: string, name: string, data: Partial<CronJobReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}`, {
    data: data
  })
}

/**
 * 暂停 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function suspendCronJob(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/suspend`)
}

/**
 * 恢复 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function resumeCronJob(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/resume`)
}

/**
 * 手动触发 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function triggerCronJob(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/trigger`)
}

/**
 * 更新 CronJob 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 标签数据
 */
export function manageCronJobLabels(clusterId: string, namespace: string, name: string, data: Partial<CronJobLabelsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/labels`, { data: data })
}

/**
 * 更新 CronJob 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 注解数据
 */
export function manageCronJobAnnotations(clusterId: string, namespace: string, name: string, data: Partial<CronJobAnnotationsReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/annotations`, { data: data })
}

/**
 * 删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function deleteCronJob(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 批量删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - CronJob 名称数组
 */
export function deleteCronJobs(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/batch`, {
    data: names
  })
}
