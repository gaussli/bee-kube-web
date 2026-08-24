/**
 * Kubernetes StatefulSet 模拟数据
 * @module mock/kubernetes/workload/statefulsetData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { PodListVo } from '@/types/kubernetes/pod'
import type {
  StatefulSetDetailVo,
  StatefulSetHistoryRevisionListVo,
  StatefulSetListVo,
  StatefulSetNetworkVo,
  StatefulSetYamlVo,
} from '@/types/kubernetes/workload/statefulset'

import { generateId } from '@/mock/utils'

/** StatefulSet 列表 Mock 数据 */
export const statefulSetMockData: StatefulSetListVo[] = [
  {
    uid: 'sts-001',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'mysql-sts',
    description: 'MySQL 有状态服务',
    status: 'Running',
    statusMsg: '所有副本已就绪',
    replicas: 3,
    readyReplicas: 3,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:25:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'sts-002',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-production',
    namespace: 'production',
    name: 'redis-sts',
    description: 'Redis 有状态服务',
    status: 'Running',
    statusMsg: '所有副本已就绪',
    replicas: 6,
    readyReplicas: 6,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-16 09:15:00',
    createBy: 'admin',
    updateAt: '2024-02-21 11:10:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'sts-003',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'mongodb-sts',
    description: 'MongoDB 有状态服务',
    status: 'Creating',
    statusMsg: '等待 Pod 调度',
    replicas: 2,
    readyReplicas: 1,
    updateStrategyType: 'OnDelete',
    createAt: '2024-01-17 16:45:00',
    createBy: 'admin',
    updateAt: '2024-02-22 08:30:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: 'sts-004',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-test',
    namespace: 'test',
    name: 'zookeeper-sts',
    description: 'ZooKeeper 有状态服务',
    status: 'Failed',
    statusMsg: 'StorageClass 不存在',
    replicas: 3,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-18 13:20:00',
    createBy: 'admin',
    updateAt: '2024-02-23 19:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'sts-005',
    clusterUid: 'cluster-003',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'kafka-sts',
    description: 'Kafka 有状态服务',
    status: 'Running',
    statusMsg: '所有副本已就绪',
    replicas: 3,
    readyReplicas: 3,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-19 11:05:00',
    createBy: 'admin',
    updateAt: '2024-02-24 15:40:00',
    updateBy: 'admin',
    deletable: true,
  },
]

/**
 * StatefulSet 详情模拟数据
 * @remarks 对应 StatefulSetDetailVo，以 mysql-sts 为示例，覆盖 metadata / spec / statusObj 三层结构
 */
export const statefulSetMockDetail: StatefulSetDetailVo = {
  uid: 'sts-001',
  clusterUid: 'cluster-001',
  cluster: 'system-cluster',
  namespaceUid: 'ns-default',
  namespace: 'default',
  description: 'MySQL 有状态服务',
  status: 'Running',
  statusMsg: '所有副本已就绪',
  name: 'mysql-sts',
  resourceVersion: '1',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: { 'app.kubernetes.io/name': 'mysql-sts' },
  annotations: {},
  spec: {
    replicas: 3,
    serviceName: 'mysql-sts-service',
    selector: { matchLabels: { 'app.kubernetes.io/name': 'mysql-sts' }, matchExpressions: [] },
    podManagementPolicy: 'OrderedReady',
    updateStrategy: {
      type: 'RollingUpdate',
      rollingUpdate: {
        maxUnavailable: '1',
        maxSurge: '1',
      },
    },
    minReadySeconds: 0,
    revisionHistoryLimit: 10,
    template: {
      metadata: { labels: { 'app.kubernetes.io/name': 'mysql-sts' }, annotations: {} },
      spec: {} as never,
    },
    volumeClaimTemplates: [
      {
        metadata: {
          name: 'data',
          namespace: 'default',
          uid: 'sts-pvc-001',
          resourceVersion: '1',
          generation: 1,
          deletionTimestamp: '',
          ownerReferences: [],
          finalizers: [],
          labels: { 'app.kubernetes.io/name': 'mysql-sts' },
          annotations: {},
        },
      },
    ],
  },
  statusObj: {
    observedGeneration: 1,
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    updatedReplicas: 3,
    currentRevision: 'sts-rev-1',
    updateRevision: 'sts-rev-1',
    collisionCount: 0,
    conditions: [],
  },
  createAt: '2024-01-15 10:30:00',
  createBy: 'admin',
  updateAt: '2024-02-20 14:25:00',
  updateBy: 'admin',
  deletable: true,
}

/**
 * StatefulSet YAML 模拟数据
 * @remarks 对应 StatefulSetYamlVo
 */
