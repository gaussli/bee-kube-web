import request from '@/utils/request'
import type { NodeQueryReq, NodeResp, NodePageResp, NodeEditReq } from '@/types'

// 获取节点分页列表
export function getNodePage(params: NodeQueryReq) {
  return request.get<NodePageResp>('/kubernetes/node/page', { params })
}

// 获取节点详情
export function getNodeDetail(clusterId: string, name: string) {
  return request.get<NodeResp>(`/kubernetes/node/${clusterId}/${name}`)
}

// 更新节点
export function updateNode(clusterId: string, name: string, data: NodeEditReq) {
  return request.put<NodeResp>(`/kubernetes/node/${clusterId}/${name}`, data)
}

// 驱逐节点上的 Pod
export function drainNode(clusterId: string, name: string) {
  return request.post(`/kubernetes/node/${clusterId}/${name}/drain`)
}

// 设置节点可调度/不可调度
export function cordonNode(clusterId: string, name: string, unschedulable: boolean) {
  return request.post(`/kubernetes/node/${clusterId}/${name}/cordon`, { unschedulable })
}
