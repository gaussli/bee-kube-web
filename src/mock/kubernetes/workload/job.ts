/**
 * Kubernetes Job 管理 Mock API
 * @module mock/kubernetes/workload/job
 */
import type { PageVo } from '@/types/common'
import type { JobAnnotationsReq, JobDetailResp, JobLabelsReq, JobListResp, JobQueryReq, JobReq, JobYamlReq } from '@/types/kubernetes/workload/job'
import { generateId } from '@/mock/utils'

/**
 * Job 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/jobs - 获取 Job 分页列表（namespace 通过 query 参数传递，可选）
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 获取 Job 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs - 创建 Job
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 更新 Job
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name - 删除 Job
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/jobs/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/jobs/import - 导入 Job
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/jobs',
    handler: (pathParams: Record<string, string>, params: Partial<JobQueryReq>): PageVo<JobListResp> => getJobList(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (pathParams: Record<string, string>): JobDetailResp => getJobDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getJobYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs',
    handler: (pathParams: Record<string, string>, data: JobReq): void => createJob(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (pathParams: Record<string, string>, data: Partial<JobReq>): void => updateJob(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/labels',
    handler: (pathParams: Record<string, string>, data: JobLabelsReq): void => manageJobLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name/annotations',
    handler: (pathParams: Record<string, string>, data: JobAnnotationsReq): void => manageJobAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/:name',
    handler: (pathParams: Record<string, string>): void => deleteJob(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/jobs/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteJobs(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/jobs/export',
    handler: (pathParams: Record<string, string>, params: Partial<JobQueryReq>): void => exportJob(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/jobs/import',
    handler: (pathParams: Record<string, string>, data: JobYamlReq): void => importJob(pathParams.clusterId, data)
  }
]

/**
 * 获取 Job 分页列表
 * @param _clusterId - 集群ID（mock 中暂未使用，保留以对齐 API 签名）
 * @param params - 查询参数（namespace 可选，不传则查询所有命名空间）
 * @returns 分页数据
 */
