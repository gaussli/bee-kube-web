/**
 * Kubernetes CronJob 管理 Mock API
 * @module mock/kubernetes/workload/cronjob
 */
import type { PageVo } from '@/types/common'
import type { CronJobAnnotationsReq, CronJobDetailResp, CronJobLabelsReq, CronJobListResp, CronJobQueryReq, CronJobReq, CronJobYamlReq } from '@/types/kubernetes/workload/cronjob'
import { generateId } from '@/mock/utils'

/**
 * CronJob 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/cronjobs - 获取 CronJob 分页列表（namespace 通过 query 参数传递，可选）
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 获取 CronJob 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs - 创建 CronJob
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 更新 CronJob
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/suspend - 暂停
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/resume - 恢复
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/trigger - 手动触发
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name - 删除 CronJob
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/cronjobs/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/cronjobs/import - 导入 CronJob
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/cronjobs',
    handler: (pathParams: Record<string, string>, params: Partial<CronJobQueryReq>): PageVo<CronJobListResp> => getCronJobList(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (pathParams: Record<string, string>): CronJobDetailResp => getCronJobDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getCronJobYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs',
    handler: (pathParams: Record<string, string>, data: CronJobReq): void => createCronJob(pathParams.clusterId, pathParams.namespace, data)
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
    handler: (pathParams: Record<string, string>, data: CronJobLabelsReq): void => manageCronJobLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name/annotations',
    handler: (pathParams: Record<string, string>, data: CronJobAnnotationsReq): void => manageCronJobAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/:name',
    handler: (pathParams: Record<string, string>): void => deleteCronJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/cronjobs/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteCronJobs(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/cronjobs/export',
    handler: (pathParams: Record<string, string>, params: Partial<CronJobQueryReq>): void => exportCronJob(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/cronjobs/import',
    handler: (pathParams: Record<string, string>, data: CronJobYamlReq): void => importCronJob(pathParams.clusterId, data)
  }
]

/**
 * 获取 CronJob 分页列表
 * @param _clusterId - 集群ID（mock 中暂未使用，保留以对齐 API 签名）
 * @param params - 查询参数（namespace 可选，不传则查询所有命名空间）
 * @returns 分页数据
 */
function getCronJobList(_clusterId: string, params: Partial<CronJobQueryReq>): PageVo<CronJobListResp> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockCronJobs]

  if (status) {
    filtered = filtered.filter(c => c.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(c => c.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: CronJobListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(c => c.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))]
    }
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(c => {
      if (seenIds.has(c.id)) return false
      seenIds.add(c.id)
      return true
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 获取 CronJob 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob 详情
 */
function getCronJobDetail(clusterId: string, namespace: string, name: string): CronJobDetailResp {
  const job = mockCronJobs.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (!job) {
    console.error('[Get CronJob Detail] can not find cronjob:', clusterId, namespace, name)
    return null as unknown as CronJobDetailResp
  }
  return {
    ...job,
    concurrencyPolicy: job.name === 'log-rotate' ? 'Forbid' : job.name === 'cache-cleanup' ? 'Replace' : 'Allow',
    suspend: job.name === 'cache-cleanup',
    images: ['busybox:latest'],
    labels: job.name === 'db-backup' ? { app: 'db-backup', env: 'production' } : { app: job.name },
    annotations: {},
    containers: [
      {
        name: job.name,
        image: 'busybox:latest',
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        command: ['/bin/sh', '-c'],
        args: [`echo "Running ${job.name}"`]
      }
    ]
  }
}

/**
 * 查看 CronJob YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @returns CronJob YAML 配置
 */
function getCronJobYaml(clusterId: string, namespace: string, name: string): string {
  const job = mockCronJobs.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (!job) {
    console.error('[Get CronJob Yaml] can not find cronjob:', clusterId, namespace, name)
    return ''
  }

  const yaml = `apiVersion: batch/v1
kind: CronJob
metadata:
  name: ${job.name}
  namespace: ${job.namespace}
  creationTimestamp: "${job.createAt}"
  uid: "${job.uid}"
spec:
  schedule: "${job.schedule}"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: ${job.name}
            image: busybox:latest
            command: ["/bin/sh", "-c"]
            args: ["echo 'Running ${job.name}'"]
          restartPolicy: Never
status:
  lastSuccessfulTime: "${job.lastSuccessfulTime || ''}"
  active:
    - name: ${job.name}-manual-job`

  return yaml
}

/**
 * 创建 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createCronJob(clusterId: string, namespace: string, data: CronJobReq): void {
  console.log('[Mock] createCronJob', { clusterId, namespace, data })
}

/**
 * 更新 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 更新数据
 */
function updateCronJob(clusterId: string, namespace: string, name: string, data: Partial<CronJobReq>): void {
  console.log('[Mock] updateCronJob', { clusterId, namespace, name, data })
}

/**
 * 暂停 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function suspendCronJob(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] suspendCronJob', { clusterId, namespace, name })
}

/**
 * 恢复 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function resumeCronJob(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] resumeCronJob', { clusterId, namespace, name })
}

/**
 * 手动触发 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function triggerCronJob(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] triggerCronJob', { clusterId, namespace, name })
}

/**
 * 更新 CronJob 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 标签数据
 */
function manageCronJobLabels(clusterId: string, namespace: string, name: string, data: CronJobLabelsReq): void {
  console.log('[Mock] manageCronJobLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 CronJob 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 * @param data - 注解数据
 */
function manageCronJobAnnotations(clusterId: string, namespace: string, name: string, data: CronJobAnnotationsReq): void {
  console.log('[Mock] manageCronJobAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - CronJob 名称
 */
function deleteCronJob(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteCronJob', { clusterId, namespace, name })
}

/**
 * 批量删除 CronJob
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - CronJob 名称数组
 */
function deleteCronJobs(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteCronJobs', { clusterId, namespace, names })
}

/**
 * 导出 CronJob CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportCronJob(clusterId: string, params: Partial<CronJobQueryReq>): void {
  console.log('[Mock] exportCronJob', { clusterId, params })
}

/**
 * 导入 CronJob
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importCronJob(clusterId: string, data: CronJobYamlReq): void {
  console.log('[Mock] importCronJob', { clusterId, data })
}

/**
 * 模拟 CronJob 数据
 * @remarks 包含生产环境中常见的定时任务数据
 */
const mockCronJobs: CronJobListResp[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'db-backup',
    namespace: 'data',
    clusterId: 'c1',
    description: '数据库每日备份任务',
    status: 'Active',
    schedule: '0 2 * * *',
    lastSuccessfulTime: '2024-03-20 02:00:00',
    activeJobs: 0,
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin',
    deletable: true
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'log-rotate',
    namespace: 'logging',
    clusterId: 'c1',
    description: '日志轮转任务',
    status: 'Active',
    statusMsg: '1 个 Job 正在执行',
    schedule: '0 0 * * *',
    activeJobs: 1,
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin',
    deletable: true
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'report-generator',
    namespace: 'analytics',
    clusterId: 'c1',
    description: '周报生成任务',
    status: 'Active',
    schedule: '0 8 * * 1',
    lastSuccessfulTime: '2024-03-18 08:00:00',
    activeJobs: 0,
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin',
    deletable: true
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cache-cleanup',
    namespace: 'middleware',
    clusterId: 'c1',
    description: '缓存清理任务',
    status: 'Suspended',
    statusMsg: '已被管理员暂停',
    schedule: '0 */6 * * *',
    activeJobs: 0,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin',
    deletable: true
  }
]
