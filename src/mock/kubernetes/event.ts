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
    handler: (pathParams: Record<string, string>, params: Partial<EventQueryForm>): PageVo<EventListVo> =>
      getEventList(pathParams.clusterUid, params),
  },
]

/**
 * 获取集群事件分页列表
 * @param _clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getEventList(_clusterUid: string, params: Partial<EventQueryForm>): PageVo<EventListVo> {
  const {
    type,
    reason,
    involvedObjectNamespace,
    involvedObjectName,
    involvedObjectType,
    page = 1,
    pageSize = 10,
  } = params || {}

  let filtered = [...mockEvents]

  if (type) {
    filtered = filtered.filter(e => e.type === type)
  }
  if (reason) {
    filtered = filtered.filter(e => e.reason.includes(reason))
  }
  if (involvedObjectNamespace) {
    filtered = filtered.filter(e => e.involvedObject.namespace === involvedObjectNamespace)
  }
  if (involvedObjectName) {
    filtered = filtered.filter(e => e.involvedObject.name.includes(involvedObjectName))
  }
  if (involvedObjectType) {
    filtered = filtered.filter(e => e.involvedObject.kind === involvedObjectType)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 模拟事件数据
 * @remarks 包含 Normal 和 Warning 两种类型的事件
 */
const mockEvents: EventListVo[] = [
  {
    type: 'Normal',
    reason: 'Scheduled',
    message: 'Successfully assigned default/nginx-deployment to node-prod-01',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      resourceVersion: '123456',
    },
    source: {
      component: 'kube-scheduler',
      host: 'prod-master-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:30:00',
    lastTimestamp: '2025-08-05 10:30:00',
  },
  {
    type: 'Normal',
    reason: 'Pulling',
    message: 'Pulling image "nginx:1.25.3"',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      resourceVersion: '123457',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:30:05',
    lastTimestamp: '2025-08-05 10:30:05',
  },
  {
    type: 'Normal',
    reason: 'Pulled',
    message: 'Successfully pulled image "nginx:1.25.3" in 12.345s',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      resourceVersion: '123458',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:30:18',
    lastTimestamp: '2025-08-05 10:30:18',
  },
  {
    type: 'Normal',
    reason: 'Created',
    message: 'Created container nginx',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      resourceVersion: '123459',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:30:19',
    lastTimestamp: '2025-08-05 10:30:19',
  },
  {
    type: 'Normal',
    reason: 'Started',
    message: 'Started container nginx',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-abc12',
      namespace: 'default',
      uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      resourceVersion: '123460',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:30:20',
    lastTimestamp: '2025-08-05 10:30:20',
  },
  {
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    message: 'Scaled up replica set nginx-deployment-7d6f8b9c4 from 2 to 3',
    involvedObject: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: 'nginx-deployment',
      namespace: 'default',
      uid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      resourceVersion: '123461',
    },
    source: {
      component: 'deployment-controller',
      host: 'prod-master-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:35:00',
    lastTimestamp: '2025-08-05 10:35:00',
  },
  {
    type: 'Warning',
    reason: 'FailedScheduling',
    message: "0/5 nodes are available: 3 Insufficient cpu, 2 node(s) had taint that the pod didn't tolerate.",
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'redis-pod-5c8d7e6f9-xyz45',
      namespace: 'production',
      uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
      resourceVersion: '123462',
    },
    source: {
      component: 'kube-scheduler',
      host: 'prod-master-01',
    },
    count: 5,
    firstTimestamp: '2025-08-05 09:00:00',
    lastTimestamp: '2025-08-05 10:32:15',
  },
  {
    type: 'Warning',
    reason: 'Failed',
    message: 'Error: ImagePullBackOff',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'mysql-pod-9a8b7c6d5-efg67',
      namespace: 'production',
      uid: 'd4e5f6a7-b8c9-0123-defa-345678901234',
      resourceVersion: '123463',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-03',
    },
    count: 12,
    firstTimestamp: '2025-08-05 08:15:00',
    lastTimestamp: '2025-08-05 10:33:42',
  },
  {
    type: 'Warning',
    reason: 'Unhealthy',
    message:
      'Readiness probe failed: Get "http://10.244.1.15:8080/healthz": dial tcp 10.244.1.15:8080: connect: connection refused',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'api-gateway-7b6c5d4e3-hij78',
      namespace: 'staging',
      uid: 'e5f6a7b8-c9d0-1234-efab-456789012345',
      resourceVersion: '123464',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-02',
    },
    count: 3,
    firstTimestamp: '2025-08-05 10:20:00',
    lastTimestamp: '2025-08-05 10:34:18',
  },
  {
    type: 'Normal',
    reason: 'Killing',
    message: 'Stopping container nginx due to pod eviction',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-deployment-7d6f8b9c4-def34',
      namespace: 'default',
      uid: 'f6a7b8c9-d0e1-2345-fabc-567890123456',
      resourceVersion: '123465',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:36:00',
    lastTimestamp: '2025-08-05 10:36:00',
  },
  {
    type: 'Normal',
    reason: 'SuccessfulCreate',
    message: 'Created pod: nginx-deployment-7d6f8b9c4-ghi90',
    involvedObject: {
      apiVersion: 'apps/v1',
      kind: 'ReplicaSet',
      name: 'nginx-deployment-7d6f8b9c4',
      namespace: 'default',
      uid: 'a7b8c9d0-e1f2-3456-abcd-678901234567',
      resourceVersion: '123466',
    },
    source: {
      component: 'replicaset-controller',
      host: 'prod-master-01',
    },
    count: 1,
    firstTimestamp: '2025-08-05 10:37:00',
    lastTimestamp: '2025-08-05 10:37:00',
  },
  {
    type: 'Warning',
    reason: 'BackOff',
    message: 'Back-off restarting failed container redis in pod redis-pod-5c8d7e6f9-xyz45',
    involvedObject: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'redis-pod-5c8d7e6f9-xyz45',
      namespace: 'production',
      uid: 'c3d4e5f6-a7b8-9012-cdef-234567890123',
      resourceVersion: '123467',
    },
    source: {
      component: 'kubelet',
      host: 'prod-node-02',
    },
    count: 20,
    firstTimestamp: '2025-08-05 09:05:00',
    lastTimestamp: '2025-08-05 10:38:30',
  },
]
