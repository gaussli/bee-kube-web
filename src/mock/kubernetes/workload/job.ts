/**
 * @fileOverview Kubernetes Job 管理 Mock API
 * @module mock/kubernetes/workload/job
 */
import type { JobResp, JobQueryReq, JobReq, JobLabelsReq, JobAnnotationsReq } from '@/types'
import { generateId } from '@/mock/utils'

/**
 * Job 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs - 获取 Job 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 获取 Job 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs - 创建 Job
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 更新 Job
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 删除 Job
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/batch - 批量删除
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/annotations - 更新注解
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs',
    handler: (_pathParams: Record<string, string>, _params: Partial<JobQueryReq>) => getJobPage(_pathParams.clusterId, pathParams.namespace, _params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => getJobDetail(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<JobReq>) => createJob(_pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<JobReq>) => updateJob(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => deleteJob(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]) => deleteJobs(_pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/labels',
    handler: (_pathParams: Record<string, string>, _params: any, data: JobLabelsReq) => manageJobLabels(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/annotations',
    handler: (_pathParams: Record<string, string>, _params: any, data: JobAnnotationsReq) => manageJobAnnotations(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  }
]

function getJobPage(clusterId: string, namespace: string, _params: Partial<JobQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockJobs.filter(j => j.clusterId === clusterId && j.namespace === namespace)
  if (name) filtered = filtered.filter(j => j.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(j => j.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getJobDetail(clusterId: string, namespace: string, name: string) {
  return mockJobs.find(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name) || null
}

function createJob(clusterId: string, namespace: string, data: Partial<JobReq>) {
  const newJob: JobResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    status: 'Active',
    parallelism: data.parallelism || 1,
    completions: data.completions || 1,
    succeeded: 0,
    failed: 0,
    active: 1,
    images: data.containers?.map(c => c.image) || [],
    labels: data.labels,
    annotations: data.annotations,
    startTime: new Date().toLocaleString(),
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockJobs.push(newJob)
  return newJob.id
}

function updateJob(clusterId: string, namespace: string, name: string, data: Partial<JobReq>) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return null
  const updated = { ...mockJobs[index], ...data, images: data.containers?.map(c => c.image) || mockJobs[index].images, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockJobs[index] = updated
  return updated.id
}

function deleteJob(clusterId: string, namespace: string, name: string) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return false
  mockJobs.splice(index, 1)
  return true
}

function deleteJobs(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
    if (index !== -1) mockJobs.splice(index, 1)
  })
  return true
}

function manageJobLabels(clusterId: string, namespace: string, name: string, data: JobLabelsReq) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return false
  const currentLabels = mockJobs[index].labels || {}
  if (data.operation === 1) mockJobs[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockJobs[index].labels = newLabels
  } else if (data.operation === 3) mockJobs[index].labels = data.labels
  return true
}

function manageJobAnnotations(clusterId: string, namespace: string, name: string, data: JobAnnotationsReq) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return false
  const currentAnnotations = mockJobs[index].annotations || {}
  if (data.operation === 1) mockJobs[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockJobs[index].annotations = newAnnotations
  } else if (data.operation === 3) mockJobs[index].annotations = data.annotations
  return true
}

const mockJobs: JobResp[] = [
  {
    id: generateId(),
    name: 'db-backup-20240320',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Succeeded',
    parallelism: 1,
    completions: 1,
    succeeded: 1,
    failed: 0,
    active: 0,
    startTime: '2024-03-20 02:00:00',
    completionTime: '2024-03-20 02:15:00',
    images: ['mysql:8.0'],
    labels: { app: 'db-backup', date: '20240320' },
    annotations: {},
    createAt: '2024-03-20 02:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 02:15:00',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'data-import-001',
    namespace: 'etl',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Failed',
    parallelism: 2,
    completions: 1,
    succeeded: 0,
    failed: 2,
    active: 0,
    startTime: '2024-03-19 10:00:00',
    completionTime: '2024-03-19 10:30:00',
    images: ['etl-tool:v1.2.0'],
    labels: { app: 'data-import', batch: '001' },
    annotations: { error: '数据源连接失败' },
    createAt: '2024-03-19 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 10:30:00',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'model-training',
    namespace: 'ml',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    parallelism: 4,
    completions: 1,
    succeeded: 0,
    failed: 0,
    active: 4,
    startTime: '2024-03-20 08:00:00',
    images: ['pytorch-training:v2.1.0'],
    labels: { app: 'model-training', experiment: 'exp-001' },
    annotations: { description: '模型训练任务' },
    createAt: '2024-03-20 08:00:00',
    createBy: 'ml-engineer',
    updateAt: '2024-03-20 08:00:00',
    updateBy: 'ml-engineer'
  },
  {
    id: generateId(),
    name: 'cache-warmup',
    namespace: 'middleware',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Succeeded',
    parallelism: 1,
    completions: 1,
    succeeded: 1,
    failed: 0,
    active: 0,
    startTime: '2024-03-19 00:00:00',
    completionTime: '2024-03-19 00:10:00',
    images: ['redis:7.2-alpine'],
    labels: { app: 'cache-warmup' },
    annotations: {},
    createAt: '2024-03-19 00:00:00',
    createBy: 'system',
    updateAt: '2024-03-19 00:10:00',
    updateBy: 'system'
  }
]
