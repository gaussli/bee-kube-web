/**
 * 集群角色绑定（ClusterRoleBinding）管理 API
 * @module api/kubernetes/clusterrolebinding
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleBindingCreateForm,
  ClusterRoleBindingDetailVo,
  ClusterRoleBindingListVo,
  ClusterRoleBindingQueryForm,
  ClusterRoleBindingUpdateForm,
  ClusterRoleBindingYamlVo,
} from '@/types/kubernetes/security/clusterrolebinding'

import { request } from '@/utils'

/**
 * 获取集群角色绑定（ClusterRoleBinding）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的集群角色绑定列表
 */
export function getClusterRoleBindingList(
  clusterUid: string,
  query: Partial<ClusterRoleBindingQueryForm>,
): Promise<PageVo<ClusterRoleBindingListVo>> {
  return request.get<PageVo<ClusterRoleBindingListVo>>(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, {
    params: query,
  })
}

/**
 * 获取集群角色绑定（ClusterRoleBinding）详情
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @returns 集群角色绑定详情
 */
export function getClusterRoleBindingDetail(clusterUid: string, name: string): Promise<ClusterRoleBindingDetailVo> {
  return request.get<ClusterRoleBindingDetailVo>(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}`)
}

/**
 * 查看 ClusterRoleBinding YAML
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 完整 YAML 文本
 */
export function getClusterRoleBindingYaml(clusterUid: string, name: string): Promise<ClusterRoleBindingYamlVo> {
  return request.get<ClusterRoleBindingYamlVo>(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/yaml`)
}

/**
 * 获取 ClusterRoleBinding 事件列表
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getClusterRoleBindingEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/events`, {
    params: query,
  })
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 * @returns 创建的 ClusterRoleBinding ID
 */
export function createClusterRoleBinding(
  clusterUid: string,
  data: Partial<ClusterRoleBindingCreateForm>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, data)
}

/**
 * 通过 YAML 创建 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param yaml - ClusterRoleBinding YAML 文本
 */
export function createClusterRoleBindingYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 更新参数
 * @returns 更新的 ClusterRoleBinding ID
 */
export function updateClusterRoleBinding(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleBindingUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}`, data)
}

/**
 * 通过 YAML 更新 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param yaml - ClusterRoleBinding YAML 文本
 */
export function updateClusterRoleBindingYaml(clusterUid: string, name: string, yaml: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 标签更新参数
 */
export function manageClusterRoleBindingLabel(
  clusterUid: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/labels`, data)
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param data - 注解更新参数
 */
export function manageClusterRoleBindingAnnotation(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}/annotations`, data)
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 */
export function deleteClusterRoleBinding(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/${name}`)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param uids - 待删除的 ClusterRoleBinding UID 列表
 */
export function deleteClusterRoleBindings(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/clusterrolebindings`, { data: uids })
}

/**
 * 导入 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importClusterRoleBinding(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportClusterRoleBinding(
  clusterUid: string,
  params: Partial<ClusterRoleBindingQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/clusterrolebindings/export`, { params })
}
