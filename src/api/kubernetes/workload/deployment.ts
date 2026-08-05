/**
 * Deployment 资源管理 API
 * @module api/kubernetes/workload/deployment
 */
import type { PageVo } from '@/types/common'
import type {
  DeploymentAnnotationForm,
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentPodListVo,
  DeploymentPodQueryForm,
  DeploymentStorageListVo,
  DeploymentUpdateForm,
  DeploymentLabelForm,
  DeploymentListVo,
  DeploymentQueryForm,
  DeploymentScaleForm,
  DeploymentScheduleVo,
  DeploymentYamlForm,
} from '@/types/kubernetes/workload/deployment'

import { request } from '@/utils'

/**
 * 获取 Deployment 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的 Deployment 列表
 */
export function getDeploymentList(
  clusterUid: string,
  params: Partial<DeploymentQueryForm>,
): Promise<PageVo<DeploymentListVo>> {
  return request.get<PageVo<DeploymentListVo>>(`/kubernetes/clusters/${clusterUid}/deployments`, params)
}

/**
 * 获取 Deployment 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 详情
 */
export function getDeploymentDetail(clusterUid: string, namespace: string, name: string): Promise<DeploymentDetailVo> {
  return request.get<DeploymentDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`,
  )
}

/**
 * 获取 Deployment Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment Pod 列表
 */
/**
 * 获取 Deployment Pod 分页列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param params - 查询参数（含分页、名称筛选、状态筛选）
 * @returns 分页后的 Pod 列表
 */
export function getDeploymentPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<DeploymentPodQueryForm>,
): Promise<PageVo<DeploymentPodListVo>> {
  return request.get<PageVo<DeploymentPodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/pods`,
    params,
  )
}

/**
 * 获取 Deployment 调度策略
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 调度策略
 */
export function getDeploymentSchedule(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<DeploymentScheduleVo> {
  return request.get<DeploymentScheduleVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/schedule`,
  )
}

/**
 * 获取 Deployment 历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 历史版本列表
 */
export function getDeploymentHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<DeploymentHistoryRevisionListVo[]> {
  return request.get<DeploymentHistoryRevisionListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/history`,
  )
}

/**
 * 获取 Deployment 网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 网络资源
 */
export function getDeploymentNetwork(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<DeploymentNetworkVo> {
  return request.get<DeploymentNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/network`,
  )
}

/**
 * 获取 Deployment 存储列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 存储列表
 */
export function getDeploymentStorageList(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<DeploymentStorageListVo[]> {
  return request.get<DeploymentStorageListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/storages`,
  )
}

/**
 * 获取 Deployment 监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 监控数据
 */
export function getDeploymentMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<DeploymentMonitorVo> {
  return request.get<DeploymentMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/monitor`,
  )
}

/**
 * 查看 Deployment YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment YAML 配置
 */
export function getDeploymentYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/yaml`)
}

/**
 * 创建 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createDeployment(clusterUid: string, namespace: string, data: DeploymentCreateForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments`, data)
}

/**
 * 更新 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 更新参数
 */
export function updateDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`, data)
}

/**
 * 更新 Deployment 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
export function manageDeploymentLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/labels`, data)
}

/**
 * 更新 Deployment 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
export function manageDeploymentAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/annotations`,
    data,
  )
}

/**
 * 删除 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function deleteDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 批量删除 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - Deployment 名称数组
 */
export function deleteDeployments(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/batch`, { data: names })
}

/**
 * 导出 Deployment CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportDeployment(clusterUid: string, params: Partial<DeploymentQueryForm>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/deployments/export`, { params, config: { responseType: 'blob' } })
}

/**
 * 导入 Deployment
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importDeployment(clusterUid: string, data: DeploymentYamlForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/deployments/import`, data)
}

/**
 * 扩缩容 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
export function scaleDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentScaleForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/scale`, data)
}

/**
 * 重启 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function restartDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/restart`)
}

/**
 * 回滚 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function rollbackDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/rollback`)
}
