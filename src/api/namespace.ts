import request from '@/utils/request'
import type { NamespaceQueryReq, NamespaceResp, NamespacePageResp, NamespaceCreateReq, NamespaceEditReq } from '@/types'

// 获取命名空间分页列表
export function getNamespacePage(params: NamespaceQueryReq) {
  return request.get<NamespacePageResp>('/kubernetes/namespace/page', { params })
}

// 获取命名空间详情
export function getNamespaceDetail(clusterId: string, name: string) {
  return request.get<NamespaceResp>(`/kubernetes/namespace/${clusterId}/${name}`)
}

// 创建命名空间
export function createNamespace(data: NamespaceCreateReq) {
  return request.post<NamespaceResp>('/kubernetes/namespace', data)
}

// 更新命名空间
export function updateNamespace(clusterId: string, name: string, data: NamespaceEditReq) {
  return request.put<NamespaceResp>(`/kubernetes/namespace/${clusterId}/${name}`, data)
}

// 删除命名空间
export function deleteNamespace(clusterId: string, name: string) {
  return request.delete(`/kubernetes/namespace/${clusterId}/${name}`)
}

// 批量删除命名空间
export function batchDeleteNamespace(clusterId: string, names: string[]) {
  return request.delete('/kubernetes/namespace/batch', { data: { clusterId, names } })
}
