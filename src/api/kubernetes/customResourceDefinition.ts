/**
 * CRD 资源相关 API
 * @module api/kubernetes/customResourceDefinition
 */
import type { PageVo } from '@/types/common'
import type { CrdResp, CrdQueryReq, CrdLabelsReq, CrdAnnotationsReq } from '@/types/kubernetes/crd'

import request from '@/utils/request'

/**
 * 获取 CRD 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns CRD 分页列表
 */
export function getCrdPage(clusterUid: string, params: Partial<CrdQueryReq>): Promise<PageVo<CrdResp>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/crds`, {
    params,
  })
}

/**
 * 获取 CRD 详情
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @returns CRD 详情
 */
export function getCrdDetail(clusterUid: string, name: string): Promise<CrdResp> {
  return request.get(`/kubernetes/clusters/${clusterUid}/crds/${name}`)
}

/**
 * 更新 CRD 标签
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @param data - 标签更新参数
 */
export function manageCrdLabels(clusterUid: string, name: string, data: Partial<CrdLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/crds/${name}/labels`, { data })
}

/**
 * 更新 CRD 注解
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @param data - 注解更新参数
 */
export function manageCrdAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<CrdAnnotationsReq>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/crds/${name}/annotations`, { data })
}

/**
 * 删除 CRD
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 */
export function deleteCrd(clusterUid: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/crds/${name}`)
}

/**
 * 批量删除 CRD
 * @param clusterUid - 集群 UID
 * @param data - 批量删除参数
 * @param data.names - 待删除的 CRD 名称列表
 */
export function deleteCrds(clusterUid: string, data: { names: string[] }): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterUid}/crds`, {
    data,
  })
}
