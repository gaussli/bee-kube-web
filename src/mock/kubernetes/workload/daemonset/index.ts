import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DaemonSetCreateForm,
  DaemonSetDetailVo,
  DaemonSetExportQueryForm,
  DaemonSetHistoryRevisionListVo,
  DaemonSetHistoryRevisionQueryForm,
  DaemonSetListVo,
  DaemonSetMonitorQueryForm,
  DaemonSetMonitorVo,
  DaemonSetNetworkVo,
  DaemonSetQueryForm,
  DaemonSetRollbackForm,
  DaemonSetUpdateForm,
  DaemonSetYamlVo,
} from '@/types/kubernetes/workload/daemonset'

import { handleEventList } from '@/mock/utils'

import {
  mockDaemonSetDetail,
  mockDaemonSetEventList,
  mockDaemonSetHistoryRevisionList,
  mockDaemonSetList,
  mockDaemonSetMonitor,
  mockDaemonSetNetwork,
  mockDaemonSetPodList,
  mockDaemonSetYaml,
} from './data'

/**
 * 守护进程集路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/daemonsets                                         - 获取守护进程集列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name             - 获取守护进程集详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml        - 获取守护进程集 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pods        - 获取关联 Pod 列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/history     - 获取历史版本列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/network     - 获取关联网络资源
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/events      - 获取事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/monitor     - 获取监控数据
 * - POST   /kubernetes/clusters/:clusterUid/daemonsets                                         - 创建守护进程集
 * - POST   /kubernetes/clusters/:clusterUid/daemonsets/yaml                                    - 创建守护进程集（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name             - 更新守护进程集
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml        - 更新守护进程集（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels      - 配置标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations - 配置注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name             - 删除守护进程集
 * - DELETE /kubernetes/clusters/:clusterUid/daemonsets                                         - 批量删除守护进程集
 * - POST   /kubernetes/clusters/:clusterUid/daemonsets/import                                  - 导入守护进程集
 * - GET    /kubernetes/clusters/:clusterUid/daemonsets/export                                  - 导出守护进程集
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart     - 重启守护进程集
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/rollback    - 回滚守护进程集
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pause       - 暂停更新
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/resume      - 恢复更新
 */

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetQueryForm> }) =>
      getDaemonSetList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDaemonSetYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getDaemonSetPodList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetHistoryRevisionQueryForm> }) =>
      getDaemonSetHistoryRevisionList(
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
      getDaemonSetNetwork(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getDaemonSetEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetMonitorQueryForm> }) =>
      getDaemonSetMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DaemonSetCreateForm> }) =>
      createDaemonSet(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createDaemonSetYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DaemonSetUpdateForm> }) =>
      updateDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateDaemonSetYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageDaemonSetLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageDaemonSetAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteDaemonSets(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importDaemonSet(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DaemonSetExportQueryForm> }) =>
      exportDaemonSet(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: DaemonSetRollbackForm }) =>
      rollbackDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeDaemonSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取守护进程集（DaemonSet）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的守护进程集列表
 */
