/**
 * 服务账号（ServiceAccount）管理 API
 * @module api/kubernetes/serviceAccount
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ServiceAccountCreateForm,
  ServiceAccountDetailVo,
  ServiceAccountListVo,
  ServiceAccountQueryForm,
  ServiceAccountUpdateForm,
  ServiceAccountYamlVo,
} from '@/types/kubernetes/security/serviceaccount'

import { request } from '@/utils'

/**
 * 获取服务账号（ServiceAccount）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的服务账号列表
 */
export function getServiceAccountList(
  clusterUid: string,
  query: Partial<ServiceAccountQueryForm>,
): Promise<PageVo<ServiceAccountListVo>> {
  return request.get<PageVo<ServiceAccountListVo>>(`/kubernetes/clusters/${clusterUid}/serviceaccounts`, {
    params: query,
  })
}

/**
 * 获取服务账号（ServiceAccount）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @returns 服务账号详情
 */
export function getServiceAccountDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<ServiceAccountDetailVo> {
  return request.get<ServiceAccountDetailVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}`,
  )
}

/**
 * 查看服务账号（ServiceAccount）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @returns 服务账号 YAML
 */
export function getServiceAccountYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): Promise<ServiceAccountYamlVo> {
  return request.get<ServiceAccountYamlVo>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}/yaml`,
  )
}

/**
 * 获取服务账号（ServiceAccount）事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getServiceAccountEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 创建 ServiceAccount
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createServiceAccount(clusterUid: string, data: Partial<ServiceAccountCreateForm>): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/serviceaccounts`, data)
}

/**
 * 创建服务账号（ServiceAccount）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createServiceAccountYaml(clusterUid: string, yaml: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/serviceaccounts/yaml`, yaml, {
    headers: { 'Content-Type': 'application/yaml' },
  })
}

/**
 * 更新服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param data - 更新请求对象
 */
export function updateServiceAccount(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ServiceAccountUpdateForm>,
): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}`, data)
}

/**
 * 更新服务账号（ServiceAccount）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param yaml - 更新 YAML 文本
 */
export function updateServiceAccountYaml(
  clusterUid: string,
  namespace: string,
  name: string,
  yaml: string,
): Promise<void> {
  return request.put<void>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}/yaml`,
    yaml,
    {
      headers: { 'Content-Type': 'application/yaml' },
    },
  )
}

/**
 * 更新 ServiceAccount 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 标签更新参数
 */
export function manageServiceAccountLabel(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}/labels`, data)
}

/**
 * 更新 ServiceAccount 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param data - 注解更新参数
 */
export function manageServiceAccountAnnotation(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): Promise<void> {
  return request.post(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}/annotations`,
    data,
  )
}

/**
 * 删除 ServiceAccount
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ServiceAccount 名称
 */
export function deleteServiceAccount(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/${name}`)
}

/**
 * 批量删除 ServiceAccount
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - 待删除的 ServiceAccount UID 列表
 */
export function deleteServiceAccounts(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts`, {
    data: uids,
  })
}

/**
 * 导入 ServiceAccount
 * @param clusterUid - 集群 UID
 * @param formData - 上传的文件
 * @param onProgress - 上传进度回调
 */
export function importServiceAccount(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return request.upload<void>(`/kubernetes/clusters/${clusterUid}/serviceaccounts/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 导出 ServiceAccount
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 */
export function exportServiceAccount(
  clusterUid: string,
  namespace: string,
  params: Partial<ServiceAccountQueryForm>,
): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/serviceaccounts/export`, {
    params,
  })
}
