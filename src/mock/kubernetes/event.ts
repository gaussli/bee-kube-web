/**
 * Kubernetes 事件管理 Mock API
 * @module mock/kubernetes/event
 */
import type { PageVo } from '@/types/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

/**
 * 事件路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/events - 获取集群事件分页列表
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/events',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }): PageVo<EventListVo> =>
      getEventList(pathParams.clusterUid, params),
  },
]

/**
 * ObjectMeta 必填字段的基础 mock 值
 * @remarks Event 继承 ObjectMeta，需补齐 resourceVersion/generation 等字段
 */
const baseEventMeta = {
  labels: {} as Record<string, string>,
  annotations: {} as Record<string, string>,
  resourceVersion: '0',
  generation: 0,
  deletionTimestamp: '',
  ownerReferences: [] as string[],
  finalizers: [] as string[],
}

/**
 * 获取集群事件分页列表
 * @param _clusterUid - 集群 UID
 * @param query - 查询参数
 * @returns 分页数据
 */
function getEventList(_clusterUid: string, query: Partial<EventQueryForm>): PageVo<EventListVo> {
  const { type, reason, note, regarding, page = 1, pageSize = 10 } = query || {}

  let filtered = [...mockEvents]

  if (type) {
    filtered = filtered.filter(e => e.type === type)
  }
  if (reason) {
    filtered = filtered.filter(e => e.reason.includes(reason))
  }
  if (note) {
    filtered = filtered.filter(e => (e.note ?? '').includes(note))
  }
  if (regarding) {
    filtered = filtered.filter(e => {
      const g = e.regarding
      if (!g) return false
      if (regarding.kind && g.kind !== regarding.kind) return false
      if (regarding.name && !g.name.includes(regarding.name)) return false
      if (regarding.namespace && g.namespace !== regarding.namespace) return false
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
 * 模拟事件数据
 * @remarks 对齐 events.k8s.io/v1，包含 Normal 和 Warning 两种类型的事件
 */
const mockEvents: EventListVo[] = [
  {
    ...baseEventMeta,
    name: 'event-scheduled-001',
    namespace: 'default',
    uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    eventTime: '2025-08-05T10:30:00Z',
    reportingController: 'kubernetes.io/kube-scheduler',
    reportingInstance: 'kube-scheduler-prod-master-01',
    action: 'Scheduling',
    reason: 'Scheduled',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    note: 'Successfully assigned default/nginx-deployment to node-prod-01',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-pulling-002',
    namespace: 'default',
    uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    eventTime: '2025-08-05T10:30:05Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-01',
    action: 'Pulling',
    reason: 'Pulling',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    note: 'Pulling image "nginx:1.25.3"',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-pulled-003',
    namespace: 'default',
    uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
    eventTime: '2025-08-05T10:30:18Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-01',
    action: 'Pulled',
    reason: 'Pulled',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    note: 'Successfully pulled image "nginx:1.25.3" in 12.345s',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-created-004',
    namespace: 'default',
    uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567893',
    eventTime: '2025-08-05T10:30:19Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-01',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    note: 'Created container nginx',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-started-005',
    namespace: 'default',
    uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567894',
    eventTime: '2025-08-05T10:30:20Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-01',
    action: 'Started',
    reason: 'Started',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    note: 'Started container nginx',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-scaling-006',
    namespace: 'default',
    uid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    eventTime: '2025-08-05T10:35:00Z',
    reportingController: 'apps/Deployment',
    reportingInstance: 'deployment-controller-prod-master-01',
    action: 'Scale',
    reason: 'ScalingReplicaSet',
    regarding: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: 'nginx-deployment',
      namespace: 'default',
      uid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    },
    note: 'Scaled up replica set nginx-deployment-7d6f8b9c4 from 2 to 3',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-failed-scheduling-007',
    namespace: 'production',
    uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
    eventTime: '2025-08-05T10:32:15Z',
    reportingController: 'kubernetes.io/kube-scheduler',
    reportingInstance: 'kube-scheduler-prod-master-01',
    action: 'FailedScheduling',
    reason: 'FailedScheduling',
    series: {
      count: 5,
      lastObservedTime: '2025-08-05T10:32:15Z',
      state: 'EventSeriesStateWindingDown',
    },
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'redis-pod-5c8d7e6f9-xyz45',
      namespace: 'production',
      uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
    },
    note: '0/5 nodes are available: 3 Insufficient cpu, 2 node(s) had taint that the pod didn\'t tolerate.',
    type: 'Warning',
  },
  {
    ...baseEventMeta,
    name: 'event-failed-008',
    namespace: 'production',
    uid: 'd4e5f6a7-b8c9-0123-defa-345678901234',
    eventTime: '2025-08-05T10:33:42Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-03',
    action: 'Failed',
    reason: 'Failed',
    series: {
      count: 12,
      lastObservedTime: '2025-08-05T10:33:42Z',
      state: 'EventSeriesStateWindingDown',
    },
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'mysql-pod-9a8b7c6d5-efg67',
      namespace: 'production',
      uid: 'd4e5f6a7-b8c9-0123-defa-345678901234',
    },
    note: 'Error: ImagePullBackOff',
    type: 'Warning',
  },
  {
    ...baseEventMeta,
    name: 'event-unhealthy-009',
    namespace: 'staging',
    uid: 'e5f6a7b8-c9d0-1234-efab-456789012345',
    eventTime: '2025-08-05T10:34:18Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-02',
    action: 'Unhealthy',
    reason: 'Unhealthy',
    series: {
      count: 3,
      lastObservedTime: '2025-08-05T10:34:18Z',
      state: 'EventSeriesStateWindingDown',
    },
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'api-gateway-7b6c5d4e3-hij78',
      namespace: 'staging',
      uid: 'e5f6a7b8-c9d0-1234-efab-456789012345',
    },
    note: 'Readiness probe failed: Get "http://10.244.1.15:8080/healthz": dial tcp 10.244.1.15:8080: connect: connection refused',
    type: 'Warning',
  },
  {
    ...baseEventMeta,
    name: 'event-killing-010',
    namespace: 'default',
    uid: 'f6a7b8c9-d0e1-2345-fabc-567890123456',
    eventTime: '2025-08-05T10:36:00Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-01',
    action: 'Killing',
    reason: 'Killing',
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-def34',
      namespace: 'default',
      uid: 'f6a7b8c9-d0e1-2345-fabc-567890123456',
    },
    note: 'Stopping container nginx due to pod eviction',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-successful-create-011',
    namespace: 'default',
    uid: 'a7b8c9d0-e1f2-3456-abcd-678901234567',
    eventTime: '2025-08-05T10:37:00Z',
    reportingController: 'apps/ReplicaSet',
    reportingInstance: 'replicaset-controller-prod-master-01',
    action: 'Create',
    reason: 'SuccessfulCreate',
    regarding: {
      apiVersion: 'apps/v1',
      kind: 'ReplicaSet',
      name: 'nginx-deployment-7d6f8b9c4',
      namespace: 'default',
      uid: 'a7b8c9d0-e1f2-3456-abcd-678901234567',
    },
    note: 'Created pod: nginx-deployment-7d6f8b9c4-ghi90',
    type: 'Normal',
  },
  {
    ...baseEventMeta,
    name: 'event-backoff-012',
    namespace: 'production',
    uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
    eventTime: '2025-08-05T10:38:30Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet-prod-node-02',
    action: 'BackOff',
    reason: 'BackOff',
    series: {
      count: 20,
      lastObservedTime: '2025-08-05T10:38:30Z',
      state: 'EventSeriesStateWindingDown',
    },
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'redis-pod-5c8d7e6f9-xyz45',
      namespace: 'production',
      uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
    },
    note: 'Back-off restarting failed container redis in pod redis-pod-5c8d7e6f9-xyz45',
    type: 'Warning',
  },
]
