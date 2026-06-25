/**
 * Kubernetes 集群管理 API
 * @module api/kubernetes/cluster
 */
import type { PageResp } from '@/types/common'
import type { ClusterDetailResp, ClusterListResp, ClusterQueryReq, ClusterRegistrationReq, ClusterReq } from '@/types/kubernetes/cluster'
import { request } from '@/utils'

/**
 * 获取集群分页列表
 * @param params - 查询参数
 * @returns 分页后的集群列表
 */
export function getClusterPage(params: Partial<ClusterQueryReq>): Promise<PageResp<ClusterListResp>> {
  return request.get<PageResp<ClusterListResp>>('/kubernetes/clusters', { params: params })
}

/**
 * 获取集群详情
 * @param id - 集群 ID
 * @returns 集群详情信息
 */
export function getClusterDetail(id: string): Promise<ClusterDetailResp> {
  return request.get<ClusterDetailResp>(`/kubernetes/clusters/${id}`)
}

/**
 * 创建集群
 * @param data - 集群配置信息
 */
export function createCluster(data: Partial<ClusterReq>): Promise<void> {
  return request.post('/kubernetes/clusters', { data: data })
}

/**
 * 注册集群
 * @param data - 集群注册信息
 */
export function registerCluster(data: Partial<ClusterRegistrationReq>): Promise<void> {
  return request.post('/kubernetes/clusters/register', { data: data })
}

/**
 * 更新集群
 * @param id - 集群 ID
 * @param data - 集群配置信息
 */
export function updateCluster(id: string, data: Partial<ClusterReq>): Promise<void> {
  return request.put(`/kubernetes/clusters/${id}`, { data: data })
}

/**
 * 删除集群
 * @param id - 集群 ID
 */
export function deleteCluster(id: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${id}`)
}

/**
 * 批量删除集群
 * @param ids - 集群 ID 数组
 */
export function deleteClusters(ids: string[]): Promise<void> {
  return request.delete('/kubernetes/clusters/batch', { data: ids })
}
