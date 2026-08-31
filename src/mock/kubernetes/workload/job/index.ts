import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  JobCreateForm,
  JobDetailVo,
  JobExportQueryForm,
  JobListVo,
  JobMonitorQueryForm,
  JobMonitorVo,
  JobQueryForm,
  JobUpdateForm,
  JobYamlVo,
} from '@/types/kubernetes/workload/job'

import { handleEventList } from '@/mock/utils'

import { mockJobDetail, mockJobEventList, mockJobList, mockJobMonitor, mockJobPodList, mockJobYaml } from './data'

/**
 * 任务路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/jobs                                         - 获取任务列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name             - 获取任务详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml        - 获取任务 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pods        - 获取关联 Pod 列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/events      - 获取事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/monitor     - 获取监控数据
 * - POST   /kubernetes/clusters/:clusterUid/jobs                                         - 创建任务
 * - POST   /kubernetes/clusters/:clusterUid/jobs/yaml                                    - 创建任务（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name             - 更新任务
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml        - 更新任务（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels      - 配置标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations - 配置注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name             - 删除任务
 * - DELETE /kubernetes/clusters/:clusterUid/jobs                                         - 批量删除任务
 * - POST   /kubernetes/clusters/:clusterUid/jobs/import                                  - 导入任务
 * - GET    /kubernetes/clusters/:clusterUid/jobs/export                                  - 导出任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/rerun       - 手动重跑任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pause       - 暂停任务
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/resume      - 恢复任务
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/jobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<JobQueryForm> }) =>
      getJobList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getJobDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getJobYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getJobPodList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getJobEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<JobMonitorQueryForm> }) =>
      getJobMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<JobCreateForm> }) =>
      createJob(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createJobYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<JobUpdateForm> }) =>
      updateJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateJobYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageJobLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageJobAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/jobs',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteJobs(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importJob(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/jobs/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<JobExportQueryForm> }) =>
      exportJob(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/rerun',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      rerunJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeJob(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取任务（Job）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的任务列表
 */
function getJobList(clusterUid: string, query: Partial<JobQueryForm>): PageVo<JobListVo> {
  console.log('[Mock] getJobList', clusterUid, query)
  const filtered = mockJobList.filter((d: JobListVo) => {
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
 * 获取任务（Job）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @returns 任务详情
 */
function getJobDetail(clusterUid: string, namespace: string, name: string): JobDetailVo {
  console.log('[Mock] getJobDetail', clusterUid, namespace, name)
  return mockJobDetail
}

/**
 * 获取任务（Job）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @returns 任务 YAML
 */
function getJobYaml(clusterUid: string, namespace: string, name: string): JobYamlVo {
  console.log('[Mock] getJobYaml', clusterUid, namespace, name)
  return { yaml: mockJobYaml }
}

/**
 * 获取任务（Job）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页的容器组（Pod）列表
 */
function getJobPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  console.log('[Mock] getJobPodList', clusterUid, namespace, name, query)
  const filtered = mockJobPodList.filter((d: PodListVo) => {
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
 * 获取任务（Job）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getJobEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getJobEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockJobEventList)
}

/**
 * 获取任务（Job）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param query - 监控查询条件
 * @returns 任务监控数据
 */
function getJobMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<JobMonitorQueryForm>,
): JobMonitorVo {
  console.log('[Mock] getJobMonitor', clusterUid, namespace, name, query)
  return mockJobMonitor
}

/**
 * 创建任务（Job）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createJob(clusterUid: string, data: Partial<JobCreateForm>): void {
  console.log('[Mock] createJob', clusterUid, data)
}

/**
 * 创建任务（Job）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createJobYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createJobYaml', clusterUid, yaml)
}

/**
 * 更新任务（Job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 更新请求对象
 */
function updateJob(clusterUid: string, namespace: string, name: string, data: Partial<JobUpdateForm>): void {
  console.log('[Mock] updateJob', clusterUid, namespace, name, data)
}

/**
 * 更新任务（Job）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param yaml - 更新 YAML 文本
 */
function updateJobYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateJobYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置任务（Job）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 标签配置请求对象
 */
function manageJobLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageJobLabels', clusterUid, namespace, name, data)
}

/**
 * 配置任务（Job）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 * @param data - 注解配置请求对象
 */
function manageJobAnnotations(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageJobAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除任务（Job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
function deleteJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteJob', clusterUid, namespace, name)
}

/**
 * 批量删除任务（Job）
 * @param clusterUid - 集群 UID
 * @param uids - 任务 UID 数组
 */
function deleteJobs(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteJobs', clusterUid, uids)
}

/**
 * 导入任务（Job）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importJob(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importJob', clusterUid)
}

/**
 * 导出任务（Job）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportJob(clusterUid: string, query: Partial<JobExportQueryForm>): void {
  console.log('[Mock] exportJob', clusterUid, query)
}

/**
 * 手动重跑任务（Job）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
function rerunJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] rerunJob', clusterUid, namespace, name)
}

/**
 * 暂停任务（Job）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
function pauseJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseJob', clusterUid, namespace, name)
}

/**
 * 恢复任务（Job）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 任务名称
 */
function resumeJob(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeJob', clusterUid, namespace, name)
}