function getDaemonSetList(clusterUid: string, query: Partial<DaemonSetQueryForm>): PageVo<DaemonSetListVo> {
  console.log('[Mock] getDaemonSetList', clusterUid, query)
  const filtered = mockDaemonSetList.filter((d: DaemonSetListVo) => {
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
 * 获取守护进程集（DaemonSet）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 守护进程集详情
 */
function getDaemonSetDetail(clusterUid: string, namespace: string, name: string): DaemonSetDetailVo {
  console.log('[Mock] getDaemonSetDetail', clusterUid, namespace, name)
  return mockDaemonSetDetail
}

/**
 * 获取守护进程集（DaemonSet）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 守护进程集 YAML
 */
function getDaemonSetYaml(clusterUid: string, namespace: string, name: string): DaemonSetYamlVo {
  console.log('[Mock] getDaemonSetYaml', clusterUid, namespace, name)
  return { yaml: mockDaemonSetYaml }
}

/**
 * 获取守护进程集（DaemonSet）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页后的容器组（Pod）列表
 */
function getDaemonSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  console.log('[Mock] getDaemonSetPodList', clusterUid, namespace, name, query)
  const filtered = mockDaemonSetPodList.filter((d: PodListVo) => {
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
 * 获取守护进程集（DaemonSet）历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 历史版本查询条件
 * @returns 分页后的历史版本（History）列表
 */
function getDaemonSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DaemonSetHistoryRevisionQueryForm>,
): PageVo<DaemonSetHistoryRevisionListVo> {
  console.log('[Mock] getDaemonSetHistoryRevisionList', clusterUid, namespace, name, query)
  const filtered = mockDaemonSetHistoryRevisionList.filter((d: DaemonSetHistoryRevisionListVo) => {
    if (query.revision && d.revision !== query.revision) return false
    return true
  })
  const filteredChangeCause = query.changeCause ? filtered.filter(d => d.changeCause === query.changeCause) : []
  const matched = query.changeCause ? Array.from(new Set([...filteredChangeCause])) : filtered
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
 * 获取守护进程集（DaemonSet）关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @returns 关联网络资源数据
 */
function getDaemonSetNetwork(clusterUid: string, namespace: string, name: string): DaemonSetNetworkVo {
  console.log('[Mock] getDaemonSetNetwork', clusterUid, namespace, name)
  return mockDaemonSetNetwork
}

/**
 * 获取守护进程集（DaemonSet）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getDaemonSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getDaemonSetEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockDaemonSetEventList)
}

/**
 * 获取守护进程集（DaemonSet）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param query - 监控查询条件
 * @returns 守护进程集监控数据
 */
function getDaemonSetMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DaemonSetMonitorQueryForm>,
): DaemonSetMonitorVo {
  console.log('[Mock] getDaemonSetMonitor', clusterUid, namespace, name, query)
  return mockDaemonSetMonitor
}

/**
 * 创建守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createDaemonSet(clusterUid: string, data: Partial<DaemonSetCreateForm>): void {
  console.log('[Mock] createDaemonSet', clusterUid, data)
}

/**
 * 创建守护进程集（DaemonSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createDaemonSetYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createDaemonSetYaml', clusterUid, yaml)
}

/**
 * 更新守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 更新请求对象
 */
function updateDaemonSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DaemonSetUpdateForm>,
): void {
  console.log('[Mock] updateDaemonSet', clusterUid, namespace, name, data)
}

/**
 * 更新守护进程集（DaemonSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param yaml - 更新 YAML 文本
 */
function updateDaemonSetYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateDaemonSetYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置守护进程集（DaemonSet）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 标签配置请求对象
 */
function manageDaemonSetLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageDaemonSetLabels', clusterUid, namespace, name, data)
}

/**
 * 配置守护进程集（DaemonSet）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 注解配置请求对象
 */
function manageDaemonSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageDaemonSetAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
function deleteDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDaemonSet', clusterUid, namespace, name)
}

/**
 * 批量删除守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param uids - 守护进程集 UID 数组
 */
function deleteDaemonSets(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteDaemonSets', clusterUid, uids)
}

/**
 * 导入守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importDaemonSet(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importDaemonSet', clusterUid)
}

/**
 * 导出守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportDaemonSet(clusterUid: string, query: Partial<DaemonSetExportQueryForm>): void {
  console.log('[Mock] exportDaemonSet', clusterUid, query)
}

/**
 * 重启守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
function restartDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDaemonSet', clusterUid, namespace, name)
}

/**
 * 回滚守护进程集（DaemonSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 * @param data - 回滚请求对象
 */
function rollbackDaemonSet(clusterUid: string, namespace: string, name: string, data: DaemonSetRollbackForm): void {
  console.log('[Mock] rollbackDaemonSet', clusterUid, namespace, name, data)
}

/**
 * 暂停守护进程集（DaemonSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
function pauseDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseDaemonSet', clusterUid, namespace, name)
}

/**
 * 恢复守护进程集（DaemonSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 守护进程集名称
 */
function resumeDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeDaemonSet', clusterUid, namespace, name)
}
