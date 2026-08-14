/**
 * 命名空间管理 API
 * @module api/kubernetes/namespace
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type {
  NamespaceAnnotationForm,
  NamespaceCreateForm,
  NamespaceDetailVo,
  NamespaceLabelForm,
  NamespaceListVo,
  NamespaceQuotaCreateForm,
  NamespaceQuotaUpdateForm,
  NamespaceQueryForm,
  NamespaceSimpleListVo,
  NamespaceUpdateForm,
  NamespaceQuotaDetailVo,
} from '@/types/kubernetes/namespace'

import { request } from '@/utils'

/**
 * 获取命名空间列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数，mode 为 simple 时不翻页
 * @returns 分页后的命名空间列表（normal）或简化列表（simple）
 */
export function getNamespaceList(
  clusterUid: string,
  params: Partial<NamespaceQueryForm>,
): Promise<PageVo<NamespaceListVo> | NamespaceSimpleListVo[]> {
  return request.get<PageVo<NamespaceListVo> | NamespaceSimpleListVo[]>(
    `/kubernetes/clusters/${clusterUid}/namespaces`,
    { params },
  )
}

/**
 * 获取命名空间详情
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @returns 命名空间详情
 */
export function getNamespaceDetail(clusterUid: string, uid: string): Promise<NamespaceDetailVo> {
  return request.get<NamespaceDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}`)
}

/**
 * 获取命名空间 YAML
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @returns 命名空间 YAML 配置
 */
export function getNamespaceYaml(clusterUid: string, uid: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/yaml`)
}

/**
 * 创建命名空间
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 */
export function createNamespace(clusterUid: string, data: Partial<NamespaceCreateForm>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces`, data)
}

/**
 * 创建命名空间（YAML）
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置字符串
 */
export function createNamespaceYaml(clusterUid: string, data: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/yaml`, data)
}

/**
 * 更新命名空间
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - 更新参数
 */
export function updateNamespace(clusterUid: string, uid: string, data: Partial<NamespaceUpdateForm>): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}`, data)
}

/**
 * 更新命名空间（YAML）
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - YAML 配置字符串
 */
export function updateNamespaceYaml(clusterUid: string, uid: string, data: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/yaml`, data)
}

/**
 * 删除命名空间
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 */
export function deleteNamespace(clusterUid: string, uid: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}`)
}

/**
 * 批量删除命名空间
 * @param clusterUid - 集群 UID
 * @param uids - 命名空间 UID 数组
 */
export function deleteNamespaces(clusterUid: string, uids: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/batch`, { data: uids })
}

/**
 * 更新命名空间标签
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - 标签数据
 */
export function manageNamespaceLabel(
  clusterUid: string,
  uid: string,
  data: Partial<NamespaceLabelForm>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/labels`, data)
}

/**
 * 更新命名空间注解
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - 注解数据
 */
export function manageNamespaceAnnotation(
  clusterUid: string,
  uid: string,
  data: Partial<NamespaceAnnotationForm>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/annotations`, data)
}

/**
 * 导出命名空间列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 命名空间 YAML 配置字符串
 */
export function exportNamespace(clusterUid: string, params: Partial<NamespaceQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/namespaces/export`, { params })
}

/**
 * 通过文件导入命名空间
 * @param clusterUid - 集群 UID
 * @param formData - 包含命名空间 YAML 文件的表单数据
 * @param onProgress - 上传进度回调
 */
export function importNamespace(
  clusterUid: string,
  formData: FormData,
  onProgress?: (e: AxiosProgressEvent) => void,
): Promise<void> {
  return request.upload(`/kubernetes/clusters/${clusterUid}/namespaces/import`, formData, {
    onUploadProgress: onProgress,
  })
}

/**
 * 获取命名空间配额
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @returns 命名空间配额详情
 */
export function getNamespaceQuota(clusterUid: string, uid: string): Promise<NamespaceQuotaDetailVo> {
  return request.get<NamespaceQuotaDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/quota`)
}

/**
 * 获取命名空间配额 YAML
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @returns 命名空间配额 YAML 配置字符串
 */
export function getNamespaceQuotaYaml(clusterUid: string, uid: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/quota/yaml`)
}

/**
 * 创建命名空间配额
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - 配额配置
 */
export function createNamespaceQuota(
  clusterUid: string,
  uid: string,
  data: Partial<NamespaceQuotaCreateForm>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/quota`, data)
}

/**
 * 更新命名空间配额
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 * @param data - 配额配置
 */
export function updateNamespaceQuota(
  clusterUid: string,
  uid: string,
  data: Partial<NamespaceQuotaUpdateForm>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/quota`, data)
}

/**
 * 删除命名空间资源配额
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 */
export function deleteNamespaceResourceQuota(clusterUid: string, uid: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/resourcequota`)
}

/**
 * 删除命名空间限制范围
 * @param clusterUid - 集群 UID
 * @param uid - 命名空间 UID
 */
export function deleteNamespaceLimitRange(clusterUid: string, uid: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${uid}/limitrange`)
}
