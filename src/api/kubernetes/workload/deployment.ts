/**
 * Deployment 资源管理 API
 * @module api/kubernetes/workload/deployment
 */
import type { PageResp } from '@/types/common'
import type {
  DeploymentAdvancedVo,
  DeploymentAnnotationForm,
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentEditForm,
  DeploymentLabelForm,
  DeploymentListVo,
  DeploymentQueryForm,
  DeploymentScaleForm,
  DeploymentScheduleVo,
  DeploymentYamlForm
} from '@/types/kubernetes/workload/deployment'
import { request } from '@/utils'

/**
 * 获取 Deployment 分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的 Deployment 列表
 */
export function getDeploymentList(clusterId: string, params: Partial<DeploymentQueryForm>): Promise<PageResp<DeploymentListVo>> {
  return request.get<PageResp<DeploymentListVo>>(`/kubernetes/clusters/${clusterId}/deployments`, params)
}

/**
 * 获取 Deployment 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 详情
 */
export function getDeploymentDetail(clusterId: string, namespace: string, name: string): Promise<DeploymentDetailVo> {
  return request.get<DeploymentDetailVo>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 查看 Deployment YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment YAML 配置
 */
export function getDeploymentYaml(clusterId: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/yaml`)
}

/**
 * 创建 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createDeployment(clusterId: string, namespace: string, data: DeploymentCreateForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments`, data)
}

/**
 * 更新 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 更新参数
 */
export function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentEditForm>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`, data)
}

/**
 * 更新 Deployment 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
export function manageDeploymentLabels(clusterId: string, namespace: string, name: string, data: DeploymentLabelForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/labels`, data)
}

/**
 * 更新 Deployment 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
export function manageDeploymentAnnotations(clusterId: string, namespace: string, name: string, data: DeploymentAnnotationForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/annotations`, data)
}

/**
 * 删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function deleteDeployment(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 批量删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Deployment 名称数组
 */
export function deleteDeployments(clusterId: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/batch`, { data: names })
}

/**
 * 导出 Deployment CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
export function exportDeployment(clusterId: string, params: Partial<DeploymentQueryForm>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterId}/deployments/export`, { params: params, responseType: 'blob' })
}

/**
 * 导入 Deployment
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
export function importDeployment(clusterId: string, data: DeploymentYamlForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/deployments/import`, data)
}

/**
 * 获取 Deployment 调度策略
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 调度策略
 */
export function getDeploymentSchedule(clusterId: string, namespace: string, name: string): Promise<DeploymentScheduleVo> {
  return request.get<DeploymentScheduleVo>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/schedule`)
}

/**
 * 获取 Deployment 高级配置
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @returns Deployment 高级配置
 */
export function getDeploymentAdvanced(clusterId: string, namespace: string, name: string): Promise<DeploymentAdvancedVo> {
  return request.get<DeploymentAdvancedVo>(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/advanced`)
}

/**
 * 扩缩容 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
export function scaleDeployment(clusterId: string, namespace: string, name: string, data: DeploymentScaleForm): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/scale`, data)
}

/**
 * 重启 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function restartDeployment(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/restart`)
}

/**
 * 回滚 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Deployment 名称
 */
export function rollbackDeployment(clusterId: string, namespace: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/namespaces/${namespace}/deployments/${name}/rollback`)
}
