/**
 * CronJob 资源管理 API
 * @module api/kubernetes/workload/cronjob
 */
import type { PageVo } from '@/types/common'
import type {
  CronJobAnnotationsReq,
  CronJobDetailResp,
  CronJobLabelsReq,
  CronJobListResp,
  CronJobQueryReq,
  CronJobReq,
  CronJobYamlReq
} from '@/types/kubernetes/workload/cronjob'
import { request } from '@/utils'

/**
 * 获取 CronJob 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数（namespace 可选，默认查询所有命名空间）
 * @returns 分页后的 CronJob 列表
 */
export function getCronJobList(clusterId: string, params: Partial<CronJobQueryReq>): Promise<PageVo<CronJobListResp>> {
  return request.get<PageVo<CronJobListResp>>(`/kubernetes/clusters/${clusterId}/cronjobs`, params)
}

/**
 * 获取 CronJob 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob 详情
 */
export function getCronJobDetail(clusterId: string, namespace: string, name: string): Promise<CronJobDetailResp> {
  return request.get<CronJobDetailResp>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 查看 CronJob YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob YAML 配置
 */
export function getCronJobYaml(clusterId: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/yaml`)
}

/**
 * 创建 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createCronJob(clusterId: string, namespace: string, data: CronJobReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs`, data)
}

/**
 * 更新 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 更新参数
 */
export function updateCronJob(
  clusterId: string,
  namespace: string,
  name: string,
  data: Partial<CronJobReq>
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}`, data)
}

/**
 * 更新 CronJob 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 标签数据
 */
export function manageCronJobLabels(
  clusterId: string,
  namespace: string,
  name: string,
  data: CronJobLabelsReq
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/labels`, data)
}

/**
 * 更新 CronJob 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 注解数据
 */
export function manageCronJobAnnotations(
  clusterId: string,
  namespace: string,
  name: string,
  data: CronJobAnnotationsReq
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/${name}/annotations`, data)
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
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/cronjobs/batch`, names)
}

/**
 * 导出 CronJob CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
export function exportCronJob(clusterId: string, params: Partial<CronJobQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/cronjobs/export`, { params: params, responseType: 'blob' })
}

/**
 * 导入 CronJob
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
export function importCronJob(clusterId: string, data: CronJobYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/cronjobs/import`, data)
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
