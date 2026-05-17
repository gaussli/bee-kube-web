/**
 * 节点管理 API
 * @module api/kubernetes/node
 */
import type { PageResp } from '@/types/common'
import type { NodeQueryReq, NodeResp, NodeReq, NodeCordonReq, NodeLabelsReq, NodeAnnotationsReq, NodeTaintsReq } from '@/types/kubernetes/node'
import { request } from '@/utils'

/**
 * 获取节点分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页后的节点列表
 */
export function getNodePage(clusterId: string, params: Partial<NodeQueryReq>): Promise<PageResp<NodeResp>> {
  return request.get<PageResp<NodeResp>>(`/kubernetes/clusters/${clusterId}/nodes`, { params: params })
}

/**
 * 获取节点详情
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点详情
 */
export function getNodeDetail(clusterId: string, name: string): Promise<NodeResp> {
  return request.get<NodeResp>(`/kubernetes/clusters/${clusterId}/nodes/${name}`)
}

/**
 * 更新节点信息
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 更新数据
 * @returns 更新后的节点ID
 */
export function updateNode(clusterId: string, name: string, data: Partial<NodeReq>): Promise<string> {
  return request.put<string>(`/kubernetes/clusters/${clusterId}/nodes/${name}`, { data: data })
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
export function cordonNode(clusterId: string, name: string, data: Partial<NodeCordonReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/cordon`, { data: data })
}

/**
 * 更新节点标签配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 标签配置
 */
export function manageNodeLabels(clusterId: string, name: string, data: Partial<NodeLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/labels`, { data: data })
}

/**
 * 更新节点注解配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 注解配置
 */
export function manageNodeAnnotations(clusterId: string, name: string, data: Partial<NodeAnnotationsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/annotations`, { data: data })
}

/**
 * 更新节点污点配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 污点配置
 */
export function manageNodeTaints(clusterId: string, name: string, data: Partial<NodeTaintsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterId}/nodes/${name}/taints`, { data: data })
}
