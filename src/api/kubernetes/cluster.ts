/**
 * 集群（Cluster）管理 API
 * @module api/kubernetes/cluster
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterListVo,
  ClusterDetailVo,
  ClusterQueryForm,
  ClusterRegisterForm,
  ClusterUpdateForm,
} from '@/types/kubernetes/cluster'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取集群（Cluster）列表
 * @param query - 查询参数
 * @returns 分页后的集群列表
 */
export function getClusterList(query: Partial<ClusterQueryForm>): Promise<PageVo<ClusterListVo>> {
  return request.get<PageVo<ClusterListVo>>('/kubernetes/clusters', { params: query })
}

/**
 * 获取集群（Cluster）详情
 * @param uid - 集群 UID
 * @returns 集群详情信息
 */
export function getClusterDetail(uid: string): Promise<ClusterDetailVo> {
  return request.get<ClusterDetailVo>(`/kubernetes/clusters/${uid}`)
}

/**
 * 获取集群（Cluster）事件列表
 * @param uid - 集群 UID
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getClusterEventList(uid: string, query: Partial<EventQueryForm>): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${uid}/events`, {
    params: query,
  })
}

/**
 * 纳管集群（Cluster）
 * @param data - 纳管请求对象
 */
export function registerCluster(data: Partial<ClusterRegisterForm>): Promise<void> {
  return request.post<void>('/kubernetes/clusters/register', data)
}

/**
 * 更新集群
 * @param uid - 集群 UID
 * @param data - 更新请求对象
 */
export function updateCluster(uid: string, data: Partial<ClusterUpdateForm>): Promise<void> {
  return request.put<void>(`/kubernetes/clusters/${uid}`, data)
}

/**
 * 删除集群（Cluster）
 * @param uid - 集群 UID
 */
export function deleteCluster(uid: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${uid}`)
}

/**
 * 批量删除集群
 * @param uids - 集群 UID 数组
 */
export function deleteClusters(uids: string[]): Promise<void> {
  return request.delete<void>('/kubernetes/clusters', { data: uids })
}
