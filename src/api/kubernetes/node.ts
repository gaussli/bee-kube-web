/**
 * 节点管理 API
 * @module api/kubernetes/node
 */
import type { PageVo } from '@/types/common'
import type {
  NodeQueryReq,
  NodeListResp,
  NodeReq,
  NodeCordonReq,
  NodeLabelsReq,
  NodeAnnotationsReq,
  NodeTaintsReq,
  NodeResourceVo,
} from '@/types/kubernetes/node'

import { request } from '@/utils'

/**
 * 获取节点分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的节点列表
 */
export function getNodePage(clusterUid: string, params: Partial<NodeQueryReq>): Promise<PageVo<NodeListResp>> {
  return request.get<PageVo<NodeListResp>>(`/kubernetes/clusters/${clusterUid}/nodes`, { params })
}

/**
 * 获取节点详情
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 节点详情
 */
export function getNodeDetail(clusterUid: string, name: string): Promise<NodeListResp> {
  return request.get<NodeListResp>(`/kubernetes/clusters/${clusterUid}/nodes/${name}`)
}

/**
 * 获取节点资源用量
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 节点资源用量数据
 */
export function getNodeResource(clusterUid: string, name: string): Promise<NodeResourceVo> {
  return request.get<NodeResourceVo>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/resource`)
}

/**
 * 获取节点 TopN 排行
 * @param clusterUid - 集群 UID
 * @param params - 查询参数（metric 排序指标，count 返回数量）
 * @returns TopN 节点列表
 */
export function getNodeTopN(
  clusterUid: string,
  params: Partial<{ metric: string; count: number }>,
): Promise<NodeListResp[]> {
  return request.get<NodeListResp[]>(`/kubernetes/clusters/${clusterUid}/nodes/topn`, params)
}

/**
 * 更新节点信息
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 更新数据
 * @returns 更新后的节点ID
 */
export function updateNode(clusterUid: string, name: string, data: Partial<NodeReq>): Promise<string> {
  return request.put<string>(`/kubernetes/clusters/${clusterUid}/nodes/${name}`, data)
}

/**
 * 驱逐节点上的 Pod
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 驱逐结果
 */
export function drainNode(clusterUid: string, name: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${name}/drain`)
}

/**
 * 设置节点可调度/不可调度
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 调度配置
 */
export function cordonNode(clusterUid: string, name: string, data: NodeCordonReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${name}/cordon`, data)
}

/**
 * 更新节点标签配置
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 标签配置
 */
export function manageNodeLabels(clusterUid: string, name: string, data: Partial<NodeLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${name}/labels`, data)
}

/**
 * 更新节点注解配置
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 注解配置
 */
export function manageNodeAnnotations(
  clusterUid: string,
  name: string,
  data: Partial<NodeAnnotationsReq>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${name}/annotations`, data)
}

/**
 * 更新节点污点配置
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 污点配置
 */
export function manageNodeTaints(clusterUid: string, name: string, data: Partial<NodeTaintsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${name}/taints`, data)
}
