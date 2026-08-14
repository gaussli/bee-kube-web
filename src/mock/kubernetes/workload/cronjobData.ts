/**
 * Kubernetes CronJob 模拟数据
 * @module mock/kubernetes/workload/cronjobData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  CronJobDetailVo,
  CronJobJobListVo,
  CronJobListVo,
  CronJobYamlVo,
} from '@/types/kubernetes/workload/cronjob'

import { generateId } from '@/mock/utils'

/** CronJob 列表 Mock 数据 */
export const cronJobMockData: CronJobListVo[] = [
  {
    uid: 'cronjob-001',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'log-cleanup-cron',
    description: '日志清理定时任务',
    status: 'Active',
    statusMsg: '调度正常',
    schedule: '0 2 * * *',
    active: 1,
    lastScheduleTime: '2024-02-25 02:00:00',
    suspend: false,
    createAt: '2024-01-15 10:30:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:25:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'cronjob-002',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'database-backup-cron',
    description: '数据库备份定时任务',
    status: 'Active',
    statusMsg: '调度正常',
    schedule: '*/30 * * * *',
    active: 0,
    lastScheduleTime: '2024-02-25 14:30:00',
    suspend: false,
    createAt: '2024-01-16 09:15:00',
    createBy: 'admin',
    updateAt: '2024-02-21 11:10:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'cronjob-003',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'report-email-cron',
    description: '报表邮件定时任务',
    status: 'Suspended',
    statusMsg: '已暂停',
    schedule: '0 8 * * 1',
    active: 0,
    lastScheduleTime: '2024-02-24 08:00:00',
    suspend: true,
    createAt: '2024-01-17 16:45:00',
    createBy: 'admin',
    updateAt: '2024-02-22 08:30:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: 'cronjob-004',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-test',
    namespace: 'test',
    name: 'data-sync-cron',
    description: '数据同步定时任务',
    status: 'Active',
    statusMsg: '调度正常',
    schedule: '*/10 * * * *',
    active: 2,
    lastScheduleTime: '2024-02-25 14:40:00',
    suspend: false,
    createAt: '2024-01-18 13:20:00',
    createBy: 'admin',
    updateAt: '2024-02-23 19:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'cronjob-005',
    clusterUid: 'cluster-003',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'cache-clear-cron',
    description: '缓存清理定时任务',
    status: 'Unknown',
    statusMsg: '最近调度异常',
    schedule: '0 */6 * * *',
    active: 0,
    lastScheduleTime: '2024-02-25 12:00:00',
    suspend: false,
    createAt: '2024-01-19 11:05:00',
    createBy: 'admin',
    updateAt: '2024-02-24 15:40:00',
    updateBy: 'admin',
    deletable: true,
  },
]

/**
 * CronJob 详情模拟数据
 * @remarks 对应 CronJobDetailVo，以 log-cleanup-cron 为示例，覆盖 metadata / spec / statusObj 三层结构
 */
export const cronJobMockDetail: CronJobDetailVo = {
  uid: 'cronjob-001',
  clusterUid: 'cluster-001',
  cluster: 'system-cluster',
  namespaceUid: 'ns-default',
  namespace: 'default',
  description: '日志清理定时任务',
  status: 'Active',
  statusMsg: '调度正常',
  metadata: {
    name: 'log-cleanup-cron',
    namespace: 'default',
    uid: 'cronjob-001',
    resourceVersion: '1',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: { 'app.kubernetes.io/name': 'log-cleanup-cron' },
    annotations: {},
  },
  spec: {
    schedule: '0 2 * * *',
    timeZone: '',
    startingDeadlineSeconds: 0,
    concurrencyPolicy: 'Allow',
    suspend: false,
    successfulJobsHistoryLimit: 3,
    failedJobsHistoryLimit: 1,
    jobTemplate: {
      metadata: { labels: { 'app.kubernetes.io/name': 'log-cleanup-cron' }, annotations: {} },
      spec: {} as never,
    },
  },
  statusObj: {
    active: 1,
    lastScheduleTime: '2024-02-25T02:00:00Z',
    lastSuccessfulTime: '2024-02-25T02:00:00Z',
    conditions: [],
  },
  createAt: '2024-01-15 10:30:00',
  createBy: 'admin',
  updateAt: '2024-02-20 14:25:00',
  updateBy: 'admin',
  deletable: true,
}

/**
 * CronJob YAML 模拟数据
 * @remarks 对应 CronJobYamlVo
 */
export const cronJobMockYaml: CronJobYamlVo = {
  yaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: log-cleanup-cron
  namespace: default
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: log-cleanup-cron
            image: log-cleanup-cron:latest
          restartPolicy: OnFailure`,
}

/**
 * CronJob 关联 Job 模拟数据
 * @remarks 对应 CronJobJobListVo
 */
export const cronJobMockJobs: CronJobJobListVo[] = [
  {
    uid: generateId(),
    name: 'log-cleanup-cron-job-1',
    status: 'Succeeded',
    statusMsg: '已完成',
    active: 0,
    succeeded: 1,
    failed: 0,
    completions: 1,
    parallelism: 1,
    startTime: '2024-02-25 02:00:00',
    completionTime: '2024-02-25 02:10:00',
    createAt: '2024-02-25 02:00:00',
    createBy: 'system',
    updateAt: '2024-02-25 02:10:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'log-cleanup-cron-job-2',
    status: 'Succeeded',
    statusMsg: '已完成',
    active: 0,
    succeeded: 1,
    failed: 0,
    completions: 1,
    parallelism: 1,
    startTime: '2024-02-24 02:00:00',
    completionTime: '2024-02-24 02:12:00',
    createAt: '2024-02-24 02:00:00',
    createBy: 'system',
    updateAt: '2024-02-24 02:12:00',
    updateBy: 'system',
  },
]

/**
 * CronJob 事件模拟数据
 * @remarks 对应 EventListVo，覆盖 Normal 类型事件
 */
export const cronJobMockEvents: EventListVo[] = [
  {
    name: 'log-cleanup-cron-event',
    namespace: 'default',
    uid: 'cronjob-event-1',
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2024-02-25T02:00:00Z',
    reportingController: 'batch/CronJob',
    reportingInstance: 'cronjob-controller',
    action: 'Create',
    reason: 'Created',
    regarding: {
      apiVersion: 'batch/v1',
      kind: 'CronJob',
      name: 'log-cleanup-cron',
      namespace: 'default',
      uid: 'cronjob-event-1',
    },
    note: 'CronJob log-cleanup-cron 创建成功',
    type: 'Normal',
  },
]
