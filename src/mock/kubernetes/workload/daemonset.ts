/**
 * DaemonSet 管理 Mock
 * @module mock/kubernetes/workload/daemonset
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  DaemonSetCreateForm,
  DaemonSetDetailVo,
  DaemonSetHistoryRevisionListVo,
  DaemonSetHistoryRevisionQueryForm,
  DaemonSetListVo,
  DaemonSetMonitorVo,
  DaemonSetNetworkVo,
  DaemonSetQueryForm,
  DaemonSetRollbackForm,
  DaemonSetUpdateForm,
  DaemonSetYamlVo,
} from '@/types/kubernetes/workload/daemonset'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'

import { generateId } from '@/mock/utils'

import {
  daemonSetMockData,
  daemonSetMockDetail,
  daemonSetMockEvents,
  daemonSetMockHistoryRevisions,
  daemonSetMockNetwork,
  daemonSetMockPods,
  daemonSetMockYaml,
} from './daemonsetData'

/**
 * 查看 DaemonSet 列表
 * @param clusterUid 集群 UID
 * @param query DaemonSet 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns DaemonSet 分页列表
 */
function getDaemonSetListMock(clusterUid: string, query: Partial<DaemonSetQueryForm>): PageVo<DaemonSetListVo> {
  console.log('[Mock] getDaemonSetList', clusterUid, query)
  const filtered = daemonSetMockData.filter((d: DaemonSetListVo) => {
    if (d.clusterUid !== clusterUid) return false
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
 * 查看 DaemonSet 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns DaemonSet 详情响应对象
 */
function getDaemonSetDetailMock(clusterUid: string, namespace: string, name: string): DaemonSetDetailVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetDetail', clusterUid, namespace, name)
  return daemonSetMockDetail
}

/**
 * 查看 DaemonSet YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns DaemonSet YAML 响应对象（完整 YAML 文本）
 */
function getDaemonSetYamlMock(clusterUid: string, namespace: string, name: string): DaemonSetYamlVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetYaml', clusterUid, namespace, name)
  return daemonSetMockYaml
}

/**
 * 查看 DaemonSet 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param query DaemonSet 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态、UID）
 * @returns DaemonSet 关联 Pod 分页列表
 */
function getDaemonSetPodListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetPodList', clusterUid, namespace, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return { list: daemonSetMockPods, total: daemonSetMockPods.length, page, pageSize }
}

/**
 * 查看 DaemonSet 历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param query DaemonSet 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns DaemonSet 历史版本分页列表
 */
function getDaemonSetHistoryRevisionListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DaemonSetHistoryRevisionQueryForm>,
): PageVo<DaemonSetHistoryRevisionListVo> {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetHistoryRevisionList', clusterUid, namespace, name, query)
  const matched = daemonSetMockHistoryRevisions.filter(r => {
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
 * 查看 DaemonSet 关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns DaemonSet 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
function getDaemonSetNetworkMock(clusterUid: string, namespace: string, name: string): DaemonSetNetworkVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetNetwork', clusterUid, namespace, name)
  return daemonSetMockNetwork
}

/**
 * 查看 DaemonSet 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns DaemonSet 关联事件分页列表
 */
function getDaemonSetEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getDaemonSetEventList', clusterUid, namespace, name, query)
  const matched = daemonSetMockEvents.filter(e => {
    if (query.type && e.type !== query.type) return false
    if (query.reason && !(e.reason ?? '').includes(query.reason as string)) return false
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
 * 查看 DaemonSet 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns DaemonSet 监控响应对象
 */
function getDaemonSetMonitorMock(clusterUid: string, namespace: string, name: string): DaemonSetMonitorVo {
  void clusterUid
  void namespace
  console.log('[Mock] getDaemonSetMonitor', clusterUid, namespace, name)
  return {}
}

/**
 * 创建 DaemonSet
 * @param clusterUid 集群 UID
 * @param data DaemonSet 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createDaemonSetMock(clusterUid: string, data: Partial<DaemonSetCreateForm>): void {
  console.log('[Mock] createDaemonSet', clusterUid, data)
  const newItem: DaemonSetListVo = {
    uid: generateId(),
    clusterUid,
    cluster: 'system-cluster',
    namespaceUid: `ns-${data?.namespace || 'default'}`,
    namespace: data?.namespace || 'default',
    name: data?.name || 'new-daemonset',
    description: data?.description,
    status: 'Creating',
    statusMsg: '创建中',
    desiredNumberScheduled: 0,
    numberReady: 0,
    updateStrategyType: data?.spec?.updateStrategy?.type || 'RollingUpdate',
    createAt: new Date().toISOString(),
    createBy: 'admin',
    updateAt: new Date().toISOString(),
    updateBy: 'admin',
    deletable: true,
  }
  daemonSetMockData.push(newItem)
}

/**
 * YAML 创建 DaemonSet
 * @param clusterUid 集群 UID
 * @param yaml DaemonSet YAML 字符串
 * @returns void
 */
function createDaemonSetYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createDaemonSetYaml', clusterUid, yaml)
}

/**
 * 更新 DaemonSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param data DaemonSet 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateDaemonSetMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DaemonSetUpdateForm>,
): void {
  console.log('[Mock] updateDaemonSet', clusterUid, namespace, name, data)
  const item = daemonSetMockData.find(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (item && data.description !== undefined) {
    item.description = data.description
  }
}

/**
 * YAML 更新 DaemonSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param yaml DaemonSet YAML 字符串
 * @returns void
 */
function updateDaemonSetYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateDaemonSetYaml', clusterUid, namespace, name, yaml)
}

/**
 * 管理 DaemonSet 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageDaemonSetLabelMock(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageDaemonSetLabel', clusterUid, namespace, name, data)
}

/**
 * 管理 DaemonSet 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageDaemonSetAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageDaemonSetAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 DaemonSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns void
 */
function deleteDaemonSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDaemonSet', clusterUid, namespace, name)
  const index = daemonSetMockData.findIndex(
    d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name,
  )
  if (index > -1) {
    daemonSetMockData.splice(index, 1)
  }
}

/**
 * 批量删除 DaemonSet
 * @param clusterUid 集群 UID
 * @param uids DaemonSet UID 列表
 * @returns void
 */
function deleteDaemonSetsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteDaemonSets', clusterUid, uids)
  for (const uid of uids) {
    const index = daemonSetMockData.findIndex(d => d.clusterUid === clusterUid && d.uid === uid)
    if (index > -1) {
      daemonSetMockData.splice(index, 1)
    }
  }
}

/**
 * 导入 DaemonSet
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
 */
function importDaemonSetMock(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): void {
  void formData
  void onProgress
  console.log('[Mock] importDaemonSet', clusterUid)
}

/**
 * 导出 DaemonSet
 * @param clusterUid 集群 UID
 * @param query DaemonSet 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportDaemonSetMock(clusterUid: string, query: Partial<DaemonSetQueryForm>): void {
  console.log('[Mock] exportDaemonSet', clusterUid, query)
}

/**
 * 重启 DaemonSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns void
 */
function restartDaemonSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDaemonSet', clusterUid, namespace, name)
}

/**
 * 回滚 DaemonSet
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @param data DaemonSet 回滚请求对象（目标历史版本号）
 * @returns void
 */
function rollbackDaemonSetMock(clusterUid: string, namespace: string, name: string, data: DaemonSetRollbackForm): void {
  console.log('[Mock] rollbackDaemonSet', clusterUid, namespace, name, data)
}

/**
 * 暂停 DaemonSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns void
 */
function pauseDaemonSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseDaemonSet', clusterUid, namespace, name)
}

/**
 * 恢复 DaemonSet 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name DaemonSet 名称
 * @returns void
 */
function resumeDaemonSetMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeDaemonSet', clusterUid, namespace, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetQueryForm> }) =>
      getDaemonSetListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getDaemonSetPodListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetHistoryRevisionQueryForm> }) =>
      getDaemonSetHistoryRevisionListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/network',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetNetworkMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getDaemonSetEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetMonitorMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DaemonSetCreateForm> }) =>
      createDaemonSetMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createDaemonSetYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DaemonSetUpdateForm> }) =>
      updateDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateDaemonSetYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageDaemonSetLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageDaemonSetAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteDaemonSetsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importDaemonSetMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetQueryForm> }) =>
      exportDaemonSetMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: DaemonSetRollbackForm }) =>
      rollbackDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeDaemonSetMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
