/**
 * Kubernetes 集群管理 Mock API
 * @module mock/kubernetes/cluster
 */
import type { PageVo } from '@/types/index'
import type {
  ClusterDetailVo,
  ClusterListVo,
  ClusterQueryForm,
  ClusterRegisterForm,
  ClusterExportQueryForm,
  ClusterUpdateForm,
} from '@/types/kubernetes/cluster'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { handleEventList } from '@/mock/utils'

import { mockClusterDetail, mockClusterEventList, mockClusterList } from './data'

/**
 * 集群路由配置
 * @remarks
 * - GET    /kubernetes/clusters             - 获取集群列表
 * - GET    /kubernetes/clusters/:uid        - 获取集群详情
 * - GET    /kubernetes/clusters/:uid/events - 获取集群事件列表
 * - POST   /kubernetes/clusters/register    - 纳管集群
 * - PUT    /kubernetes/clusters/:uid        - 更新集群
 * - DELETE /kubernetes/clusters/:uid        - 删除集群
 * - DELETE /kubernetes/clusters             - 批量删除集群
 * - GET    /kubernetes/clusters/export      - 导出集群
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters',
    handler: (ctx: { params: Partial<ClusterQueryForm> }): PageVo<ClusterListVo> => getClusterList(ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:uid',
    handler: (ctx: { pathParams: Record<string, string> }): ClusterDetailVo => getClusterDetail(ctx.pathParams.uid),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:uid/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }): PageVo<EventListVo> =>
      getClusterEventList(ctx.pathParams.uid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/register',
    handler: (ctx: { data: Partial<ClusterRegisterForm> }): void => registerCluster(ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:uid',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterUpdateForm> }): void =>
      updateCluster(ctx.pathParams.uid, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:uid',
    handler: (ctx: { pathParams: Record<string, string> }): void => deleteCluster(ctx.pathParams.uid),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters',
    handler: (ctx: { data: string[] }): void => deleteClusters(ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/export',
    handler: (ctx: { params: Partial<ClusterExportQueryForm> }): void => exportCluster(ctx.params),
  },
]

/**
 * 获取集群（Cluster）列表
 * @param query - 查询条件
 * @returns 分页后的集群列表
 */
function getClusterList(query: Partial<ClusterQueryForm>): PageVo<ClusterListVo> {
  console.log('[Mock] getClusterList', query)
  const filtered = mockClusterList.filter((d: ClusterListVo) => {
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const matched = query.uid || query.name ? Array.from(new Set([...filteredUid, ...filteredName])) : filtered
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
 * 获取集群（Cluster）详情
 * @param uid - 集群 UID
 * @returns 集群详情信息
 */
function getClusterDetail(uid: string): ClusterDetailVo {
  console.log('[Mock] getClusterDetail', uid)
  return mockClusterDetail
}

/**
 * 获取集群（Cluster）事件（Event）列表
 * @param uid - 集群 UID
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getClusterEventList(uid: string, query: Partial<EventQueryForm>): PageVo<EventListVo> {
  console.log('[Mock] getClusterEventList', uid, query)
  return handleEventList(query, mockClusterEventList)
}

/**
 * 纳管集群（Cluster）
 * @param data - 纳管请求对象
 */
function registerCluster(data: Partial<ClusterRegisterForm>): void {
  console.log('[Mock] registerCluster', data)
}

/**
 * 更新集群（Cluster）
 * @param uid - 集群 UID
 * @param data - 更新请求对象
 */
function updateCluster(uid: string, data: Partial<ClusterUpdateForm>): void {
  console.log('[Mock] updateCluster', uid, data)
}

/**
 * 删除集群（Cluster）
 * @param uid - 集群 UID
 */
function deleteCluster(uid: string): void {
  console.log('[Mock] deleteCluster', uid)
}

/**
 * 批量删除集群（Cluster）
 * @param uids - 集群 UID 数组
 */
function deleteClusters(uids: string[]): void {
  console.log('[Mock] deleteClusters', uids)
}

/**
 * 导出集群（Cluster）
 * @param query - 导出查询条件
 */
function exportCluster(query: Partial<ClusterExportQueryForm>): void {
  console.log('[Mock] exportCluster', query)
}
