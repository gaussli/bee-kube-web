/**
 * StatefulSet 管理 Mock
 * @module mock/kubernetes/workload/statefulset
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  StatefulSetCreateForm,
  StatefulSetDetailVo,
  StatefulSetHistoryRevisionListVo,
  StatefulSetHistoryRevisionQueryForm,
  StatefulSetListVo,
  StatefulSetMonitorVo,
  StatefulSetNetworkVo,
  StatefulSetPartitionForm,
  StatefulSetPodListVo,
  StatefulSetPodQueryForm,
  StatefulSetQueryForm,
  StatefulSetRollbackForm,
  StatefulSetScaleForm,
  StatefulSetUpdateForm,
  StatefulSetYamlVo,
} from '@/types/kubernetes/workload/statefulset'

import {
  statefulSetMockData,
  statefulSetMockDetail,
  statefulSetMockEvents,
  statefulSetMockHistoryRevisions,
  statefulSetMockNetwork,
  statefulSetMockPods,
  statefulSetMockYaml,
} from './statefulsetData'

/**
 * 查看 StatefulSet 列表
 * @param clusterUid 集群 UID
 * @param query StatefulSet 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns StatefulSet 分页列表
 */
function getStatefulSetListMock(clusterUid: string, query: Partial<StatefulSetQueryForm>): PageVo<StatefulSetListVo> {
  console.log('[Mock] getStatefulSetList', clusterUid, query)
  const filtered = statefulSetMockData.filter((d: StatefulSetListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
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
 * 查看 StatefulSet 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 详情响应对象
 */
function getStatefulSetDetailMock(clusterUid: string, namespace: string, name: string): StatefulSetDetailVo {
  console.log('[Mock] getStatefulSetDetail', clusterUid, namespace, name)
  return statefulSetMockDetail
}

/**
 * 查看 StatefulSet YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet YAML 响应对象（完整 YAML 文本）
 */
function getStatefulSetYamlMock(clusterUid: string, namespace: string, name: string): StatefulSetYamlVo {
  console.log('[Mock] getStatefulSetYaml', clusterUid, namespace, name)
  return statefulSetMockYaml
}

/**
 * 查看 StatefulSet 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param query StatefulSet 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态、UID）
 * @returns StatefulSet 关联 Pod 分页列表
 */
function getStatefulSetPodListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetPodQueryForm>,
): PageVo<StatefulSetPodListVo> {
  console.log('[Mock] getStatefulSetPodList', clusterUid, namespace, name, query)
  const filtered = statefulSetMockPods.filter(pod => !query.status || pod.status === query.status)
  const filteredUid = query.uid ? filtered.filter(pod => pod.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(pod => pod.name.includes(query.name as string)) : []
  const filteredIp = query.ip ? filtered.filter(pod => pod.ip.includes(query.ip as string)) : []
  const matched =
    query.uid || query.name || query.ip
      ? Array.from(new Set([...filteredUid, ...filteredName, ...filteredIp]))
      : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const start = (page - 1) * pageSize
  const list = matched.slice(start, start + pageSize)
  return { list, total: matched.length, page, pageSize }
}

/**
 * 查看 StatefulSet 历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param query StatefulSet 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns StatefulSet 历史版本分页列表
 */
function getStatefulSetHistoryRevisionListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetHistoryRevisionQueryForm>,
): PageVo<StatefulSetHistoryRevisionListVo> {
  console.log('[Mock] getStatefulSetHistoryRevisionList', clusterUid, namespace, name, query)
  const matched = statefulSetMockHistoryRevisions.filter(r => {
    if (query.revision && r.revision !== query.revision) return false
    if (query.changeCause && !r.changeCause.includes(query.changeCause as string)) return false
    return true
  })
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const start = (page - 1) * pageSize
  const list = matched.slice(start, start + pageSize)
  return { list, total: matched.length, page, pageSize }
}

/**
 * 查看 StatefulSet 关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
function getStatefulSetNetworkMock(clusterUid: string, namespace: string, name: string): StatefulSetNetworkVo {
  console.log('[Mock] getStatefulSetNetwork', clusterUid, namespace, name)
  return statefulSetMockNetwork
}

/**
 * 查看 StatefulSet 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns StatefulSet 关联事件分页列表
 */
function getStatefulSetEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getStatefulSetEventList', clusterUid, namespace, name, query)
  const matched = statefulSetMockEvents.filter(e => {
    if (query.type && e.type !== query.type) return false
    if (query.reason && !e.reason.includes(query.reason as string)) return false
    if (query.note && !(e.note ?? '').includes(query.note as string)) return false
    if (query.regarding?.name && !(e.regarding?.name ?? '').includes(query.regarding.name as string)) return false
    return true
  })
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const start = (page - 1) * pageSize
  const list = matched.slice(start, start + pageSize)
  return { list, total: matched.length, page, pageSize }
}

/**
 * 查看 StatefulSet 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns StatefulSet 监控响应对象
 */
function getStatefulSetMonitorMock(clusterUid: string, namespace: string, name: string): StatefulSetMonitorVo {
  console.log('[Mock] getStatefulSetMonitor', clusterUid, namespace, name)
  return {}
}

/**
 * 创建 StatefulSet
 * @param clusterUid 集群 UID
 * @param data StatefulSet 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createStatefulSetMock(clusterUid: string, data: Partial<StatefulSetCreateForm>): void {
  console.log('[Mock] createStatefulSet', clusterUid, data)
}

/**
 * YAML 创建 StatefulSet
 * @param clusterUid 集群 UID
 * @param yaml StatefulSet YAML 字符串
 * @returns void
 */
function createStatefulSetYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createStatefulSetYaml', clusterUid, yaml)
}

