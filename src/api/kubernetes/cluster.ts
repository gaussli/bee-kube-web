/**
 * Kubernetes 集群管理 API
 * @module api/kubernetes/cluster
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterDetailVo,
  ClusterListVo,
  ClusterQueryForm,
  ClusterRegisterForm,
  ClusterCreateForm,
  ClusterResourceVo,
} from '@/types/kubernetes/cluster'

import { request } from '@/utils'

/**
 * 获取集群列表
 * @param params - 查询参数
 * @returns 分页后的集群列表
 */
export function getClusterList(params: Partial<ClusterQueryForm>): Promise<PageVo<ClusterListVo>> {
  return request.get<PageVo<ClusterListVo>>('/kubernetes/clusters', { params })
}

/**
 * 获取集群详情
 * @param uid - 集群 UID
 * @returns 集群详情信息
 */
export function getClusterDetail(uid: string): Promise<ClusterDetailVo> {
  return request.get<ClusterDetailVo>(`/kubernetes/clusters/${uid}`)
}

/**
 * 获取集群资源用量
 * @param uid - 集群 UID
 * @returns 集群资源用量信息
 */
export function getClusterResource(uid: string): Promise<ClusterResourceVo> {
  return request.get<ClusterResourceVo>(`/kubernetes/clusters/${uid}/resource`)
}

/**
 * 创建集群
 * @param data - 集群配置信息
 */
export function createCluster(data: Partial<ClusterCreateForm>): Promise<void> {
  return request.post('/kubernetes/clusters', data)
}

/**
 * 注册集群
 * @param data - 集群注册信息
 */
export function registerCluster(data: Partial<ClusterRegisterForm>): Promise<void> {
  return request.post('/kubernetes/clusters/register', data)
}

/**
 * 更新集群
 * @param uid - 集群 UID
 * @param data - 集群配置信息
 */
export function updateCluster(uid: string, data: Partial<ClusterCreateForm>): Promise<void> {
  return request.put(`/kubernetes/clusters/${uid}`, data)
}

/**
 * 删除集群
 * @param uid - 集群 UID
 */
export function deleteCluster(uid: string): Promise<void> {
  return request.delete(`/kubernetes/clusters/${uid}`)
}

/**
 * 批量删除集群
 * @param uids - 集群 UID 数组
 */
export function deleteClusters(uids: string[]): Promise<void> {
  return request.delete('/kubernetes/clusters/batch', { data: uids })
}
