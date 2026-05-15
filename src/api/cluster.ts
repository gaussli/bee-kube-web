import request from '@/utils/request'
import type { ClusterQueryReq, ClusterReq, ClusterResp, PageResp } from '@/types'

// 获取集群分页列表
export function getClusterPage(params: Partial<ClusterQueryReq>) {
  return request.get<PageResp<ClusterResp>>('/kubernetes/clusters', { params: params })
}

// 获取集群详情
export function getClusterDetail(id: string) {
  return request.get<ClusterResp>(`/kubernetes/clusters/${id}`)
}

// 创建集群
export function createCluster(data: Partial<ClusterReq>) {
  return request.post<string>('/kubernetes/clusters', { data: data })
}

// 更新集群
export function updateCluster(id: string, data: Partial<ClusterReq>) {
  return request.put<string>(`/kubernetes/clusters/${id}`, { data: data })
}

// 删除集群
export function deleteCluster(id: string) {
  return request.delete(`/kubernetes/clusters/${id}`)
}

// 批量删除集群
export function batchDeleteCluster(ids: string[]) {
  return request.delete('/kubernetes/clusters/batch', { data: ids })
}
