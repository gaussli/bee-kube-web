/**
 * Deployment 管理 API
 * @module api/kubernetes/workload/deployment
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
  DeploymentListVo,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentPodListVo,
  DeploymentPodQueryForm,
  DeploymentQueryForm,
  DeploymentRollbackForm,
  DeploymentScaleForm,
  DeploymentUpdateForm,
  DeploymentYamlVo,
} from '@/types/kubernetes/workload/deployment'

import { request } from '@/utils'

/**
 * 查看 Deployment 列表
 * @param clusterUid 集群 UID
 * @param params Deployment 查询条件请求对象（名称、命名空间、状态）
 * @returns Deployment 分页列表
 */
export function getDeploymentList(clusterUid: string, params: Partial<DeploymentQueryForm>) {
  return request.get<PageVo<DeploymentListVo>>(`/kubernetes/clusters/${clusterUid}/deployments`, { params })
}

/**
 * 查看 Deployment 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 详情响应对象
 */
export function getDeploymentDetail(clusterUid: string, namespace: string, name: string) {
  return request.get<DeploymentDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`,
  )
}

/**
 * 查看 Deployment YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment YAML 响应对象（完整 YAML 文本）
 */
export function getDeploymentYaml(clusterUid: string, namespace: string, name: string) {
  return request.get<DeploymentYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/yaml`,
  )
}

/**
 * 查看 Deployment 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param params Deployment 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态）
 * @returns Deployment 关联 Pod 分页列表
 */
export function getDeploymentPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<DeploymentPodQueryForm>,
) {
  return request.get<PageVo<DeploymentPodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/pods`,
    { params },
  )
}

/**
 * 查看 Deployment 历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param params Deployment 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns Deployment 历史版本分页列表
 */
export function getDeploymentHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<DeploymentHistoryRevisionQueryForm>,
) {
  return request.get<PageVo<DeploymentHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/history`,
    { params },
  )
}

/**
 * 查看 Deployment 关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
export function getDeploymentNetwork(clusterUid: string, namespace: string, name: string) {
  return request.get<DeploymentNetworkVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/network`,
  )
}

/**
 * 查看 Deployment 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param params 事件查询条件请求对象
 * @returns Deployment 关联事件分页列表
 */
export function getDeploymentEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  params: Partial<EventQueryForm>,
) {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/events`,
    { params },
  )
}

/**
 * 查看 Deployment 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 监控响应对象
 */
export function getDeploymentMonitor(clusterUid: string, namespace: string, name: string) {
  return request.get<DeploymentMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/monitor`,
  )
}

/**
 * 创建 Deployment
 * @param clusterUid 集群 UID
 * @param data Deployment 创建请求对象（description / metadata / spec）
 * @returns void
 */
export function createDeployment(clusterUid: string, data: Partial<DeploymentCreateForm>) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/deployments`, data)
}

/**
 * YAML 创建 Deployment
 * @param clusterUid 集群 UID
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
export function createDeploymentYaml(clusterUid: string, yaml: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/deployments/yaml`, yaml)
}

/**
 * 更新 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 更新请求对象（description / metadata / spec）
 * @returns void
 */
export function updateDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`, data)
}

/**
 * YAML 更新 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
export function updateDeploymentYaml(clusterUid: string, namespace: string, name: string, yaml: string) {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/yaml`, yaml)
}

/**
 * 管理 Deployment 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
export function manageDeploymentLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/labels`,
    data,
  )
}

/**
 * 管理 Deployment 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
export function manageDeploymentAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/annotations`,
    data,
  )
}

/**
 * 删除 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
export function deleteDeployment(clusterUid: string, namespace: string, name: string) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 批量删除 Deployment
 * @param clusterUid 集群 UID
 * @param uids Deployment UID 列表
 * @returns void
 */
export function deleteDeployments(clusterUid: string, uids: string[]) {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/deployments/batch`, { data: uids })
}

/**
 * 导入 Deployment
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
 */
export function importDeployment(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/deployments/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 Deployment
 * @param clusterUid 集群 UID
 * @param params Deployment 查询条件请求对象（名称、命名空间、状态）
 * @returns void
 */
export function exportDeployment(clusterUid: string, params: Partial<DeploymentQueryForm>) {
  return request.download(`/kubernetes/clusters/${clusterUid}/deployments/export`, { params })
}

/**
 * 扩缩容 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 扩缩容请求对象（期望副本数）
 * @returns void
 */
export function scaleDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/scale`,
    data,
  )
}

/**
 * 重启 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
export function restartDeployment(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/restart`)
}

/**
 * 回滚 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 回滚请求对象（目标历史版本号）
 * @returns void
 */
export function rollbackDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentRollbackForm) {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/rollback`,
    data,
  )
}

/**
 * 暂停 Deployment 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
export function pauseDeployment(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/pause`)
}

/**
 * 恢复 Deployment 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
export function resumeDeployment(clusterUid: string, namespace: string, name: string) {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/resume`)
}
