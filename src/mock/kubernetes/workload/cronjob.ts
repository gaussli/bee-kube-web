/**
 * CronJob 管理 Mock
 * @module mock/kubernetes/workload/cronjob
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  CronJobCreateForm,
  CronJobDetailVo,
  CronJobJobListVo,
  CronJobJobQueryForm,
  CronJobListVo,
  CronJobMonitorVo,
  CronJobQueryForm,
  CronJobUpdateForm,
  CronJobYamlVo,
} from '@/types/kubernetes/workload/cronjob'

import { generateId } from '@/mock/utils'

import { cronJobMockData, cronJobMockDetail, cronJobMockEvents, cronJobMockJobs, cronJobMockYaml } from './cronjobData'

/**
 * 查看 CronJob 列表
 * @param clusterUid 集群 UID
 * @param query CronJob 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns CronJob 分页列表
 */
function getCronJobListMock(clusterUid: string, query: Partial<CronJobQueryForm>): PageVo<CronJobListVo> {
  console.log('[Mock] getCronJobList', clusterUid, query)
  const filtered = cronJobMockData.filter((d: CronJobListVo) => {
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
 * 查看 CronJob 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob 详情响应对象
 */
function getCronJobDetailMock(clusterUid: string, namespace: string, name: string): CronJobDetailVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getCronJobDetail', clusterUid, namespace, name)
  return cronJobMockDetail
}

/**
 * 查看 CronJob YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob YAML 响应对象（完整 YAML 文本）
 */
function getCronJobYamlMock(clusterUid: string, namespace: string, name: string): CronJobYamlVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getCronJobYaml', clusterUid, namespace, name)
  return cronJobMockYaml
}

/**
 * 查看 CronJob 关联 Job 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param query CronJob 关联 Job 查询条件请求对象（Job 名称、Job 状态、UID）
 * @returns CronJob 关联 Job 分页列表
 */
function getCronJobJobListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<CronJobJobQueryForm>,
): PageVo<CronJobJobListVo> {
  void clusterUid
  void namespace
  console.log('[Mock] getCronJobJobList', clusterUid, namespace, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return { list: cronJobMockJobs, total: cronJobMockJobs.length, page, pageSize }
}

/**
 * 查看 CronJob 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns CronJob 关联事件分页列表
 */
function getCronJobEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  void clusterUid
  void namespace
  console.log('[Mock] getCronJobEventList', clusterUid, namespace, name, query)
  const matched = cronJobMockEvents.filter(e => {
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
 * 查看 CronJob 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns CronJob 监控响应对象
 */
function getCronJobMonitorMock(clusterUid: string, namespace: string, name: string): CronJobMonitorVo {
  void clusterUid
  void namespace
  console.log('[Mock] getCronJobMonitor', clusterUid, namespace, name)
  return {}
}

/**
 * 创建 CronJob
 * @param clusterUid 集群 UID
 * @param data CronJob 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createCronJobMock(clusterUid: string, data: Partial<CronJobCreateForm>): void {
  console.log('[Mock] createCronJob', clusterUid, data)
  const newItem: CronJobListVo = {
    uid: generateId(),
    clusterUid,
    cluster: 'system-cluster',
    namespaceUid: `ns-${data?.metadata?.namespace || 'default'}`,
    namespace: data?.metadata?.namespace || 'default',
    name: data?.metadata?.name || 'new-cronjob',
    description: data?.description,
    status: 'Active',
    statusMsg: '调度正常',
    schedule: data?.spec?.schedule || '*/5 * * * *',
    active: 0,
    lastScheduleTime: '',
    suspend: data?.spec?.suspend || false,
    createAt: new Date().toISOString(),
    createBy: 'admin',
    updateAt: new Date().toISOString(),
    updateBy: 'admin',
    deletable: true,
  }
  cronJobMockData.push(newItem)
}

/**
 * YAML 创建 CronJob
 * @param clusterUid 集群 UID
 * @param yaml CronJob YAML 字符串
 * @returns void
 */
function createCronJobYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createCronJobYaml', clusterUid, yaml)
}

/**
 * 更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data CronJob 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateCronJobMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<CronJobUpdateForm>,
): void {
  console.log('[Mock] updateCronJob', clusterUid, namespace, name, data)
  const item = cronJobMockData.find(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (item && data.description !== undefined) {
    item.description = data.description
  }
}

/**
 * YAML 更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param yaml CronJob YAML 字符串
 * @returns void
 */
function updateCronJobYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateCronJobYaml', clusterUid, namespace, name, yaml)
}

/**
 * 管理 CronJob 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageCronJobLabelMock(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageCronJobLabel', clusterUid, namespace, name, data)
}

/**
 * 管理 CronJob 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageCronJobAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageCronJobAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns void
 */
function deleteCronJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteCronJob', clusterUid, namespace, name)
  const index = cronJobMockData.findIndex(
    d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name,
  )
  if (index > -1) {
    cronJobMockData.splice(index, 1)
  }
}

/**
 * 批量删除 CronJob
 * @param clusterUid 集群 UID
 * @param uids CronJob UID 列表
 * @returns void
 */
function deleteCronJobsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteCronJobs', clusterUid, uids)
  for (const uid of uids) {
    const index = cronJobMockData.findIndex(d => d.clusterUid === clusterUid && d.uid === uid)
    if (index > -1) {
      cronJobMockData.splice(index, 1)
    }
  }
}

/**
 * 导入 CronJob
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
 */
function importCronJobMock(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): void {
  void formData
  void onProgress
  console.log('[Mock] importCronJob', clusterUid)
}

/**
 * 导出 CronJob
 * @param clusterUid 集群 UID
 * @param query CronJob 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportCronJobMock(clusterUid: string, query: Partial<CronJobQueryForm>): void {
  console.log('[Mock] exportCronJob', clusterUid, query)
}

/**
 * 立即触发 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns void
 */
function triggerCronJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] triggerCronJob', clusterUid, namespace, name)
}

/**
 * 暂停更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns void
 */
function pauseCronJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseCronJob', clusterUid, namespace, name)
}

/**
 * 恢复更新 CronJob
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name CronJob 名称
 * @returns void
 */
function resumeCronJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeCronJob', clusterUid, namespace, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/cronjobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobQueryForm> }) =>
      getCronJobListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCronJobDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCronJobYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/jobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobJobQueryForm> }) =>
      getCronJobJobListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getCronJobEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCronJobMonitorMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CronJobCreateForm> }) =>
      createCronJobMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createCronJobYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CronJobUpdateForm> }) =>
      updateCronJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateCronJobYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageCronJobLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageCronJobAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteCronJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteCronJobsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importCronJobMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/cronjobs/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CronJobQueryForm> }) =>
      exportCronJobMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/trigger',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      triggerCronJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseCronJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeCronJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
