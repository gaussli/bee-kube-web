/**
 * 角色（Role）管理 API
 * @module api/kubernetes/role
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleCreateForm,
  RoleDetailVo,
  RoleExportQueryForm,
  RoleListVo,
  RoleQueryForm,
  RoleUpdateForm,
  RoleYamlVo,
} from '@/types/kubernetes/security/role'

import { request } from '@/utils'

/**
 * 获取角色（Role）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的角色列表
 */
export function getRoleList(clusterUid: string, query: Partial<RoleQueryForm>): Promise<PageVo<RoleListVo>> {
  return request.get<PageVo<RoleListVo>>(`/kubernetes/clusters/${clusterUid}/roles`, {
    params: query,
  })
}

/**
 * 获取角色（Role）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @returns 角色详情
 */
export function getRoleDetail(clusterUid: string, namespace: string, name: string): Promise<RoleDetailVo> {
  return request.get<RoleDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`)
}

/**
 * 获取角色（Role）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @returns 角色 YAML
 */
export function getRoleYaml(clusterUid: string, namespace: string, name: string): Promise<RoleYamlVo> {
  return request.get<RoleYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/yaml`)
}

/**
 * 获取角色（Role）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getRoleEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建角色（Role）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createRole(clusterUid: string, data: Partial<RoleCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/roles`, data)
}

/**
 * 创建角色（Role）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createRoleYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/roles/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新角色（Role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 更新请求对象
 */
export function updateRole(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<RoleUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`, data)
}

/**
 * 更新角色（Role）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param yaml - 更新 YAML 文本
 */
export function updateRoleYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 配置角色（Role）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 标签配置请求对象
 */
export function manageRoleLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/labels`, data)
}

/**
 * 配置角色（role）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 注解配置请求对象
 */
export function manageRoleAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/annotations`, data)
}

/**
 * 删除角色（role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 */
export function deleteRole(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`)
}

/**
 * 批量删除角色（role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 角色 UID 数组
 */
export function deleteRoles(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles`, { data: uids })
}

/**
 * 导入角色（Role）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importRole(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/roles/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出角色（role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param query - 导出查询条件
 */
export function exportRole(clusterUid: string, namespace: string, query: Partial<RoleExportQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/export`, { params: query })
}
