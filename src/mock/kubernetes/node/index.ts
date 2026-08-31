import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NodeCordonForm,
  NodeDetailVo,
  NodeExportQueryForm,
  NodeListVo,
  NodeMonitorQueryForm,
  NodeMonitorVo,
  NodeQueryForm,
  NodeTaintsForm,
  NodeTopNQueryForm,
  NodeTopologiesForm,
  NodeYamlVo,
} from '@/types/kubernetes/node'

import { handleEventList } from '@/mock/utils'

import { mockNodeDetail, mockNodeEventList, mockNodeList, mockNodeMonitor, mockNodeYaml } from './data'

/**
 * 节点路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/nodes                   - 获取节点列表
 * - GET    /kubernetes/clusters/:clusterUid/nodes/topn              - 获取节点 TopN 列表
 * - GET    /kubernetes/clusters/:clusterUid/nodes/:name             - 获取节点详情
 * - GET    /kubernetes/clusters/:clusterUid/nodes/:name/yaml        - 获取节点 YAML
 * - GET    /kubernetes/clusters/:clusterUid/nodes/:name/events      - 获取节点事件列表
 * - GET    /kubernetes/clusters/:clusterUid/nodes/:name/monitor     - 获取节点监控数据
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/labels      - 配置节点标签
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/annotations - 配置节点注解
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/taint       - 配置节点污点
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/topology    - 配置节点拓扑
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/cordon      - 封锁/解封节点
 * - POST   /kubernetes/clusters/:clusterUid/nodes/:name/drain       - 排空节点
 * - GET    /kubernetes/clusters/:clusterUid/nodes/export            - 导出节点
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NodeQueryForm> }) =>
      getNodeList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/topn',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NodeTopNQueryForm> }) =>
      getNodeTopN(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNodeDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNodeYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNodeEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NodeMonitorQueryForm> }) =>
      getNodeMonitor(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNodeLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNodeAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/taint',
    handler: (ctx: { pathParams: Record<string, string>; data: NodeTaintsForm }) =>
      manageNodeTaint(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/topology',
    handler: (ctx: { pathParams: Record<string, string>; data: NodeTopologiesForm }) =>
      manageNodeTopology(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/cordon',
    handler: (ctx: { pathParams: Record<string, string>; data: NodeCordonForm }) =>
      cordonNode(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/nodes/:name/drain',
    handler: (ctx: { pathParams: Record<string, string> }) => drainNode(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/nodes/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NodeExportQueryForm> }) =>
      exportNode(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取节点（Node）TopN 列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 节点 TopN 列表
 */
function getNodeTopN(clusterUid: string, query: Partial<NodeTopNQueryForm>): NodeListVo[] {
  console.log('[Mock] getNodeTopN', clusterUid, query)
  return mockNodeList.slice(0, query.n)
}

/**
 * 获取节点（Node）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的节点列表
 */
function getNodeList(clusterUid: string, query: Partial<NodeQueryForm>): PageVo<NodeListVo> {
  console.log('[Mock] getNodeList', clusterUid, query)
  const filtered = mockNodeList.filter((d: NodeListVo) => {
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const filteredIp = query.ip ? filtered.filter(d => d.ip.includes(query.ip as string)) : []
  const matched =
    query.uid || query.name || query.ip
      ? Array.from(new Set([...filteredUid, ...filteredName, ...filteredIp]))
      : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}

/**
 * 获取节点（Node）详情
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 节点详情
 */
function getNodeDetail(clusterUid: string, name: string): NodeDetailVo {
  console.log('[Mock] getNodeDetail', clusterUid, name)
  return mockNodeDetail
}

/**
 * 获取节点（Node）YAML
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @returns 节点 YAML
 */
function getNodeYaml(clusterUid: string, name: string): NodeYamlVo {
  console.log('[Mock] getNodeYaml', clusterUid, name)
  return { yaml: mockNodeYaml }
}

/**
 * 获取节点（Node）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getNodeEventList(clusterUid: string, name: string, query: Partial<EventQueryForm>): PageVo<EventListVo> {
  console.log('[Mock] getNodeEventList', clusterUid, name, query)
  return handleEventList(query, mockNodeEventList)
}

/**
 * 获取节点（Node）监控数据
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param query - 监控查询条件
 * @returns 节点监控数据
 */
function getNodeMonitor(clusterUid: string, name: string, query: Partial<NodeMonitorQueryForm>): NodeMonitorVo {
  console.log('[Mock] getNodeMonitor', clusterUid, name, query)
  return mockNodeMonitor
}

/**
 * 配置节点（Node）标签
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 标签配置请求对象
 */
function manageNodeLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageNodeLabels', clusterUid, name, data)
}

/**
 * 配置节点（Node）注解
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 注解配置请求对象
 */
function manageNodeAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageNodeAnnotations', clusterUid, name, data)
}

/**
 * 导出节点（Node）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportNode(clusterUid: string, query: Partial<NodeExportQueryForm>): void {
  console.log('[Mock] exportNode', clusterUid, query)
}

/**
 * 配置节点（Node）污点
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 污点配置请求对象
 */
function manageNodeTaint(clusterUid: string, name: string, data: NodeTaintsForm): void {
  console.log('[Mock] manageNodeTaint', clusterUid, name, data)
}

/**
 * 配置节点（Node）拓扑
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 拓扑配置请求对象
 */
function manageNodeTopology(clusterUid: string, name: string, data: NodeTopologiesForm): void {
  console.log('[Mock] manageNodeTopology', clusterUid, name, data)
}

/**
 * 封锁/解封节点（Node）
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 * @param data - 封锁/解封配置请求对象
 */
function cordonNode(clusterUid: string, name: string, data: NodeCordonForm): void {
  console.log('[Mock] cordonNode', clusterUid, name, data)
}

/**
 * 排空节点（Node）
 * @param clusterUid - 集群 UID
 * @param name - 节点名称
 */
function drainNode(clusterUid: string, name: string): void {
  console.log('[Mock] drainNode', clusterUid, name)
}
