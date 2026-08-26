/**
 * 有状态应用（Deployment）管理 API
 * @module api/kubernetes/workload/deployment
 */

import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentExportQueryForm,
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
  DeploymentListVo,
  DeploymentMonitorQueryForm,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentQueryForm,
  DeploymentRollbackForm,
  DeploymentScaleForm,
  DeploymentUpdateForm,
  DeploymentYamlVo,
} from '@/types/kubernetes/workload/deployment'

import { request } from '@/utils'

/**
 * 获取有状态应用（Deployment）列表
 * @param clusterUid 集群 UID
 * @param query 查询条件
 * @returns 分页后的有状态应用列表
 */
export function getDeploymentList(
  clusterUid: string,
  query: Partial<DeploymentQueryForm>,
): Promise<PageVo<DeploymentListVo>> {
  return request.get<PageVo<DeploymentListVo>>(`/kubernetes/clusters/${clusterUid}/deployments`, { params: query })
}

/**
 * 获取有状态应用（Deployment）详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @returns 有状态应用详情
 */
export function getDeploymentDetail(clusterUid: string, namespace: string, name: string): Promise<DeploymentDetailVo> {
  return request.get<DeploymentDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`,
  )
}

/**
 * 获取有状态应用（Deployment）YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @returns 有状态应用 YAML
 */
export function getDeploymentYaml(clusterUid: string, namespace: string, name: string): Promise<DeploymentYamlVo> {
  return request.get<DeploymentYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/yaml`,
  )
}

/**
 * 获取有状态应用（Deployment）关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param query Pod 查询条件
 * @returns 分页后的 Pod 列表
 */
export function getDeploymentPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): Promise<PageVo<PodListVo>> {
  return request.get<PageVo<PodListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/pods`,
    { params: query },
  )
}

/**
 * 获取有状态应用（Deployment）历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param query 历史版本查询条件
 * @returns 分页后的历史版本列表
 */
export function getDeploymentHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DeploymentHistoryRevisionQueryForm>,
): Promise<PageVo<DeploymentHistoryRevisionListVo>> {
  return request.get<PageVo<DeploymentHistoryRevisionListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/history`,
    { params: query },
  )
}

/**
 * 获取有状态应用（Deployment）关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @returns 关联网络资源数据
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
 * 获取有状态应用（Deployment）事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param query 事件查询条件
 * @returns 分页后的事件列表
 */
export function getDeploymentEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/events`,
    { params: query },
  )
}

/**
 * 获取有状态应用（Deployment）监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param query 监控查询条件
 * @returns 有状态应用监控数据
 */
export function getDeploymentMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DeploymentMonitorQueryForm>,
): Promise<DeploymentMonitorVo> {
  return request.get<DeploymentMonitorVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/monitor`,
    {
      params: query,
    },
  )
}

/**
 * 创建有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param data 创建请求对象
 */
export function createDeployment(clusterUid: string, data: Partial<DeploymentCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/deployments`, data)
}

/**
 * 创建有状态应用（Deployment）（YAML）
 * @param clusterUid 集群 UID
 * @param yaml 创建 YAML 文本
 */
export function createDeploymentYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/deployments/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param data 更新请求对象
 */
export function updateDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`, data)
}

/**
 * 更新有状态应用（Deployment）(YAML)
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param yaml 更新 YAML 文本
 */
export function updateDeploymentYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置有状态应用（Deployment）标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param data 标签配置请求对象
 */
export function manageDeploymentLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/labels`,
    data,
  )
}

/**
 * 配置有状态应用（Deployment）注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param data 注解配置请求对象
 */
export function manageDeploymentAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/annotations`,
    data,
  )
}

/**
 * 删除有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 */
export function deleteDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}`)
}

/**
 * 批量删除有状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param uids - 有状态应用 UID 数组
 */
export function deleteDeployments(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/deployments`, { data: uids })
}

/**
 * 导入有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param formData 文件数据
 * @param onProgress 上传进度回调
 * @returns void
 */
export function importDeployment(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/deployments/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param query 导出查询条件
 * @returns void
 */
export function exportDeployment(clusterUid: string, query: Partial<DeploymentExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/deployments/export`, { params: query })
}

/**
 * 扩容/缩容有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param data 扩容/缩容请求对象
 */
export function scaleDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentScaleForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/scale`,
    data,
  )
}

/**
 * 重启有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 */
export function restartDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/restart`)
}

/**
 * 回滚有状态应用（Deployment）
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 * @param data 回滚请求对象
 */
export function rollbackDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentRollbackForm,
): Promise<void> {
  return request.post<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/rollback`,
    data,
  )
}

/**
 * 暂停有状态应用（Deployment）更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 */
export function pauseDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/pause`)
}

/**
 * 恢复有状态应用（Deployment）更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name 有状态应用名称
 */
export function resumeDeployment(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/deployments/${name}/resume`)
}
