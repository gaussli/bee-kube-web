/**
 * ConfigMap 资源管理 API
 * @module api/kubernetes/config/configmap
 */
import type { PageVo } from '@/types/common'
import type {
  ConfigMapAnnotationsReq,
  ConfigMapDataReq,
  ConfigMapDetailResp,
  ConfigMapLabelsReq,
  ConfigMapListResp,
  ConfigMapQueryReq,
  ConfigMapReq,
  ConfigMapYamlReq,
} from '@/types/kubernetes/config/configmap'

import { request } from '@/utils'

/**
 * 获取 ConfigMap 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数（含 namespace 筛选）
 * @returns 分页后的 ConfigMap 列表
 */
export function getConfigMapList(
  clusterUid: string,
  params: Partial<ConfigMapQueryReq>,
): Promise<PageVo<ConfigMapListResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/configmaps`, { params })
}

/**
 * 获取 ConfigMap 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap 详情
 */
export function getConfigMapDetail(clusterUid: string, namespace: string, name: string): Promise<ConfigMapDetailResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 查看 ConfigMap YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap YAML 配置
 */
export function getConfigMapYaml(clusterUid: string, namespace: string, name: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/yaml`)
}

/**
 * 创建 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建参数
 */
export function createConfigMap(clusterUid: string, namespace: string, data: ConfigMapReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps`, data)
}

/**
 * 更新 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 更新参数
 */
export function updateConfigMap(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ConfigMapReq>,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`, data)
}

/**
 * 更新 ConfigMap 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 标签数据
 */
export function manageConfigMapLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: ConfigMapLabelsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/labels`, data)
}

/**
 * 更新 ConfigMap 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 注解数据
 */
export function manageConfigMapAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: ConfigMapAnnotationsReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/annotations`, data)
}

/**
 * 删除 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 */
export function deleteConfigMap(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}`)
}

/**
 * 批量删除 ConfigMap
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - ConfigMap 名称数组
 */
export function deleteConfigMaps(clusterUid: string, namespace: string, names: string[]): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/batch`, { data: names })
}

/**
 * 导出 ConfigMap CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
export function exportConfigMap(clusterUid: string, params: Partial<ConfigMapQueryReq>): Promise<void> {
  return request.get(`/kubernetes/clusters/${clusterUid}/configmaps/export`, {
    params,
    config: { responseType: 'blob' },
  })
}

/**
 * 导入 ConfigMap
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
export function importConfigMap(clusterUid: string, data: ConfigMapYamlReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/configmaps/import`, data)
}

/**
 * 更新 ConfigMap 数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 数据参数
 */
export function manageConfigMapData(
  clusterUid: string,
  namespace: string,
  name: string,
  data: ConfigMapDataReq,
): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/configmaps/${name}/data`, data)
}
