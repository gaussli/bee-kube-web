/**
 * Pod 管理 API
 * @module api/kubernetes/pod
 */
import type { PageVo } from '@/types/common'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import { request } from '@/utils'

/**
 * 获取 Pod 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns Pod 分页列表
 */
export function getPodList(clusterUid: string, params: Partial<PodQueryForm>): Promise<PageVo<PodListVo>> {
  return request.get(`/kubernetes/clusters/${clusterUid}/pods`, params)
}
