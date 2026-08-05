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
  CronJobYamlReq,
} from '@/types/kubernetes/workload/cronjob'

import { request } from '@/utils'

/**
 * 获取 CronJob 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数（namespace 可选，默认查询所有命名空间）
 * @returns 分页后的 CronJob 列表
 */
export function getCronJobList(clusterUid: string, params: Partial<CronJobQueryReq>): Promise<PageVo<CronJobListResp>> {
  return request.get<PageVo<CronJobListResp>>(`/kubernetes/clusters/${clusterUid}/cronjobs`, params)
}

/**
 * 获取 CronJob 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob 详情
 */
export function getCronJobDetail(clusterUid: string, namespace: string, name: string): Promise<CronJobDetailResp> {
  return request.get<CronJobDetailResp>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 查看 CronJob YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob YAML 配置
 */
export function getCronJobYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/yaml`)
}

/**
 * 创建 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createCronJob(clusterUid: string, namespace: string, data: CronJobReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs`, data)
}

/**
 * 更新 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 更新参数
 */
export function updateCronJob(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<CronJobReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`, data)
}

/**
 * 更新 CronJob 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 标签数据
 */
export function manageCronJobLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: CronJobLabelsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/labels`, data)
}

/**
 * 更新 CronJob 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 注解数据
 */
export function manageCronJobAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: CronJobAnnotationsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/annotations`, data)
}

/**
 * 删除 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function deleteCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}`)
}

/**
 * 批量删除 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - CronJob 名称数组
 */
export function deleteCronJobs(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/batch`, { data: names })
}

/**
 * 导出 CronJob CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportCronJob(clusterUid: string, params: Partial<CronJobQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/cronjobs/export`, { params, config: { responseType: 'blob' } })
}

/**
 * 导入 CronJob
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importCronJob(clusterUid: string, data: CronJobYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/cronjobs/import`, data)
}

/**
 * 暂停 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function suspendCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/suspend`)
}

/**
 * 恢复 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function resumeCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/resume`)
}

/**
 * 手动触发 CronJob
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
export function triggerCronJob(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/cronjobs/${name}/trigger`)
}
