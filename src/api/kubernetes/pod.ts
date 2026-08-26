/**
 * 容器组（Pod）管理 API
 * @module api/kubernetes/pod
 */
import type { PageVo } from '@/types/common'
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

import { request } from '@/utils'

/**
 * 获取容器组（Pod）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的容器组列表
 */
export function getPodList(clusterUid: string, query: Partial<PodQueryForm>): Promise<PageVo<PodListVo>> {
  return request.get<PageVo<PodListVo>>(`/kubernetes/clusters/${clusterUid}/pods`, { params: query })
}

/**
 * 获取容器组（Pod）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 容器组名称
 * @returns 容器组详情
 */
export function getPodDetail(clusterUid: string, namespace: string, name: string): Promise<PodDetailVo> {
  return request.get<PodDetailVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/${name}`)
}

/**
 * 查看 Pod YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Pod 名称
 * @returns Pod YAML
 */
export function getPodYaml(clusterUid: string, namespace: string, name: string): Promise<PodYamlVo> {
  return request.get<PodYamlVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/${name}/yaml`)
}

/**
 * 获取 Pod 事件列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Pod 名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getPodEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): Promise<PageVo<EventListVo>> {
  return request.get<PageVo<EventListVo>>(
    `/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/${name}/events`,
    {
      params: query,
    },
  )
}

/**
 * 获取 Pod 监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Pod 名称
 * @param query - 监控查询条件
 */
export function getPodMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodMonitorQueryForm>,
): Promise<PodMonitorVo> {
  return request.get<PodMonitorVo>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/${name}/monitor`, {
    params: query,
  })
}

/**
 * 删除/重启 Pod
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Pod 名称
 */
export function deletePod(clusterUid: string, namespace: string, name: string): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/${name}`)
}

/**
 * 批量删除/重启 Pod
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param uids - Pod UID 列表
 */
export function deletePods(clusterUid: string, namespace: string, uids: string[]): Promise<void> {
  return request.delete<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods`, {
    data: uids,
  })
}

/**
 * 导出 Pod
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param query - 导出查询条件
 */
export function exportPod(clusterUid: string, namespace: string, query: Partial<PodExportQueryForm>): Promise<void> {
  return request.download<void>(`/kubernetes/clusters/${clusterUid}/namespaces/${namespace}/pods/export`, {
    params: query,
  })
}
