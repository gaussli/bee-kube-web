/**
 * Kubernetes CronJob 管理 Mock API
 * @module mock/kubernetes/workload/cronjob
 */
import type { PageResp } from '@/types/common'
import type { CronJobQueryReq, CronJobResp, CronJobReq, CronJobLabelsReq, CronJobAnnotationsReq } from '@/types/kubernetes/workload/cronjob'
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
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 删除 CronJob
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs',
    handler: (pathParams: Record<string, string>, params: Partial<CronJobQueryReq>): PageResp<CronJobResp> => getCronJobPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (pathParams: Record<string, string>): CronJobResp => getCronJobDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs',
    handler: (pathParams: Record<string, string>, data: Partial<CronJobReq>): void => createCronJob(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (pathParams: Record<string, string>, data: Partial<CronJobReq>): void => updateCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/suspend',
    handler: (pathParams: Record<string, string>): void => suspendCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/resume',
    handler: (pathParams: Record<string, string>): void => resumeCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/trigger',
    handler: (pathParams: Record<string, string>): void => triggerCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<CronJobLabelsReq>): void => manageCronJobLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<CronJobAnnotationsReq>): void => manageCronJobAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (pathParams: Record<string, string>): void => deleteCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]): void => deleteCronJobs(_pathParams.clusterId, _pathParams.namespace, data)
  }
]

/**
 * 获取 CronJob 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getCronJobPage(clusterId: string, namespace: string, params: Partial<CronJobQueryReq>): PageResp<CronJobResp> {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockCronJobs.filter(c => c.clusterId === clusterId && c.namespace === namespace)
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(c => c.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

/**
 * 获取 CronJob 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob 详情
 */
function getCronJobDetail(clusterId: string, namespace: string, name: string): CronJobResp {
  return mockCronJobs.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name) || (null as any)
}

/**
 * 创建 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createCronJob(clusterId: string, namespace: string, data: Partial<CronJobReq>): void {
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
}

/**
 * 更新 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 更新数据
 */
function updateCronJob(clusterId: string, namespace: string, name: string, data: Partial<CronJobReq>): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const updated = {
    ...mockCronJobs[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockCronJobs[index].images,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockCronJobs[index] = updated
}

/**
 * 暂停 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function suspendCronJob(clusterId: string, namespace: string, name: string): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  mockCronJobs[index].suspend = true
}

/**
 * 恢复 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function resumeCronJob(clusterId: string, namespace: string, name: string): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  mockCronJobs[index].suspend = false
}

/**
 * 手动触发 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function triggerCronJob(clusterId: string, namespace: string, name: string): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  mockCronJobs[index].activeJobs += 1
}

/**
 * 更新 CronJob 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 标签数据
 */
function manageCronJobLabels(clusterId: string, namespace: string, name: string, data: Partial<CronJobLabelsReq>): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const currentLabels = mockCronJobs[index].labels || {}
  if (data.operation === 1) mockCronJobs[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels || {}).forEach(key => delete newLabels[key])
    mockCronJobs[index].labels = newLabels
  } else if (data.operation === 3) mockCronJobs[index].labels = data.labels
}

/**
 * 更新 CronJob 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 注解数据
 */
function manageCronJobAnnotations(clusterId: string, namespace: string, name: string, data: Partial<CronJobAnnotationsReq>): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const currentAnnotations = mockCronJobs[index].annotations || {}
  if (data.operation === 1) mockCronJobs[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations || {}).forEach(key => delete newAnnotations[key])
    mockCronJobs[index].annotations = newAnnotations
  } else if (data.operation === 3) mockCronJobs[index].annotations = data.annotations
}

/**
 * 删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function deleteCronJob(clusterId: string, namespace: string, name: string): void {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  mockCronJobs.splice(index, 1)
}

/**
 * 批量删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - CronJob 名称数组
 */
function deleteCronJobs(clusterId: string, namespace: string, names: string[]): void {
  names.forEach(name => {
    const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
    if (index !== -1) mockCronJobs.splice(index, 1)
  })
}

/**
 * 模拟 CronJob 数据
 */
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
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  }
]
