/**
 * 角色绑定（RoleBinding）管理 API
 * @module api/kubernetes/rolebinding
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleBindingCreateForm,
  RoleBindingDetailVo,
  RoleBindingExportQueryForm,
  RoleBindingListVo,
  RoleBindingQueryForm,
  RoleBindingUpdateForm,
  RoleBindingYamlVo,
} from '@/types/kubernetes/security/rolebinding'

import { request } from '@/utils'

/**
 * 获取角色绑定（RoleBinding）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的角色绑定列表
 */
export function getRoleBindingList(
  clusterUid: string,
  query: Partial<RoleBindingQueryForm>,
): Promise<PageVo<RoleBindingListVo>> {
  return request.get<PageVo<RoleBindingListVo>>(`/kubernetes/clusters/${clusterUid}/rolebindings`, {
    params: query,
  })
}

/**
 * 获取角色绑定（RoleBinding）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @returns 角色绑定详情
 */
export function getRoleBindingDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<RoleBindingDetailVo> {
  return request.get<RoleBindingDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}`,
  )
}

/**
 * 获取角色绑定（RoleBinding）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @returns 角色绑定 YAML
 */
export function getRoleBindingYaml(clusterUid: string, namespace: string, name: string): Promise<RoleBindingYamlVo> {
  return request.get<RoleBindingYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/yaml`,
  )
}

/**
 * 获取角色绑定（RoleBinding）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getRoleBindingEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createRoleBinding(clusterUid: string, data: Partial<RoleBindingCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/rolebindings`, data)
}

/**
 * 创建角色绑定（RoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createRoleBindingYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/rolebindings/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 更新请求对象
 */
export function updateRoleBinding(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<RoleBindingUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}`, data)
}

/**
 * 更新角色绑定（RoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param yaml - 更新 YAML 文本
 */
export function updateRoleBindingYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 配置角色绑定（RoleBinding）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 标签配置请求对象
 */
export function manageRoleBindingLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/labels`, data)
}

/**
 * 配置角色绑定（rolebinding）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 注解配置请求对象
 */
export function manageRoleBindingAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/annotations`,
    data,
  )
}

/**
 * 删除角色绑定（rolebinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 */
export function deleteRoleBinding(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}`)
}

/**
 * 批量删除角色绑定（rolebinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 角色绑定 UID 数组
 */
export function deleteRoleBindings(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings`, {
    data: uids,
  })
}

/**
 * 导入角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importRoleBinding(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/rolebindings/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出角色绑定（rolebinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param query - 导出查询条件
 */
export function exportRoleBinding(
  clusterUid: string,
  namespace: string,
  query: Partial<RoleBindingExportQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/export`, {
    params: query,
  })
}
