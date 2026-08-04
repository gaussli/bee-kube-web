/**
 * CRD 资源相关 API
 * @module api/kubernetes/customResourceDefinition
 */
import type { PageVo } from '@/types/common'
import type { CrdResp, CrdQueryReq, CrdLabelsReq, CrdAnnotationsReq } from '@/types/kubernetes/crd'

import request from '@/utils/request'

/**
 * 获取 CRD 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns CRD 分页列表
 */
export function getCrdPage(clusterId: string, params: Partial<CrdQueryReq>): Promise<PageVo<CrdResp>> {
  return request.get(`/kubernetes/clusters/${clusterId}/crds`, {
    params,
  })
}

/**
 * 获取 CRD 详情
 * @param clusterId - 集群 ID
 * @param name - CRD 名称
 * @returns CRD 详情
 */
export function getCrdDetail(clusterId: string, name: string): Promise<CrdResp> {
  return request.get(`/kubernetes/clusters/${clusterId}/crds/${name}`)
}

/**
 * 更新 CRD 标签
 * @param clusterId - 集群 ID
 * @param name - CRD 名称
 * @param data - 标签更新参数
 */
export function manageCrdLabels(clusterId: string, name: string, data: Partial<CrdLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/crds/${name}/labels`, { data })
}

/**
 * 更新 CRD 注解
 * @param clusterId - 集群 ID
 * @param name - CRD 名称
 * @param data - 注解更新参数
 */
export function manageCrdAnnotations(clusterId: string, name: string, data: Partial<CrdAnnotationsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/crds/${name}/annotations`, { data })
}

/**
 * 删除 CRD
 * @param clusterId - 集群 ID
 * @param name - CRD 名称
 */
export function deleteCrd(clusterId: string, name: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/crds/${name}`)
}

/**
 * 批量删除 CRD
 * @param clusterId - 集群 ID
 * @param data - 批量删除参数
 * @param data.names - 待删除的 CRD 名称列表
 */
export function deleteCrds(clusterId: string, data: { names: string[] }): Promise<void> {
  return request.delete(`/kubernetes/clusters/${clusterId}/crds`, {
    data,
  })
}
