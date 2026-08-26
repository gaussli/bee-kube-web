/**
 * Role 资源 API
 * @module api/kubernetes/role
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleCreateForm,
  RoleDetailVo,
  RoleListVo,
  RoleQueryForm,
  RoleUpdateForm,
  RoleYamlVo,
} from '@/types/kubernetes/security/role'

import { request } from '@/utils'

/**
 * 获取 Role 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 Role 列表
 */
export function getRoleList(
  clusterUid: string,
  namespace: string,
  params: Partial<RoleQueryForm>,
): Promise<PageVo<RoleListVo>> {
  return request.get<PageVo<RoleListVo>>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles`, {
    params,
  })
}

/**
 * 获取 Role 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @returns Role 详情
 */
export function getRoleDetail(clusterUid: string, namespace: string, name: string): Promise<RoleDetailVo> {
  return request.get<RoleDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`)
}

/**
 * 查看 Role YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @returns Role 完整 YAML 文本
 */
export function getRoleYaml(clusterUid: string, namespace: string, name: string): Promise<RoleYamlVo> {
  return request.get<RoleYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/yaml`)
}

/**
 * 获取 Role 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
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
 * 创建 Role
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 Role ID
 */
export function createRole(clusterUid: string, data: Partial<RoleCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/roles`, data)
}

/**
 * 通过 YAML 创建 Role
 * @param clusterUid - 集群 UID
 * @param yaml - Role YAML 文本
 */
export function createRoleYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/roles/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Role
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @param data - 更新参数
 * @returns 更新的 Role ID
 */
export function updateRole(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<RoleUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`, data)
}

/**
 * 通过 YAML 更新 Role
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @param yaml - Role YAML 文本
 */
export function updateRoleYaml(clusterUid: string, namespace: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 Role 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @param data - 标签更新参数
 */
export function manageRoleLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/labels`, data)
}

/**
 * 更新 Role 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 * @param data - 注解更新参数
 */
export function manageRoleAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}/annotations`, data)
}

/**
 * 删除 Role
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Role 名称
 */
export function deleteRole(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/${name}`)
}

/**
 * 批量删除 Role
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 Role UID 列表
 */
export function deleteRoles(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles`, { data: uids })
}

/**
 * 导入 Role
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
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
 * 导出 Role
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 */
export function exportRole(clusterUid: string, namespace: string, params: Partial<RoleQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/roles/export`, { params })
}
