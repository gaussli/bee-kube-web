/**
 * Job 管理 Mock
 * @module mock/kubernetes/workload/job
 */
import type { AxiosProgressEvent } from 'axios'

import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  JobCreateForm,
  JobDetailVo,
  JobListVo,
  JobMonitorVo,
  JobQueryForm,
  JobUpdateForm,
  JobYamlVo,
} from '@/types/kubernetes/workload/job'

import { generateId } from '@/mock/utils'

import { jobMockData, jobMockDetail, jobMockEvents, jobMockPods, jobMockYaml } from './jobData'

/**
 * 查看 Job 列表
 * @param clusterUid 集群 UID
 * @param query Job 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns Job 分页列表
 */
function getJobListMock(clusterUid: string, query: Partial<JobQueryForm>): PageVo<JobListVo> {
  console.log('[Mock] getJobList', clusterUid, query)
  const filtered = jobMockData.filter((d: JobListVo) => {
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
 * 查看 Job 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns Job 详情响应对象
 */
function getJobDetailMock(clusterUid: string, namespace: string, name: string): JobDetailVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getJobDetail', clusterUid, namespace, name)
  return jobMockDetail
}

/**
 * 查看 Job YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns Job YAML 响应对象（完整 YAML 文本）
 */
function getJobYamlMock(clusterUid: string, namespace: string, name: string): JobYamlVo {
  void clusterUid
  void namespace
  void name
  console.log('[Mock] getJobYaml', clusterUid, namespace, name)
  return jobMockYaml
}

/**
 * 查看 Job 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param query Job 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态、UID）
 * @returns Job 关联 Pod 分页列表
 */
function getJobPodListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  void clusterUid
  void namespace
  console.log('[Mock] getJobPodList', clusterUid, namespace, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return { list: jobMockPods, total: jobMockPods.length, page, pageSize }
}

/**
 * 查看 Job 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns Job 关联事件分页列表
 */
function getJobEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  void clusterUid
  void namespace
  console.log('[Mock] getJobEventList', clusterUid, namespace, name, query)
  const matched = jobMockEvents.filter(e => {
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
 * 查看 Job 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns Job 监控响应对象
 */
function getJobMonitorMock(clusterUid: string, namespace: string, name: string): JobMonitorVo {
  void clusterUid
  void namespace
  console.log('[Mock] getJobMonitor', clusterUid, namespace, name)
  return {}
}

/**
 * 创建 Job
 * @param clusterUid 集群 UID
 * @param data Job 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createJobMock(clusterUid: string, data: Partial<JobCreateForm>): void {
  console.log('[Mock] createJob', clusterUid, data)
  const newItem: JobListVo = {
    uid: generateId(),
    clusterUid,
    cluster: 'system-cluster',
    namespaceUid: `ns-${data?.namespace || 'default'}`,
    namespace: data?.namespace || 'default',
    name: data?.name || 'new-job',
    description: data?.description,
    status: 'Active',
    statusMsg: '任务运行中',
    active: 0,
    succeeded: 0,
    failed: 0,
    completions: data?.spec?.completions || 1,
    parallelism: data?.spec?.parallelism || 1,
    createAt: new Date().toISOString(),
    createBy: 'admin',
    updateAt: new Date().toISOString(),
    updateBy: 'admin',
    deletable: true,
  }
  jobMockData.push(newItem)
}

/**
 * YAML 创建 Job
 * @param clusterUid 集群 UID
 * @param yaml Job YAML 字符串
 * @returns void
 */
function createJobYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createJobYaml', clusterUid, yaml)
}

/**
 * 更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data Job 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateJobMock(clusterUid: string, namespace: string, name: string, data: Partial<JobUpdateForm>): void {
  console.log('[Mock] updateJob', clusterUid, namespace, name, data)
  const item = jobMockData.find(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (item && data.description !== undefined) {
    item.description = data.description
  }
}

/**
 * YAML 更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param yaml Job YAML 字符串
 * @returns void
 */
function updateJobYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateJobYaml', clusterUid, namespace, name, yaml)
}

/**
 * 管理 Job 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageJobLabelMock(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageJobLabel', clusterUid, namespace, name, data)
}

/**
 * 管理 Job 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageJobAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageJobAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns void
 */
function deleteJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteJob', clusterUid, namespace, name)
  const index = jobMockData.findIndex(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (index > -1) {
    jobMockData.splice(index, 1)
  }
}

/**
 * 批量删除 Job
 * @param clusterUid 集群 UID
 * @param uids Job UID 列表
 * @returns void
 */
function deleteJobsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteJobs', clusterUid, uids)
  for (const uid of uids) {
    const index = jobMockData.findIndex(d => d.clusterUid === clusterUid && d.uid === uid)
    if (index > -1) {
      jobMockData.splice(index, 1)
    }
  }
}

/**
 * 导入 Job
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @param onProgress 上传进度回调
 * @returns void
 */
function importJobMock(
  clusterUid: string,
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
): void {
  void formData
  void onProgress
  console.log('[Mock] importJob', clusterUid)
}

/**
 * 导出 Job
 * @param clusterUid 集群 UID
 * @param query Job 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportJobMock(clusterUid: string, query: Partial<JobQueryForm>): void {
  console.log('[Mock] exportJob', clusterUid, query)
}

/**
 * 手动重跑 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns void
 */
function rerunJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] rerunJob', clusterUid, namespace, name)
}

/**
 * 暂停更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns void
 */
function pauseJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseJob', clusterUid, namespace, name)
}

/**
 * 恢复更新 Job
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Job 名称
 * @returns void
 */
function resumeJobMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeJob', clusterUid, namespace, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/jobs',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<JobQueryForm> }) =>
      getJobListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getJobDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getJobYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getJobPodListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getJobEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getJobMonitorMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<JobCreateForm> }) =>
      createJobMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createJobYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<JobUpdateForm> }) =>
      updateJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateJobYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageJobLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageJobAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/jobs/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteJobsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/jobs/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importJobMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/jobs/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<JobQueryForm> }) =>
      exportJobMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/rerun',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      rerunJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeJobMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
