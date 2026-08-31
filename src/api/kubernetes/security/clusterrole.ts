/**
 * 集群角色（ClusterRole）管理 API
 * @module api/kubernetes/clusterrole
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleCreateForm,
  ClusterRoleDetailVo,
  ClusterRoleExportQueryForm,
  ClusterRoleListVo,
  ClusterRoleQueryForm,
  ClusterRoleUpdateForm,
  ClusterRoleYamlVo,
} from '@/types/kubernetes/security/clusterrole'

import { request } from '@/utils'

/**
 * 获取集群角色（ClusterRole）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的集群角色列表
 */
export function getClusterRoleList(
  clusterUid: string,
  query: Partial<ClusterRoleQueryForm>,
): Promise<PageVo<ClusterRoleListVo>> {
  return request.get<PageVo<ClusterRoleListVo>>(`/kubernetes/clusters/${clusterUid}/clusterroles`, { params: query })
}

/**
 * 获取集群角色（ClusterRole）详情
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @returns 集群角色详情
 */
export function getClusterRoleDetail(clusterUid: string, name: string): Promise<ClusterRoleDetailVo> {
  return request.get<ClusterRoleDetailVo>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}`)
}

/**
 * 获取集群角色（ClusterRole）YAML
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @returns 集群角色 YAML
 */
export function getClusterRoleYaml(clusterUid: string, name: string): Promise<ClusterRoleYamlVo> {
  return request.get<ClusterRoleYamlVo>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/yaml`)
}

/**
 * 获取集群角色（ClusterRole）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getClusterRoleEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/events`, {
    params: query,
  })
}

/**
 * 创建集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createClusterRole(clusterUid: string, data: Partial<ClusterRoleCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/clusterroles`, data)
}

/**
 * 创建集群角色（ClusterRole）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createClusterRoleYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 更新请求对象
 */
export function updateClusterRole(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}`, data)
}

/**
 * 更新集群角色（ClusterRole）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param yaml - 更新 YAML 文本
 */
export function updateClusterRoleYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置集群角色（ClusterRole）标签
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 标签配置请求对象
 */
export function manageClusterRoleLabels(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/labels`, data)
}

/**
 * 配置集群角色（ClusterRole）注解
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 注解配置请求对象
 */
export function manageClusterRoleAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}/annotations`, data)
}

/**
 * 删除集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 */
export function deleteClusterRole(clusterUid: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/${name}`)
}

/**
 * 批量删除集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param uids - 集群角色 UID 数组
 */
export function deleteClusterRoles(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/clusterroles`, { data: uids })
}

/**
 * 导入集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importClusterRole(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportClusterRole(clusterUid: string, query: Partial<ClusterRoleExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/clusterroles/export`, { params: query })
}
