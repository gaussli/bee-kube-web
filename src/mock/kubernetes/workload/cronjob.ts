/**
 * @fileOverview Kubernetes CronJob 管理 Mock API
 * @module mock/kubernetes/workload/cronjob
 */
import type { CronJobResp, CronJobQueryReq, CronJobReq, CronJobLabelsReq, CronJobAnnotationsReq } from '@/types'
import { generateId } from '@/mock/utils'

/**
 * CronJob 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs - 获取 CronJob 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 获取 CronJob 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs - 创建 CronJob
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 更新 CronJob
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/suspend - 暂停
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/resume - 恢复
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/trigger - 手动触发
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 删除 CronJob
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs',
    handler: (_pathParams: Record<string, string>, _params: Partial<CronJobQueryReq>) => getCronJobPage(_pathParams.clusterId, pathParams.namespace, _params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => getCronJobDetail(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<CronJobReq>) => createCronJob(_pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<CronJobReq>) => updateCronJob(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/suspend',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => suspendCronJob(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/resume',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => resumeCronJob(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/trigger',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => triggerCronJob(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/labels',
    handler: (_pathParams: Record<string, string>, _params: any, data: CronJobLabelsReq) => manageCronJobLabels(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations',
    handler: (_pathParams: Record<string, string>, _params: any, data: CronJobAnnotationsReq) => manageCronJobAnnotations(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => deleteCronJob(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]) => deleteCronJobs(_pathParams.clusterId, pathParams.namespace, data)
  }
]

function getCronJobPage(clusterId: string, namespace: string, _params: Partial<CronJobQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockCronJobs.filter(c => c.clusterId === clusterId && c.namespace === namespace)
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(c => c.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getCronJobDetail(clusterId: string, namespace: string, name: string) {
  return mockCronJobs.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name) || null
}

function createCronJob(clusterId: string, namespace: string, data: Partial<CronJobReq>) {
  const newCj: CronJobResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    status: 'Active',
    schedule: data.schedule || '0 * * * *',
    concurrencyPolicy: data.concurrencyPolicy || 'Allow',
    suspend: data.suspend || false,
    activeJobs: 0,
    images: data.containers?.map(c => c.image) || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockCronJobs.push(newCj)
  return newCj.id
}

function updateCronJob(clusterId: string, namespace: string, name: string, data: Partial<CronJobReq>) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return null
  const updated = { ...mockCronJobs[index], ...data, images: data.containers?.map(c => c.image) || mockCronJobs[index].images, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockCronJobs[index] = updated
  return updated.id
}

function suspendCronJob(clusterId: string, namespace: string, name: string) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockCronJobs[index].suspend = true
  return true
}

function resumeCronJob(clusterId: string, namespace: string, name: string) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockCronJobs[index].suspend = false
  return true
}

function triggerCronJob(clusterId: string, namespace: string, name: string) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockCronJobs[index].activeJobs += 1
  return true
}

function manageCronJobLabels(clusterId: string, namespace: string, name: string, data: CronJobLabelsReq) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  const currentLabels = mockCronJobs[index].labels || {}
  if (data.operation === 1) mockCronJobs[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockCronJobs[index].labels = newLabels
  } else if (data.operation === 3) mockCronJobs[index].labels = data.labels
  return true
}

function manageCronJobAnnotations(clusterId: string, namespace: string, name: string, data: CronJobAnnotationsReq) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  const currentAnnotations = mockCronJobs[index].annotations || {}
  if (data.operation === 1) mockCronJobs[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockCronJobs[index].annotations = newAnnotations
  } else if (data.operation === 3) mockCronJobs[index].annotations = data.annotations
  return true
}

function deleteCronJob(clusterId: string, namespace: string, name: string) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockCronJobs.splice(index, 1)
  return true
}

function deleteCronJobs(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
    if (index !== -1) mockCronJobs.splice(index, 1)
  })
  return true
}

const mockCronJobs: CronJobResp[] = [
  {
    id: generateId(),
    name: 'db-backup',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    schedule: '0 2 * * *',
    concurrencyPolicy: 'Allow',
    suspend: false,
    activeJobs: 0,
    images: ['mysql:8.0', 'minio/mc:latest'],
    labels: { app: 'db-backup', env: 'production' },
    annotations: { description: '数据库每日备份任务' },
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'log-rotate',
    namespace: 'logging',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    schedule: '0 0 * * *',
    concurrencyPolicy: 'Forbid',
    suspend: false,
    activeJobs: 1,
    images: ['busybox:latest'],
    labels: { app: 'log-rotate' },
    annotations: {},
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'report-generator',
    namespace: 'analytics',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    schedule: '0 8 * * 1',
    concurrencyPolicy: 'Allow',
    suspend: false,
    activeJobs: 0,
    images: ['report-service:v2.1.0'],
    labels: { app: 'report-generator', env: 'production' },
    annotations: { description: '周报生成任务' },
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'cache-cleanup',
    namespace: 'middleware',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Suspended',
    schedule: '0 */6 * * *',
    concurrencyPolicy: 'Replace',
    suspend: true,
    activeJobs: 0,
    images: ['redis:7.2-alpine'],
    labels: { app: 'cache-cleanup' },
    annotations: {},
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  }
]
