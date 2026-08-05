/**
 * Kubernetes 事件 API
 * @module api/kubernetes/event
 */
import type { PageVo } from '@/types/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { request } from '@/utils'

/**
 * 获取集群事件分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页后的事件列表
 */
export function getEventList(clusterUid: string, params: Partial<EventQueryForm>): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(`/kubernetes/clusters/${clusterUid}/events`, params)
}
