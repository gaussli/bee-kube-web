/**
 * Kubernetes 集群管理 Mock API
 * @module mock/kubernetes/cluster
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterDetailVo,
  ClusterListVo,
  ClusterQueryForm,
  ClusterRegisterForm,
  ClusterExportQueryForm,
  ClusterUpdateForm,
} from '@/types/kubernetes/cluster'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { mockClusterDetail, mockClusterEventList, mockClusterList } from './data'

/**
 * 集群路由配置
 * @remarks
 * - GET /kubernetes/clusters - 获取集群列表
 * - GET /kubernetes/clusters/:uid - 获取集群详情
 * - GET /kubernetes/clusters/:uid/events - 获取集群事件列表
 * - POST /kubernetes/clusters/register - 注册集群
 * - PUT /kubernetes/clusters/:uid - 更新集群
 * - DELETE /kubernetes/clusters/:uid - 删除集群
 * - DELETE /kubernetes/clusters - 批量删除集群
 * - GET /kubernetes/clusters/export - 导出集群
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters',
    handler: ({ params }: { params: Partial<ClusterQueryForm> }): PageVo<ClusterListVo> => getClusterList(params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:uid',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): ClusterDetailVo =>
      getClusterDetail(pathParams.uid),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:uid/events',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<EventQueryForm>
    }): PageVo<EventListVo> => getClusterEventList(pathParams.uid, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/register',
    handler: ({ data }: { data: Partial<ClusterRegisterForm> }): void => registerCluster(data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:uid',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ClusterUpdateForm> }): void =>
      updateCluster(pathParams.uid, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:uid',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void => deleteCluster(pathParams.uid),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters',
    handler: ({ data }: { data: string[] }): void => deleteClusters(data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/export',
    handler: ({ params }: { params: Partial<ClusterExportQueryForm> }): void => exportCluster(params),
  },
]

/**
 * 获取集群列表
 * @param query - 查询参数
 * @returns 分页数据
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
 * 获取集群详情
 * @param uid - 集群 UID
 * @returns 集群详情对象
 */
function getClusterDetail(uid: string): ClusterDetailVo {
  console.log('[Mock] getClusterDetail', uid)
  return mockClusterDetail
}

function getClusterEventList(uid: string, query: Partial<EventQueryForm>): PageVo<EventListVo> {
  console.log('[Mock] getClusterEventList', uid, query)
  const filtered = mockClusterEventList.filter((e: EventListVo) => {
    if (query.type && e.type !== query.type) return false
    return true
  })
  const filteredReason = query.reason ? filtered.filter(p => p.reason?.includes(query.reason as string)) : []
  const filteredNote = query.note ? filtered.filter(p => p.note?.includes(query.note as string)) : []
  const matched = query.reason || query.note ? Array.from(new Set([...filteredReason, ...filteredNote])) : filtered
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
 * 注册集群
 * @param data - 集群注册数据
 */
function registerCluster(data: Partial<ClusterRegisterForm>): void {
  console.log('[Mock] registerCluster', data)
}

/**
 * 更新集群信息
 * @param uid - 集群 UID
 * @param data - 集群更新数据
 */
function updateCluster(uid: string, data: Partial<ClusterUpdateForm>): void {
  console.log('[Mock] updateCluster', uid, data)
}

/**
 * 删除单个集群
 * @param uid - 集群 UID
 */
function deleteCluster(uid: string): void {
  console.log('[Mock] deleteCluster', uid)
}

/**
 * 批量删除集群
 * @param uids - 集群 UID 数组
 */
function deleteClusters(uids: string[]): void {
  console.log('[Mock] deleteClusters', uids)
}

function exportCluster(query: Partial<ClusterExportQueryForm>): void {
  console.log('[Mock] exportCluster', query)
}