/**
 * 更新 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateStatefulSetMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
): void {
  console.log('[Mock] updateStatefulSet', clusterUid, namespace, name, data)
}

/**
 * YAML 更新 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param yaml StatefulSet YAML 字符串
 * @returns void
 */
function updateStatefulSetYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateStatefulSetYaml', clusterUid, namespace, name, yaml)
}

/**
 * 管理 StatefulSet 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageStatefulSetLabelMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageStatefulSetLabel', clusterUid, namespace, name, data)
}

/**
 * 管理 StatefulSet 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageStatefulSetAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageStatefulSetAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
function deleteStatefulSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteStatefulSet', clusterUid, namespace, name)
}

/**
 * 批量删除 StatefulSet
 * @param clusterUid 集群 UID
 * @param uids StatefulSet UID 列表
 * @returns void
 */
function deleteStatefulSetsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteStatefulSets', clusterUid, uids)
}

/**
 * 导入 StatefulSet
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
 */
function importStatefulSetMock(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): void {
  console.log('[Mock] importStatefulSet', clusterUid, formData, onProgress)
}

/**
 * 导出 StatefulSet
 * @param clusterUid 集群 UID
 * @param query StatefulSet 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportStatefulSetMock(clusterUid: string, query: Partial<StatefulSetQueryForm>): void {
  console.log('[Mock] exportStatefulSet', clusterUid, query)
}

/**
 * 扩缩容 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 扩缩容请求对象（期望副本数）
 * @returns void
 */
function scaleStatefulSetMock(clusterUid: string, namespace: string, name: string, data: StatefulSetScaleForm): void {
  console.log('[Mock] scaleStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 滚动更新分区 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 滚动更新分区请求对象（分区序号）
 * @returns void
 */
function partitionStatefulSetMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetPartitionForm,
): void {
  console.log('[Mock] partitionStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 重启 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
function restartStatefulSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartStatefulSet', clusterUid, namespace, name)
}

/**
 * 回滚 StatefulSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @param data StatefulSet 回滚请求对象（目标历史版本号）
 * @returns void
 */
function rollbackStatefulSetMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetRollbackForm,
): void {
  console.log('[Mock] rollbackStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 暂停 StatefulSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
function pauseStatefulSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseStatefulSet', clusterUid, namespace, name)
}

/**
 * 恢复 StatefulSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name StatefulSet 名称
 * @returns void
 */
function resumeStatefulSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeStatefulSet', clusterUid, namespace, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/statefulsets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetQueryForm> }) =>
      getStatefulSetListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetPodQueryForm> }) =>
      getStatefulSetPodListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetHistoryRevisionQueryForm> }) =>
      getStatefulSetHistoryRevisionListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/network',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetNetworkMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getStatefulSetEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetMonitorMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StatefulSetCreateForm> }) =>
      createStatefulSetMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createStatefulSetYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StatefulSetUpdateForm> }) =>
      updateStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateStatefulSetYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageStatefulSetLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageStatefulSetAnnotationMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteStatefulSetsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importStatefulSetMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetQueryForm> }) =>
      exportStatefulSetMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/scale',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetScaleForm }) =>
      scaleStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/partition',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetPartitionForm }) =>
      partitionStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetRollbackForm }) =>
      rollbackStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeStatefulSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
