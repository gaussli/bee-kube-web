import request from '@/utils/request'
import type { ClusterQueryReq, ClusterResp, ClusterPageResp } from '@/types'

// 获取集群分页列表
export function getClusterPage(params: ClusterQueryReq) {
  return request.get<ClusterPageResp>('/kubernetes/cluster/page', { params })
}

// 获取集群详情
export function getClusterDetail(id: string) {
  return request.get<ClusterResp>(`/kubernetes/cluster/${id}`)
}

// 创建集群
export function createCluster(data: Partial<ClusterResp>) {
  return request.post<ClusterResp>('/kubernetes/cluster', data)
}

// 更新集群
export function updateCluster(id: string, data: Partial<ClusterResp>) {
  return request.put<ClusterResp>(`/kubernetes/cluster/${id}`, data)
}

// 删除集群
export function deleteCluster(id: string) {
  return request.delete(`/kubernetes/cluster/${id}`)
}

// 批量删除集群
export function batchDeleteCluster(ids: string[]) {
  return request.delete('/kubernetes/cluster/batch', { data: { ids } })
}