export const statefulSetMockYaml: StatefulSetYamlVo = {
  yaml: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-sts
  namespace: default
spec:
  serviceName: mysql-sts-service
  replicas: 3
  selector:
    matchLabels:
      app: mysql-sts
  template:
    metadata:
      labels:
        app: mysql-sts
    spec:
      containers:
      - name: mysql-sts
        image: mysql-sts:latest`,
}

/**
 * StatefulSet 关联 Pod 模拟数据
 * @remarks 对应 StatefulSetPodListVo
 */
export const statefulSetMockPods: PodListVo[] = [
  {
    uid: generateId(),
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'mysql-sts-pod-1',
    ip: '10.244.1.10',
    status: 'Running',
    statusMsg: '运行中',
    restarts: 0,
    nodeIp: '192.168.1.10',
    nodeName: 'node-1',
    readyContainerCount: 2,
    containerCount: 2,
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
        'cpu': { value: 320, unit: 'm' },
        'memory': { value: 400, unit: 'Mi' },
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
    name: 'mysql-sts-pod-2',
    ip: '10.244.2.11',
    status: 'Running',
    statusMsg: '运行中',
    restarts: 0,
    nodeIp: '192.168.1.11',
    nodeName: 'node-2',
    readyContainerCount: 2,
    containerCount: 2,
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
        'cpu': { value: 300, unit: 'm' },
        'memory': { value: 420, unit: 'Mi' },
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
    name: 'mysql-sts-pod-3',
    ip: '10.244.3.12',
    status: 'Running',
    statusMsg: '运行中',
    restarts: 0,
    nodeIp: '192.168.1.12',
    nodeName: 'node-3',
    readyContainerCount: 2,
    containerCount: 2,
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
        'cpu': { value: 310, unit: 'm' },
        'memory': { value: 410, unit: 'Mi' },
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
 * StatefulSet 历史版本模拟数据
 * @remarks 对应 StatefulSetHistoryRevisionListVo
 */
export const statefulSetMockHistoryRevisions: StatefulSetHistoryRevisionListVo[] = [
  { revision: 1, changeCause: '版本 1 更新', createAt: '2024-01-15 10:30:00', active: false },
  { revision: 2, changeCause: '版本 2 更新', createAt: '2024-02-01 18:30:00', active: false },
  { revision: 3, changeCause: '版本 3 更新', createAt: '2024-02-10 09:00:00', active: false },
  { revision: 4, changeCause: '版本 4 更新', createAt: '2024-02-20 14:25:00', active: false },
  { revision: 5, changeCause: '版本 5 更新', createAt: '2024-02-24 15:40:00', active: true },
]

/**
 * StatefulSet 关联网络资源模拟数据
 * @remarks 对应 StatefulSetNetworkVo，包含关联的 Service 与 Ingress 列表
 */
export const statefulSetMockNetwork: StatefulSetNetworkVo = {
  services: [
    {
      uid: 'sts-svc-001',
      name: 'mysql-sts-service',
      description: 'StatefulSet 无头服务',
      type: 'ClusterIP',
      clusterIp: 'None',
      externalName: '',
      headless: true,
      createAt: '2024-01-15 10:30:00',
      createBy: 'admin',
      updateAt: '2024-01-15 10:30:00',
      updateBy: 'admin',
    },
  ],
  ingresses: [
    {
      uid: 'sts-ing-001',
      name: 'mysql-sts-ingress',
      description: 'StatefulSet 入口',
      ingressClassName: 'nginx',
      defaultBackendService: 'mysql-sts-service',
      ruleCount: 1,
      tlsCount: 0,
      createAt: '2024-01-15 10:30:00',
      createBy: 'admin',
      updateAt: '2024-01-15 10:30:00',
      updateBy: 'admin',
    },
  ],
}

/**
 * StatefulSet 事件模拟数据
 * @remarks 对应 EventListVo，覆盖 Normal 类型事件
 */
export const statefulSetMockEvents: EventListVo[] = [
  {
    name: 'mysql-sts-event',
    namespace: 'default',
    uid: 'sts-event-1',
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2024-01-15T10:30:00Z',
    reportingController: 'apps/StatefulSet',
    reportingInstance: 'statefulset-controller',
    action: 'Create',
    reason: 'Created',
    regarding: {
      apiVersion: 'apps/v1',
      kind: 'StatefulSet',
      name: 'mysql-sts',
      namespace: 'default',
      uid: 'sts-event-1',
    },
    note: 'StatefulSet mysql-sts 创建成功',
    type: 'Normal',
  },
]
