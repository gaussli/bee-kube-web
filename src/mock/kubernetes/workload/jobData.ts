/**
 * Kubernetes Job 模拟数据
 * @module mock/kubernetes/workload/jobData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { PodListVo } from '@/types/kubernetes/pod'
import type { JobDetailVo, JobListVo, JobYamlVo } from '@/types/kubernetes/workload/job'

import { generateId } from '@/mock/utils'

/** Job 列表 Mock 数据 */
export const jobMockData: JobListVo[] = [
  {
    uid: 'job-001',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'data-backup-job',
    description: '数据备份任务',
    status: 'Succeeded',
    statusMsg: '任务已成功完成',
    active: 0,
    succeeded: 3,
    failed: 0,
    completions: 3,
    parallelism: 2,
    createAt: '2024-01-15 10:30:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:25:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'job-002',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'image-resize-job',
    description: '图片批量处理任务',
    status: 'Active',
    statusMsg: '任务运行中',
    active: 2,
    succeeded: 1,
    failed: 0,
    completions: 4,
    parallelism: 2,
    createAt: '2024-01-16 09:15:00',
    createBy: 'admin',
    updateAt: '2024-02-21 11:10:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'job-003',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'report-generate-job',
    description: '报表生成任务',
    status: 'Failed',
    statusMsg: '重试次数超过限制',
    active: 0,
    succeeded: 0,
    failed: 3,
    completions: 1,
    parallelism: 1,
    createAt: '2024-01-17 16:45:00',
    createBy: 'admin',
    updateAt: '2024-02-22 08:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'job-004',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-test',
    namespace: 'test',
    name: 'data-migration-job',
    description: '数据迁移任务',
    status: 'Active',
    statusMsg: '任务运行中',
    active: 1,
    succeeded: 2,
    failed: 0,
    completions: 3,
    parallelism: 1,
    createAt: '2024-01-18 13:20:00',
    createBy: 'admin',
    updateAt: '2024-02-23 19:00:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: 'job-005',
    clusterUid: 'cluster-003',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'cache-warm-job',
    description: '缓存预热任务',
    status: 'Succeeded',
    statusMsg: '任务已成功完成',
    active: 0,
    succeeded: 5,
    failed: 0,
    completions: 5,
    parallelism: 3,
    createAt: '2024-01-19 11:05:00',
    createBy: 'admin',
    updateAt: '2024-02-24 15:40:00',
    updateBy: 'admin',
    deletable: true,
  },
]

/**
 * Job 详情模拟数据
 * @remarks 对应 JobDetailVo，以 data-backup-job 为示例，覆盖 metadata / spec / statusObj 三层结构
 */
export const jobMockDetail: JobDetailVo = {
  uid: 'job-001',
  clusterUid: 'cluster-001',
  cluster: 'system-cluster',
  namespaceUid: 'ns-default',
  namespace: 'default',
  description: '数据备份任务',
  status: 'Succeeded',
  statusMsg: '任务已成功完成',
  name: 'data-backup-job',
  resourceVersion: '1',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: { 'app.kubernetes.io/name': 'data-backup-job' },
  annotations: {},
  spec: {
    parallelism: 2,
    completions: 3,
    backoffLimit: 6,
    activeDeadlineSeconds: 0,
    ttlSecondsAfterFinished: 0,
    suspend: false,
    template: {
      metadata: { labels: { 'app.kubernetes.io/name': 'data-backup-job' }, annotations: {} },
      spec: {} as never,
    },
  },
  statusObj: {
    active: 0,
    succeeded: 3,
    failed: 0,
    startTime: '2024-01-15T10:30:00Z',
    completionTime: '2024-01-15T11:30:00Z',
    conditions: [],
  },
  createAt: '2024-01-15 10:30:00',
  createBy: 'admin',
  updateAt: '2024-02-20 14:25:00',
  updateBy: 'admin',
  deletable: true,
}

/**
 * Job YAML 模拟数据
 * @remarks 对应 JobYamlVo
 */
export const jobMockYaml: JobYamlVo = {
  yaml: `apiVersion: batch/v1
kind: Job
metadata:
  name: data-backup-job
  namespace: default
spec:
  parallelism: 1
  completions: 1
  template:
    metadata:
      labels:
        app: data-backup-job
    spec:
      containers:
      - name: data-backup-job
        image: data-backup-job:latest
      restartPolicy: Never`,
}

/**
 * Job 关联 Pod 模拟数据
 * @remarks 对应 JobPodListVo
 */
export const jobMockPods: PodListVo[] = [
  {
    uid: generateId(),
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'data-backup-job-pod-1',
    ip: '10.244.1.10',
    status: 'Succeeded',
    statusMsg: '已成功',
    restarts: 0,
    nodeIp: '192.168.1.10',
    nodeName: 'node-1',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        'cpu': { value: 450, unit: 'm' },
        'memory': { value: 480, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
    createAt: '2024-01-15 10:30:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:30:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'data-backup-job-pod-2',
    ip: '10.244.2.11',
    status: 'Succeeded',
    statusMsg: '已成功',
    restarts: 0,
    nodeIp: '192.168.1.11',
    nodeName: 'node-2',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        'cpu': { value: 440, unit: 'm' },
        'memory': { value: 470, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
    createAt: '2024-01-15 10:30:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:30:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'data-backup-job-pod-3',
    ip: '10.244.3.12',
    status: 'Succeeded',
    statusMsg: '已成功',
    restarts: 0,
    nodeIp: '192.168.1.12',
    nodeName: 'node-3',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        'cpu': { value: 430, unit: 'm' },
        'memory': { value: 460, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
    createAt: '2024-01-15 10:30:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:30:00',
    updateBy: 'system',
  },
]

/**
 * Job 事件模拟数据
 * @remarks 对应 EventListVo，覆盖 Normal 类型事件
 */
export const jobMockEvents: EventListVo[] = [
  {
    name: 'data-backup-job-event',
    namespace: 'default',
    uid: 'job-event-1',
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2024-01-15T10:30:00Z',
    reportingController: 'batch/Job',
    reportingInstance: 'job-controller',
    action: 'Create',
    reason: 'Created',
    regarding: {
      apiVersion: 'batch/v1',
      kind: 'Job',
      name: 'data-backup-job',
      namespace: 'default',
      uid: 'job-event-1',
    },
    note: 'Job data-backup-job 创建成功',
    type: 'Normal',
  },
]
