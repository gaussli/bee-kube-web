import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  CronJobCreateForm,
  CronJobDetailVo,
  CronJobExportQueryForm,
  CronJobJobListVo,
  CronJobJobQueryForm,
  CronJobListVo,
  CronJobMonitorQueryForm,
  CronJobMonitorVo,
  CronJobQueryForm,
  CronJobUpdateForm,
  CronJobYamlVo,
} from '@/types/kubernetes/workload/cronjob'

import { handleEventList } from '@/mock/utils'

import {
  mockCronJobDetail,
  mockCronJobEventList,
  mockCronJobJobList,
  mockCronJobList,
  mockCronJobMonitor,
  mockCronJobYaml,
} from './data'

/**
 * 定时任务路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/cronjobs                                         - 获取定时任务列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name             - 获取定时任务详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml        - 获取定时任务 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/jobs        - 获取关联 Job 列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/events      - 获取事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/monitor     - 获取监控数据
 * - POST   /kubernetes/clusters/:clusterUid/cronjobs                                         - 创建定时任务
 * - POST   /kubernetes/clusters/:clusterUid/cronjobs/yaml                                    - 创建定时任务（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name             - 更新定时任务
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml        - 更新定时任务（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels      - 配置标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations - 配置注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name             - 删除定时任务
 * - DELETE /kubernetes/clusters/:clusterUid/cronjobs                                         - 批量删除定时任务
 * - POST   /kubernetes/clusters/:clusterUid/cronjobs/import                                  - 导入定时任务
 * - GET    /kubernetes/clusters/:clusterUid/cronjobs/export                                  - 导出定时任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/trigger     - 立即触发定时任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/pause       - 暂停更新定时任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/resume      - 恢复更新定时任务
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/cronjobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobQueryForm> }) =>
      getCronJobList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCronJobDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCronJobYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/jobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobJobQueryForm> }) =>
      getCronJobJobList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getCronJobEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobMonitorQueryForm> }) =>
      getCronJobMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CronJobCreateForm> }) =>
      createCronJob(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createCronJobYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CronJobUpdateForm> }) =>
      updateCronJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateCronJobYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageCronJobLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageCronJobAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteCronJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/cronjobs',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteCronJobs(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importCronJob(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobExportQueryForm> }) =>
      exportCronJob(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/trigger',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      triggerCronJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseCronJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeCronJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取定时任务（CronJob）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的定时任务列表
 */
function getCronJobList(clusterUid: string, query: Partial<CronJobQueryForm>): PageVo<CronJobListVo> {
  console.log('[Mock] getCronJobList', clusterUid, query)
  const filtered = mockCronJobList.filter((d: CronJobListVo) => {
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
 * 获取定时任务（CronJob）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @returns 定时任务详情
 */
function getCronJobDetail(clusterUid: string, namespace: string, name: string): CronJobDetailVo {
  console.log('[Mock] getCronJobDetail', clusterUid, namespace, name)
  return mockCronJobDetail
}

/**
 * 获取定时任务（CronJob）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @returns 定时任务 YAML
 */
function getCronJobYaml(clusterUid: string, namespace: string, name: string): CronJobYamlVo {
  console.log('[Mock] getCronJobYaml', clusterUid, namespace, name)
  return { yaml: mockCronJobYaml }
}

/**
 * 获取定时任务（CronJob）关联 Job 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 关联任务（Job）查询条件
 * @returns 分页后的任务（Job）列表
 */
function getCronJobJobList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<CronJobJobQueryForm>,
): PageVo<CronJobJobListVo> {
  console.log('[Mock] getCronJobJobList', clusterUid, namespace, name, query)
  const filtered = mockCronJobJobList.filter((d: CronJobJobListVo) => {
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
 * 获取定时任务（CronJob）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getCronJobEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getCronJobEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockCronJobEventList)
}

/**
 * 获取定时任务（CronJob）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param query - 监控查询条件
 * @returns 定时任务监控数据
 */
function getCronJobMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<CronJobMonitorQueryForm>,
): CronJobMonitorVo {
  console.log('[Mock] getCronJobMonitor', clusterUid, namespace, name, query)
  return mockCronJobMonitor
}

/**
 * 创建定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createCronJob(clusterUid: string, data: Partial<CronJobCreateForm>): void {
  console.log('[Mock] createCronJob', clusterUid, data)
}

/**
 * 创建定时任务（CronJob）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createCronJobYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createCronJobYaml', clusterUid, yaml)
}

/**
 * 更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 更新请求对象
 */
function updateCronJob(clusterUid: string, namespace: string, name: string, data: Partial<CronJobUpdateForm>): void {
  console.log('[Mock] CronJobUpdateForm', clusterUid, namespace, name, data)
}

/**
 * 更新定时任务（CronJob）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param yaml - 更新 YAML 文本
 */
function updateCronJobYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateCronJobYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置定时任务（CronJob）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 标签配置请求对象
 */
function manageCronJobLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageCronJobLabels', clusterUid, namespace, name, data)
}

/**
 * 配置定时任务（CronJob）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 * @param data - 注解配置请求对象
 */
function manageCronJobAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageCronJobAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
function deleteCronJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteCronJob', clusterUid, namespace, name)
}

/**
 * 批量删除定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param uids - 定时任务 UID 数组
 */
function deleteCronJobs(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteCronJobs', clusterUid, uids)
}

/**
 * 导入定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importCronJob(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importCronJob', clusterUid)
}

/**
 * 导出定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportCronJob(clusterUid: string, query: Partial<CronJobExportQueryForm>): void {
  console.log('[Mock] exportCronJob', clusterUid, query)
}

/**
 * 立即触发定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
function triggerCronJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] triggerCronJob', clusterUid, namespace, name)
}

/**
 * 暂停更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
function pauseCronJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseCronJob', clusterUid, namespace, name)
}

/**
 * 恢复更新定时任务（CronJob）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 定时任务名称
 */
function resumeCronJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeCronJob', clusterUid, namespace, name)
}
