/**
 * 节点管理 API
 * @module api/node
 */
import { request } from '@/utils'
import type { NodeQueryReq, NodeResp, PageResp, NodeReq, NodeCordonReq } from '@/types'

/**
 * 获取节点分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的节点列表
 */
export function getNodePage(clusterId: string, params: Partial<NodeQueryReq>) {
  return request.get<PageResp<NodeResp>>(`/kubernetes/clusters/${clusterId}/nodes`, { params: params })
}

/**
 * 获取节点详情
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点详情
 */
export function getNodeDetail(clusterId: string, name: string) {
  return request.get<NodeResp>(`/kubernetes/clusters/${clusterId}/nodes/${name}`)
}

/**
 * 更新节点信息
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 更新数据
 * @returns 更新后的节点ID
 */
export function updateNode(clusterId: string, name: string, data: Partial<NodeReq>) {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/nodes/${name}`, { data: data })
}

/**
 * 驱逐节点上的 Pod
 * @param clusterId - 集群ID
 * @param name - 节点名称
 */
export function drainNode(clusterId: string, name: string) {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/drain`)
}

/**
 * 设置节点可调度/不可调度
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 调度配置
 */
export function manageNodeCordon(clusterId: string, name: string, data: NodeCordonReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/cordon`, { data: data })
}
