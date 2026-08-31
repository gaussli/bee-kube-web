import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  StatefulSetCreateForm,
  StatefulSetDetailVo,
  StatefulSetExportQueryForm,
  StatefulSetHistoryRevisionListVo,
  StatefulSetHistoryRevisionQueryForm,
  StatefulSetListVo,
  StatefulSetMonitorQueryForm,
  StatefulSetMonitorVo,
  StatefulSetNetworkVo,
  StatefulSetPartitionForm,
  StatefulSetQueryForm,
  StatefulSetRollbackForm,
  StatefulSetScaleForm,
  StatefulSetUpdateForm,
  StatefulSetYamlVo,
} from '@/types/kubernetes/workload/statefulset'

import { handleEventList } from '@/mock/utils'

import {
  mockStatefulSetDetailVo,
  mockStatefulSetEventList,
  mockStatefulSetHistoryRevisionList,
  mockStatefulSetList,
  mockStatefulSetMonitor,
  mockStatefulSetNetwork,
  mockStatefulSetPodList,
  mockStatefulSetYaml,
} from './data'

/**
 * 有状态应用路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/statefulsets                                         - 获取有状态应用列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name             - 获取有状态应用详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml        - 获取有状态应用 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pods        - 获取关联 Pod 列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/history     - 获取历史版本列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/network     - 获取关联网络资源
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/events      - 获取事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/monitor     - 获取监控数据
 * - POST   /kubernetes/clusters/:clusterUid/statefulsets                                         - 创建有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/statefulsets/yaml                                    - 创建有状态应用（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name             - 更新有状态应用
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml        - 更新有状态应用（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels      - 配置标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations - 配置注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name             - 删除有状态应用
 * - DELETE /kubernetes/clusters/:clusterUid/statefulsets                                         - 批量删除有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/statefulsets/import                                  - 导入有状态应用
 * - GET    /kubernetes/clusters/:clusterUid/statefulsets/export                                  - 导出有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/scale       - 扩缩容有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/partition   - 配置滚动更新分区
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/restart     - 重启有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/rollback    - 回滚有状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pause       - 暂停更新
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/resume      - 恢复更新
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/statefulsets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetQueryForm> }) =>
      getStatefulSetList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStatefulSetYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getStatefulSetPodList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetHistoryRevisionQueryForm> }) =>
      getStatefulSetHistoryRevisionList(
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
      getStatefulSetNetwork(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getStatefulSetEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetMonitorQueryForm> }) =>
      getStatefulSetMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StatefulSetCreateForm> }) =>
      createStatefulSet(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createStatefulSetYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StatefulSetUpdateForm> }) =>
      updateStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateStatefulSetYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageStatefulSetLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageStatefulSetAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/statefulsets',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteStatefulSets(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importStatefulSet(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/statefulsets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StatefulSetExportQueryForm> }) =>
      exportStatefulSet(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/scale',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetScaleForm }) =>
      scaleStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/partition',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetPartitionForm }) =>
      partitionStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: StatefulSetRollbackForm }) =>
      rollbackStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeStatefulSet(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取有状态应用（StatefulSet）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的有状态应用列表
 */
