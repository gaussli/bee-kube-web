/**
 * 节点管理 API
 * @module api/kubernetes/node
 */
import type { PageVo } from '@/types/common'
import type {
  NodeQueryForm,
  NodeListResp,
  NodeReq,
  NodeCordonReq,
  NodeLabelsReq,
  NodeAnnotationsReq,
  NodeTaintsReq,
} from '@/types/kubernetes/node'

import { request } from '@/utils'

/**
 * 获取节点 TopN 排行列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数（metric 排序指标、count 返回数量）
 * @returns TopN 节点列表
 */
export function getNodeTopN(
  clusterUid: string,
  params: Partial<{ metric: string; count: number }>,
): Promise<NodeListResp[]> {
  return request.get<NodeListResp[]>(`/kubernetes/clusters/${clusterUid}/nodes/topn`, { params })
}

/**
 * 获取节点列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的节点列表
 */
export function getNodeList(clusterUid: string, params: Partial<NodeQueryForm>): Promise<PageVo<NodeListResp>> {
  return request.get<PageVo<NodeListResp>>(`/kubernetes/clusters/${clusterUid}/nodes`, { params })
}

/**
 * 获取节点详情
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @returns 节点详情
 */
export function getNodeDetail(clusterUid: string, uid: string): Promise<NodeListResp> {
  return request.get<NodeListResp>(`/kubernetes/clusters/${clusterUid}/nodes/${uid}`)
}

/**
 * 获取节点 YAML
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @returns 节点 YAML 配置字符串
 */
export function getNodeYaml(clusterUid: string, uid: string): Promise<string> {
  return request.get<string>(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/yaml`)
}

/**
 * 更新节点信息
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - 更新数据
 * @returns 更新后的节点信息
 */
export function updateNode(clusterUid: string, uid: string, data: Partial<NodeReq>): Promise<string> {
  return request.put<string>(`/kubernetes/clusters/${clusterUid}/nodes/${uid}`, data)
}

/**
 * 更新节点（YAML）
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - YAML 配置字符串
 */
export function updateNodeYaml(clusterUid: string, uid: string, data: string): Promise<void> {
  return request.put(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/yaml`, data)
}

/**
 * 更新节点标签
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - 标签配置
 */
export function manageNodeLabel(clusterUid: string, uid: string, data: Partial<NodeLabelsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/labels`, data)
}

/**
 * 更新节点注解
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - 注解配置
 */
export function manageNodeAnnotation(
  clusterUid: string,
  uid: string,
  data: Partial<NodeAnnotationsReq>,
): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/annotations`, data)
}

/**
 * 导出节点列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 节点 YAML 配置字符串
 */
export function exportNode(clusterUid: string, params: Partial<NodeQueryForm>): Promise<void> {
  return request.download(`/kubernetes/clusters/${clusterUid}/nodes/export`, { params })
}

/**
 * 更新节点污点
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - 污点配置
 */
export function manageNodeTaint(clusterUid: string, uid: string, data: Partial<NodeTaintsReq>): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/taint`, data)
}

/**
 * 驱逐节点
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 */
export function drainNode(clusterUid: string, uid: string): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/drain`)
}

/**
 * 设置节点可调度/不可调度
 * @param clusterUid - 集群 UID
 * @param uid - 节点 UID
 * @param data - 调度配置
 */
export function cordonNode(clusterUid: string, uid: string, data: NodeCordonReq): Promise<void> {
  return request.post(`/kubernetes/clusters/${clusterUid}/nodes/${uid}/cordon`, data)
}
