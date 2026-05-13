import { request } from '@/utils'
import type { NodeQueryReq, NodeResp, NodeEditReq, PageResp } from '@/types'

// 获取节点分页列表
export function getNodePage(clusterId: string, params: NodeQueryReq) {
  return request.get<PageResp<NodeResp>>(`/kubernetes/cluster/${clusterId}/nodes`, params)
}

// 获取节点详情
export function getNodeDetail(clusterId: string, name: string) {
  return request.get<NodeResp>(`/kubernetes/cluster/${clusterId}/nodes/${name}`)
}

// 更新节点
export function updateNode(clusterId: string, name: string, data: NodeEditReq) {
  return request.put<NodeResp>(`/kubernetes/cluster/${clusterId}/nodes/${name}`, data)
}

// 驱逐节点上的 Pod
export function drainNode(clusterId: string, name: string) {
  return request.post(`/kubernetes/cluster/${clusterId}/nodes/${name}/drain`)
}

// 设置节点可调度/不可调度
export function cordonNode(clusterId: string, name: string, unschedulable: boolean) {
  return request.post(`/kubernetes/cluster/${clusterId}/nodes/${name}/cordon`, { unschedulable })
}