function getStatefulSetList(clusterUid: string, query: Partial<StatefulSetQueryForm>): PageVo<StatefulSetListVo> {
  console.log('[Mock] getStatefulSetList', clusterUid, query)
  const filtered = mockStatefulSetList.filter((d: StatefulSetListVo) => {
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
 * 获取有状态应用（StatefulSet）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @returns 有状态应用详情
 */
function getStatefulSetDetail(clusterUid: string, namespace: string, name: string): StatefulSetDetailVo {
  console.log('[Mock] getStatefulSetDetail', clusterUid, namespace, name)
  return mockStatefulSetDetailVo
}

/**
 * 获取有状态应用（StatefulSet）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @returns 有状态应用 YAML
 */
function getStatefulSetYaml(clusterUid: string, namespace: string, name: string): StatefulSetYamlVo {
  console.log('[Mock] getStatefulSetYaml', clusterUid, namespace, name)
  return { yaml: mockStatefulSetYaml }
}

/**
 * 获取有状态应用（StatefulSet）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页后的容器组（Pod）列表
 */
function getStatefulSetPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  console.log('[Mock] getStatefulSetPodList', clusterUid, namespace, name, query)
  const filtered = mockStatefulSetPodList.filter((d: PodListVo) => {
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
 * 获取有状态应用（StatefulSet）历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param query - 历史版本查询条件
 * @returns 分页后的历史版本（History）列表
 */
function getStatefulSetHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetHistoryRevisionQueryForm>,
): PageVo<StatefulSetHistoryRevisionListVo> {
  console.log('[Mock] getStatefulSetHistoryRevisionList', clusterUid, namespace, name, query)
  const filtered = mockStatefulSetHistoryRevisionList.filter((d: StatefulSetHistoryRevisionListVo) => {
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
 * 获取有状态应用（StatefulSet）关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @returns 关联网络资源数据
 */
function getStatefulSetNetwork(clusterUid: string, namespace: string, name: string): StatefulSetNetworkVo {
  console.log('[Mock] getStatefulSetNetwork', clusterUid, namespace, name)
  return mockStatefulSetNetwork
}

/**
 * 获取有状态应用（StatefulSet）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getStatefulSetEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getStatefulSetEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockStatefulSetEventList)
}

/**
 * 获取有状态应用（StatefulSet）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param query - 监控查询条件
 * @returns 有状态应用监控数据
 */
function getStatefulSetMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<StatefulSetMonitorQueryForm>,
): StatefulSetMonitorVo {
  console.log('[Mock] getStatefulSetMonitor', clusterUid, namespace, name, query)
  return mockStatefulSetMonitor
}

/**
 * 创建有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createStatefulSet(clusterUid: string, data: Partial<StatefulSetCreateForm>): void {
  console.log('[Mock] createStatefulSet', clusterUid, data)
}

/**
 * 创建有状态应用（StatefulSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createStatefulSetYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createStatefulSetYaml', clusterUid, yaml)
}

/**
 * 更新有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 更新请求对象
 */
function updateStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
): void {
  console.log('[Mock] updateStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 更新有状态应用（StatefulSet）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param yaml - 更新 YAML 文本
 */
function updateStatefulSetYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateStatefulSetYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置有状态应用（StatefulSet）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 标签配置请求对象
 */
function manageStatefulSetLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageStatefulSetLabels', clusterUid, namespace, name, data)
}

/**
 * 配置有状态应用（StatefulSet）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 注解配置请求对象
 */
function manageStatefulSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageStatefulSetAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 */
function deleteStatefulSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteStatefulSet', clusterUid, namespace, name)
}

/**
 * 批量删除有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param uids - 有状态应用 UID 数组
 */
function deleteStatefulSets(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteStatefulSets', clusterUid, uids)
}

/**
 * 导入有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importStatefulSet(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importStatefulSet', clusterUid)
}

/**
 * 导出有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportStatefulSet(clusterUid: string, query: Partial<StatefulSetExportQueryForm>): void {
  console.log('[Mock] exportStatefulSet', clusterUid, query)
}

/**
 * 扩缩容有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 扩缩容请求对象
 */
function scaleStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetScaleForm): void {
  console.log('[Mock] scaleStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 配置有状态应用（StatefulSet）滚动更新分区
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 滚动更新分区配置请求对象
 */
function partitionStatefulSet(
  clusterUid: string,
  namespace: string,
  name: string,
  data: StatefulSetPartitionForm,
): void {
  console.log('[Mock] partitionStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 重启有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 */
function restartStatefulSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartStatefulSet', clusterUid, namespace, name)
}

/**
 * 回滚有状态应用（StatefulSet）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 * @param data - 回滚请求对象
 */
function rollbackStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetRollbackForm): void {
  console.log('[Mock] rollbackStatefulSet', clusterUid, namespace, name, data)
}

/**
 * 暂停有状态应用（StatefulSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 */
function pauseStatefulSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseStatefulSet', clusterUid, namespace, name)
}

/**
 * 恢复有状态应用（StatefulSet）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 有状态应用名称
 */
function resumeStatefulSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeStatefulSet', clusterUid, namespace, name)
}
