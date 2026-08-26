/**
 * RoleBinding 资源 API
 * @module api/kubernetes/rolebinding
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleBindingCreateForm,
  RoleBindingDetailVo,
  RoleBindingListVo,
  RoleBindingQueryForm,
  RoleBindingUpdateForm,
  RoleBindingYamlVo,
} from '@/types/kubernetes/security/rolebinding'

import { request } from '@/utils'

/**
 * 获取 RoleBinding 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页后的 RoleBinding 列表
 */
export function getRoleBindingList(
  clusterUid: string,
  namespace: string,
  params: Partial<RoleBindingQueryForm>,
): Promise<PageVo<RoleBindingListVo>> {
  return request.get<PageVo<RoleBindingListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings`,
    { params },
  )
}

/**
 * 获取 RoleBinding 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @returns RoleBinding 详情
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
 * 查看 RoleBinding YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @returns RoleBinding 完整 YAML 文本
 */
export function getRoleBindingYaml(clusterUid: string, namespace: string, name: string): Promise<RoleBindingYamlVo> {
  return request.get<RoleBindingYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/yaml`,
  )
}

/**
 * 获取 RoleBinding 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
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
 * 创建 RoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 RoleBinding ID
 */
export function createRoleBinding(clusterUid: string, data: Partial<RoleBindingCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${data.namespace}/rolebindings`, data)
}

/**
 * 通过 YAML 创建 RoleBinding
 * @param clusterUid - 集群 UID
 * @param yaml - RoleBinding YAML 文本
 */
export function createRoleBindingYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/rolebindings/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 更新参数
 * @returns 更新的 RoleBinding ID
 */
export function updateRoleBinding(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<RoleBindingUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}`, data)
}

/**
 * 通过 YAML 更新 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @param yaml - RoleBinding YAML 文本
 */
export function updateRoleBindingYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 RoleBinding 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageRoleBindingLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}/labels`, data)
}

/**
 * 更新 RoleBinding 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageRoleBindingAnnotation(
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
 * 删除 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - RoleBinding 名称
 */
export function deleteRoleBinding(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/${name}`)
}

/**
 * 批量删除 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 RoleBinding UID 列表
 */
export function deleteRoleBindings(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings`, {
    data: uids,
  })
}

/**
 * 导入 RoleBinding
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
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
 * 导出 RoleBinding
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 */
export function exportRoleBinding(
  clusterUid: string,
  namespace: string,
  params: Partial<RoleBindingQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/rolebindings/export`, {
    params,
  })
}
