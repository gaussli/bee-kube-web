/**
 * 节点（Node）管理 API
 * @module api/kubernetes/node
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NodeQueryForm,
  NodeListVo,
  NodeTopNQueryForm,
  NodeYamlVo,
  NodeTopologiesForm,
  NodeDetailVo,
  NodeCordonForm,
  NodeTaintsForm,
  NodeMonitorVo,
  NodeMonitorQueryForm,
  NodeExportQueryForm,
} from '@/types/kubernetes/node'

import { request } from '@/utils'

/**
 * 获取节点（Node）TopN 列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 节点 TopN 列表
 */
export function getNodeTopN(clusterUid: string, query: Partial<NodeTopNQueryForm>): Promise<NodeListVo[]> {
  return request.get<NodeListVo[]>(`/kubernetes/clusters/${clusterUid}/nodes/topn`, { params: query })
}

/**
 * 获取节点（Node）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的节点列表
 */
export function getNodeList(clusterUid: string, query: Partial<NodeQueryForm>): Promise<PageVo<NodeListVo>> {
  return request.get<PageVo<NodeListVo>>(`/kubernetes/clusters/${clusterUid}/nodes`, { params: query })
}

/**
 * 获取节点（Node）详情
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns  节点详情
 */
export function getNodeDetail(clusterUid: string, name: string): Promise<NodeDetailVo> {
  return request.get<NodeDetailVo>(`/kubernetes/clusters/${clusterUid}/nodes/${name}`)
}

/**
 * 获取节点（Node）YAML
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 节点 YAML
 */
export function getNodeYaml(clusterUid: string, name: string): Promise<NodeYamlVo> {
  return request.get<NodeYamlVo>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/yaml`)
}

/**
 * 获取节点（Node）事件列表
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getNodeEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/events`, {
    params: query,
  })
}

/**
 * 获取节点（Node）监控数据
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param query - 监控查询条件
 */
export function getNodeMonitor(
  clusterUid: string,
  name: string,
  query: Partial<NodeMonitorQueryForm>,
): Promise<NodeMonitorVo> {
  return request.get<NodeMonitorVo>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/monitor`, {
    params: query,
  })
}

/**
 * 配置节点（Node）标签
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 标签配置请求对象
 */
export function manageNodeLabels(clusterUid: string, name: string, data: MetadataLabelForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/labels`, data)
}

/**
 * 配置节点（Node）注解
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 注解配置请求对象
 */
export function manageNodeAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/annotations`, data)
}

/**
 * 导出节点（Node）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportNode(clusterUid: string, query: Partial<NodeExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/nodes/export`, { params: query })
}

/**
 * 配置节点（Node）污点
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 污点配置请求对象
 */
export function manageNodeTaint(clusterUid: string, name: string, data: NodeTaintsForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/taint`, data)
}

/**
 * 配置节点（Node）拓扑
 * @param clusterUid 集群 UID
 * @param name - 节点名称
 * @param data - 拓扑配置请求对象
 */
export function manageNodeTopology(clusterUid: string, name: string, data: NodeTopologiesForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/topology`, data)
}

/**
 * 封锁/解封节点（Node）
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 封锁/解封配置请求对象
 */
export function cordonNode(clusterUid: string, name: string, data: NodeCordonForm): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/cordon`, data)
}

/**
 * 排空节点（Node）
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 */
export function drainNode(clusterUid: string, name: string): Promise<void> {
  return request.post<void>(`/kubernetes/clusters/${clusterUid}/nodes/${name}/drain`)
}
