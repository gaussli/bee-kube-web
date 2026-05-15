import { request } from '@/utils'
import type { NodeQueryReq, NodeResp, NodeEditReq, PageResp } from '@/types'

// 获取节点分页列表
export function getNodePage(clusterId: string, params: Partial<NodeQueryReq>) {
  return request.get<PageResp<NodeResp>>(`/kubernetes/clusters/${clusterId}/nodes`, { params: params })
}

// 获取节点详情
export function getNodeDetail(clusterId: string, name: string) {
  return request.get<NodeResp>(`/kubernetes/clusters/${clusterId}/nodes/${name}`)
}

// 更新节点
export function updateNode(clusterId: string, name: string, data: Partial<NodeEditReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/nodes/${name}`, { data: data })
}

// 驱逐节点上的 Pod
export function drainNode(clusterId: string, name: string) {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/drain`)
}

// 设置节点可调度/不可调度
export function cordonNode(clusterId: string, name: string, unschedulable: boolean) {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/cordon`, { unschedulable })
}
