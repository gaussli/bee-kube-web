/**
 * 节点管理 API
 * @module api/kubernetes/node
 */
import type { PageResp } from '@/types/common'
import type { NodeQueryReq, NodeListResp, NodeReq, NodeCordonReq, NodeLabelsReq, NodeAnnotationsReq, NodeTaintsReq, NodeResourceResp } from '@/types/kubernetes/node'
import { request } from '@/utils'

/**
 * 获取节点分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的节点列表
 */
export function getNodePage(clusterId: string, params: Partial<NodeQueryReq>): Promise<PageResp<NodeListResp>> {
  return request.get<PageResp<NodeListResp>>(`/kubernetes/clusters/${clusterId}/nodes`, params)
}

/**
 * 获取节点详情
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点详情
 */
export function getNodeDetail(clusterId: string, name: string): Promise<NodeListResp> {
  return request.get<NodeListResp>(`/kubernetes/clusters/${clusterId}/nodes/${name}`)
}

/**
 * 获取节点资源用量
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点资源用量数据
 */
export function getNodeResource(clusterId: string, name: string): Promise<NodeResourceResp> {
  return request.get<NodeResourceResp>(`/kubernetes/clusters/${clusterId}/nodes/${name}/resource`)
}

/**
 * 获取节点 TopN 排行
 * @param clusterId - 集群ID
 * @param params - 查询参数（metric 排序指标，count 返回数量）
 * @returns TopN 节点列表
 */
export function getNodeTopN(clusterId: string, params: Partial<{ metric: string; count: number }>): Promise<NodeListResp[]> {
  return request.get<NodeListResp[]>(`/kubernetes/clusters/${clusterId}/nodes/topn`, params)
}

/**
 * 更新节点信息
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 更新数据
 * @returns 更新后的节点ID
 */
export function updateNode(clusterId: string, name: string, data: Partial<NodeReq>): Promise<string> {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/nodes/${name}`, data)
}

/**
 * 驱逐节点上的 Pod
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 驱逐结果
 */
export function drainNode(clusterId: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/drain`)
}

/**
 * 设置节点可调度/不可调度
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 调度配置
 */
export function cordonNode(clusterId: string, name: string, data: NodeCordonReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/cordon`, data)
}

/**
 * 更新节点标签配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 标签配置
 */
export function manageNodeLabels(clusterId: string, name: string, data: Partial<NodeLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/labels`, data)
}

/**
 * 更新节点注解配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 注解配置
 */
export function manageNodeAnnotations(clusterId: string, name: string, data: Partial<NodeAnnotationsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/annotations`, data)
}

/**
 * 更新节点污点配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 污点配置
 */
export function manageNodeTaints(clusterId: string, name: string, data: Partial<NodeTaintsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/taints`, data)
}
