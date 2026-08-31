import type { PageVo } from '@/types/index'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PodDetailVo,
  PodExportQueryForm,
  PodListVo,
  PodMonitorQueryForm,
  PodMonitorVo,
  PodQueryForm,
  PodYamlVo,
} from '@/types/kubernetes/pod'

import { handleEventList } from '@/mock/utils'

import { mockPodDetail, mockPodEventList, mockPodList, mockPodMonitor, mockPodYaml } from './data'

/**
 * 容器组路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/pods                                     - 获取容器组列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name         - 获取容器组详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/yaml    - 获取容器组 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/events  - 获取容器组事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/monitor - 获取容器组监控数据
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name         - 删除/重启容器组
 * - DELETE /kubernetes/clusters/:clusterUid/pods                                     - 批量删除/重启容器组
 * - GET    /kubernetes/clusters/:clusterUid/pods/export                              - 导出容器组
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getPodList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPodDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPodYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getPodEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodMonitorQueryForm> }) =>
      getPodMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/pods/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deletePod(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/pods',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deletePods(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/pods/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodExportQueryForm> }) =>
      exportPod(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取容器组（Pod）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的容器组列表
 */
function getPodList(clusterUid: string, query: Partial<PodQueryForm>): PageVo<PodListVo> {
  console.log('[Mock] getPodList', clusterUid, query)
  const filtered = mockPodList.filter((d: PodListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
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
 * 获取容器组（Pod）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 * @returns 容器组详情
 */
function getPodDetail(clusterUid: string, namespace: string, name: string): PodDetailVo {
  console.log('[Mock] getPodDetail', clusterUid, namespace, name)
  return mockPodDetail
}

/**
 * 获取容器组（Pod）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 * @returns 容器组 YAML
 */
function getPodYaml(clusterUid: string, namespace: string, name: string): PodYamlVo {
  console.log('[Mock] getPodYaml', clusterUid, namespace, name)
  return { yaml: mockPodYaml }
}

/**
 * 获取容器组（Pod）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getPodEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getPodEventList', clusterUid, namespace, name)
  return handleEventList(query, mockPodEventList)
}

/**
 * 获取容器组（Pod）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 * @param query - 监控查询条件
 * @returns 容器组监控数据
 */
function getPodMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodMonitorQueryForm>,
): PodMonitorVo {
  console.log('[Mock] getPodMonitor', clusterUid, namespace, name, query)
  return mockPodMonitor
}

/**
 * 删除/重启容器组（Pod）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 */
function deletePod(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deletePod', clusterUid, namespace, name)
}

/**
 * 批量删除/重启容器组（Pod）
 * @param clusterUid - 集群 UID
 * @param uids - 容器组 UID 数组
 */
function deletePods(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deletePods', clusterUid, uids)
}

/**
 * 导出容器组（Pod）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportPod(clusterUid: string, query: Partial<PodExportQueryForm>): void {
  console.log('[Mock] exportPod', clusterUid, query)
}