function getJobList(_clusterId: string, params: Partial<JobQueryReq>): PageVo<JobListResp> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockJobs]

  if (status) {
    filtered = filtered.filter(j => j.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(j => j.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: JobListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(j => j.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(j => j.name.toLowerCase().includes(name.toLowerCase()))]
    }
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(j => {
      if (seenIds.has(j.id)) return false
      seenIds.add(j.id)
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
 * 获取 Job 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job 详情
 */
function getJobDetail(clusterId: string, namespace: string, name: string): JobDetailResp {
  const job = mockJobs.find(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (!job) {
    console.error('[Get Job Detail] can not find job:', clusterId, namespace, name)
    return null as unknown as JobDetailResp
  }
  return {
    ...job,
    backoffLimit: 6,
    activeDeadlineSeconds: 3600,
    selector: { app: job.name },
    containers: [
      {
        name: job.name,
        image: 'busybox:latest',
        imagePullPolicy: 'IfNotPresent',
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        command: ['/bin/sh', '-c'],
        args: [`echo "Running ${job.name}"`]
      }
    ]
  }
}

/**
 * 查看 Job YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @returns Job YAML 配置
 */
function getJobYaml(clusterId: string, namespace: string, name: string): string {
  const job = mockJobs.find(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (!job) {
    console.error('[Get Job Yaml] can not find job:', clusterId, namespace, name)
    return ''
  }

  const yaml = `apiVersion: batch/v1
kind: Job
metadata:
  name: ${job.name}
  namespace: ${job.namespace}
  creationTimestamp: "${job.createAt}"
  uid: "${job.uid}"
spec:
  parallelism: ${job.parallelism}
  completions: ${job.completions}
  template:
    spec:
      containers:
      - name: ${job.name}
        image: busybox:latest
        command: ["/bin/sh", "-c"]
        args: ["echo 'Running ${job.name}'"]
      restartPolicy: Never
status:
  succeeded: ${job.succeeded}
  active: ${job.active}`

  return yaml
}

/**
 * 创建 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createJob(clusterId: string, namespace: string, data: JobReq): void {
  console.log('[Mock] createJob', { clusterId, namespace, data })
}

/**
 * 更新 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 更新数据
 */
function updateJob(clusterId: string, namespace: string, name: string, data: Partial<JobReq>): void {
  console.log('[Mock] updateJob', { clusterId, namespace, name, data })
}

/**
 * 更新 Job 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 标签数据
 */
function manageJobLabels(clusterId: string, namespace: string, name: string, data: JobLabelsReq): void {
  console.log('[Mock] manageJobLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 Job 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 * @param data - 注解数据
 */
function manageJobAnnotations(clusterId: string, namespace: string, name: string, data: JobAnnotationsReq): void {
  console.log('[Mock] manageJobAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Job 名称
 */
function deleteJob(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteJob', { clusterId, namespace, name })
}

/**
 * 批量删除 Job
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Job 名称数组
 */
function deleteJobs(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteJobs', { clusterId, namespace, names })
}

/**
 * 导出 Job CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportJob(clusterId: string, params: Partial<JobQueryReq>): void {
  console.log('[Mock] exportJob', { clusterId, params })
}

/**
 * 导入 Job
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importJob(clusterId: string, data: JobYamlReq): void {
  console.log('[Mock] importJob', { clusterId, data })
}

/**
 * 模拟 Job 数据
 * @remarks 包含数据库备份、数据导入、模型训练、缓存预热、日志清理等多种批量任务
 */
const mockJobs: JobListResp[] = [
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'db-backup-20240320',
    namespace: 'data',
    clusterId: 'c1',
    description: '每日数据库全量备份任务',
    status: 'Succeeded',
    statusMessage: '备份完成，共 2.3GB',
    parallelism: 1,
    completions: 1,
    succeeded: 1,
    active: 0,
    startTime: '2024-03-20 02:00:00',
    completionTime: '2024-03-20 02:15:00',
    createAt: '2024-03-20 02:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 02:15:00',
    updateBy: 'system',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'data-import-001',
    namespace: 'etl',
    clusterId: 'c1',
    description: '外部数据源批量导入任务',
    status: 'Failed',
    statusMessage: '数据源连接失败，超过最大重试次数',
    parallelism: 2,
    completions: 1,
    succeeded: 0,
    active: 0,
    startTime: '2024-03-19 10:00:00',
    completionTime: '2024-03-19 10:30:00',
    createAt: '2024-03-19 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 10:30:00',
    updateBy: 'system',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'model-training',
    namespace: 'ml',
    clusterId: 'c1',
    description: 'PyTorch 分布式模型训练任务',
    status: 'Active',
    statusMessage: '训练进行中，当前 epoch: 45/100',
    parallelism: 4,
    completions: 1,
    succeeded: 0,
    active: 4,
    startTime: '2024-03-20 08:00:00',
    completionTime: undefined,
    createAt: '2024-03-20 08:00:00',
    createBy: 'ml-engineer',
    updateAt: '2024-03-20 08:00:00',
    updateBy: 'ml-engineer',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'cache-warmup',
    namespace: 'middleware',
    clusterId: 'c1',
    description: 'Redis 缓存预热脚本',
    status: 'Succeeded',
    statusMessage: '缓存预热完成，已加载 50000 个 key',
    parallelism: 1,
    completions: 1,
    succeeded: 1,
    active: 0,
    startTime: '2024-03-19 00:00:00',
    completionTime: '2024-03-19 00:10:00',
    createAt: '2024-03-19 00:00:00',
    createBy: 'system',
    updateAt: '2024-03-19 00:10:00',
    updateBy: 'system',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'log-cleanup-daily',
    namespace: 'logging',
    clusterId: 'c1',
    description: '每日日志归档与清理',
    status: 'Succeeded',
    statusMessage: '已清理 15 天前的日志，释放 8.5GB 空间',
    parallelism: 1,
    completions: 1,
    succeeded: 1,
    active: 0,
    startTime: '2024-03-21 01:00:00',
    completionTime: '2024-03-21 01:08:00',
    createAt: '2024-03-21 01:00:00',
    createBy: 'system',
    updateAt: '2024-03-21 01:08:00',
    updateBy: 'system',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'report-generate-q1',
    namespace: 'analytics',
    clusterId: 'c1',
    description: 'Q1 季度财务报表生成',
    status: 'Active',
    statusMessage: '正在生成报表，已完成 3/12 个维度',
    parallelism: 3,
    completions: 1,
    succeeded: 0,
    active: 3,
    startTime: '2024-03-21 09:30:00',
    completionTime: undefined,
    createAt: '2024-03-21 09:30:00',
    createBy: 'analyst',
    updateAt: '2024-03-21 09:30:00',
    updateBy: 'analyst',
    deletable: true,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'ssl-cert-renewal',
    namespace: 'kube-system',
    clusterId: 'c1',
    description: 'SSL 证书自动续期',
    status: 'Failed',
    statusMessage: '证书签发接口返回 500，重试已达上限',
    parallelism: 1,
    completions: 1,
    succeeded: 0,
    active: 0,
    startTime: '2024-03-20 23:00:00',
    completionTime: '2024-03-20 23:05:00',
    createAt: '2024-03-20 23:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 23:05:00',
    updateBy: 'system',
    deletable: false,
  },
  {
    id: generateId(),
    uid: `job-uid-${generateId()}`,
    name: 'index-rebuild',
    namespace: 'search',
    clusterId: 'c1',
    description: 'Elasticsearch 索引重建',
    status: 'Succeeded',
    statusMessage: '索引重建完成，共处理 120 万文档',
    parallelism: 2,
    completions: 1,
    succeeded: 1,
    active: 0,
    startTime: '2024-03-20 03:00:00',
    completionTime: '2024-03-20 04:45:00',
    createAt: '2024-03-20 03:00:00',
    createBy: 'devops',
    updateAt: '2024-03-20 04:45:00',
    updateBy: 'devops',
    deletable: true,
  }
]
