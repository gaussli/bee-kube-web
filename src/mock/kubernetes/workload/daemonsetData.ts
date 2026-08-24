/**
 * Kubernetes DaemonSet 模拟数据
 * @module mock/kubernetes/workload/daemonsetData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  DaemonSetDetailVo,
  DaemonSetHistoryRevisionListVo,
  DaemonSetListVo,
  DaemonSetNetworkVo,
  DaemonSetYamlVo,
} from '@/types/kubernetes/workload/daemonset'
import type { PodListVo } from '@/types/kubernetes/pod'

import { generateId } from '@/mock/utils'

/** DaemonSet 列表 Mock 数据 */
export const daemonSetMockData: DaemonSetListVo[] = [
  {
    uid: 'ds-001',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'fluentd-agent',
    description: '日志采集守护应用',
    status: 'Running',
    statusMsg: '所有节点已调度',
    desiredNumberScheduled: 4,
    numberReady: 4,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:00',
    createBy: 'admin',
    updateAt: '2024-02-20 14:25:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'ds-002',
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'node-exporter',
    description: '节点监控指标采集',
    status: 'Running',
    statusMsg: '所有节点已调度',
    desiredNumberScheduled: 4,
    numberReady: 3,
    updateStrategyType: 'OnDelete',
    createAt: '2024-01-16 09:15:00',
    createBy: 'admin',
    updateAt: '2024-02-21 11:10:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'ds-003',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'storage-driver',
    description: '存储驱动守护应用',
    status: 'Creating',
    statusMsg: '等待节点调度',
    desiredNumberScheduled: 2,
    numberReady: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-17 16:45:00',
    createBy: 'admin',
    updateAt: '2024-02-22 08:30:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: 'ds-004',
    clusterUid: 'cluster-002',
    cluster: 'system-cluster',
    namespaceUid: 'ns-test',
    namespace: 'test',
    name: 'security-agent',
    description: '安全防护守护应用',
    status: 'Failed',
    statusMsg: '节点亲和性无法匹配',
    desiredNumberScheduled: 2,
    numberReady: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-18 13:20:00',
    createBy: 'admin',
    updateAt: '2024-02-23 19:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: 'ds-005',
    clusterUid: 'cluster-003',
    cluster: 'system-cluster',
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'csi-driver',
    description: 'CSI 存储驱动',
    status: 'Running',
    statusMsg: '所有节点已调度',
    desiredNumberScheduled: 3,
    numberReady: 3,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-19 11:05:00',
    createBy: 'admin',
    updateAt: '2024-02-24 15:40:00',
    updateBy: 'admin',
    deletable: true,
  },
]

/**
 * DaemonSet YAML 模拟数据
 * @remarks 对应 DaemonSetYamlVo，作为 YAML 查看/创建/更新的示例内容
 */
export const daemonSetMockYaml: DaemonSetYamlVo = {
  yaml: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-agent
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: fluentd-agent
  template:
    metadata:
      labels:
        app: fluentd-agent
    spec:
      containers:
      - name: fluentd-agent
        image: fluentd-agent:latest`,
}

/**
 * DaemonSet 关联 Pod 模拟数据
 * @remarks 对应 DaemonSetPodListVo，覆盖 Running、Pending 等状态
 */
export const daemonSetMockPods: PodListVo[] = [
  {
    uid: generateId(),
    clusterUid: 'cluster-001',
    cluster: 'system-cluster',
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'fluentd-agent-pod-1',
    ip: '10.244.1.11',
    status: 'Running',
    statusMsg: '运行中',
    restarts: 0,
    nodeIp: '192.168.1.11',
    nodeName: 'node-1',
    readyContainerCount: 2,
    containerCount: 2,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 120, unit: 'm' },
        'memory': { value: 180, unit: 'Mi' },
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
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'fluentd-agent-pod-2',
    ip: '10.244.2.12',
    status: 'Running',
    statusMsg: '运行中',
    restarts: 0,
    nodeIp: '192.168.1.12',
    nodeName: 'node-2',
    readyContainerCount: 2,
    containerCount: 2,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 110, unit: 'm' },
        'memory': { value: 170, unit: 'Mi' },
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
    namespaceUid: 'ns-kube-system',
    namespace: 'kube-system',
    name: 'fluentd-agent-pod-3',
    ip: '10.244.3.13',
    status: 'Pending',
    statusMsg: '容器创建中',
    restarts: 1,
    nodeIp: '192.168.1.13',
    nodeName: 'node-3',
    readyContainerCount: 1,
    containerCount: 2,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 500, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 0, unit: 'm' },
        'memory': { value: 0, unit: 'Mi' },
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
 * DaemonSet 历史版本模拟数据
 * @remarks 对应 DaemonSetHistoryRevisionListVo，覆盖当前活跃版本与历史回滚版本
 */
export const daemonSetMockHistoryRevisions: DaemonSetHistoryRevisionListVo[] = [
  {
    revision: 5,
    changeCause: '版本 5 更新',
    createAt: '2024-02-24 15:40:00',
    active: true,
  },
  {
    revision: 4,
    changeCause: '版本 4 更新',
    createAt: '2024-02-20 14:25:00',
    active: false,
  },
  {
    revision: 3,
    changeCause: '版本 3 更新',
    createAt: '2024-02-10 09:00:00',
    active: false,
  },
  {
    revision: 2,
    changeCause: '版本 2 更新',
    createAt: '2024-02-01 18:30:00',
    active: false,
  },
  {
    revision: 1,
    changeCause: '版本 1 更新',
    createAt: '2024-01-15 10:30:00',
    active: false,
  },
]

/**
 * DaemonSet 关联网络资源模拟数据
 * @remarks 对应 DaemonSetNetworkVo，包含关联的 Service 与 Ingress 列表
 */
export const daemonSetMockNetwork: DaemonSetNetworkVo = {
  services: [
    {
      uid: 'ds-svc-001',
      name: 'fluentd-agent-service',
      description: 'DaemonSet 服务',
      type: 'ClusterIP',
      clusterIp: '10.96.0.1',
      externalName: '',
      headless: false,
      createAt: '2024-01-15 10:30:00',
      createBy: 'admin',
      updateAt: '2024-01-15 10:30:00',
      updateBy: 'admin',
    },
  ],
  ingresses: [
    {
      uid: 'ds-ing-001',
      name: 'fluentd-agent-ingress',
      description: 'DaemonSet 入口',
      ingressClassName: 'nginx',
      defaultBackendService: 'fluentd-agent-service',
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
 * DaemonSet 事件模拟数据
 * @remarks 对应 EventListVo，覆盖 Normal 类型事件
 */
export const daemonSetMockEvents: EventListVo[] = [
  {
    name: 'fluentd-agent-event',
    namespace: 'kube-system',
    uid: 'ds-event-1',
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2024-01-15T10:30:00Z',
    reportingController: 'apps/DaemonSet',
    reportingInstance: 'daemonset-controller',
    action: 'Create',
    reason: 'Created',
    regarding: {
      apiVersion: 'apps/v1',
      kind: 'DaemonSet',
      name: 'fluentd-agent',
      namespace: 'kube-system',
      uid: 'ds-event-1',
    },
    note: 'DaemonSet fluentd-agent 创建成功',
    type: 'Normal',
  },
]

/**
 * DaemonSet 详情模拟数据
 * @remarks 对应 DaemonSetDetailVo，以 fluentd-agent 为示例，覆盖 metadata / spec / statusObj 三层结构
 */
export const daemonSetMockDetail: DaemonSetDetailVo = {
  uid: 'ds-001',
  clusterUid: 'cluster-001',
  cluster: 'system-cluster',
  namespaceUid: 'ns-kube-system',
  namespace: 'kube-system',
  description: '日志采集守护应用',
  status: 'Running',
  statusMsg: '所有节点已调度',
  name: 'fluentd-agent',
  resourceVersion: '1',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: { 'app.kubernetes.io/name': 'fluentd-agent' },
  annotations: {},
  spec: {
    selector: { matchLabels: { 'app.kubernetes.io/name': 'fluentd-agent' }, matchExpressions: [] },
    minReadySeconds: 0,
    updateStrategy: {
      type: 'RollingUpdate',
      rollingUpdate: {
        maxUnavailable: '1',
        maxSurge: '1',
      },
    },
    template: {
      metadata: { labels: { 'app.kubernetes.io/name': 'fluentd-agent' }, annotations: {} },
      spec: {} as never,
    },
  },
  statusObj: {
    observedGeneration: 1,
    desiredNumberScheduled: 4,
    currentNumberScheduled: 4,
    numberReady: 4,
    numberAvailable: 4,
    numberUnavailable: 0,
    updatedNumberScheduled: 4,
    collisionCount: 0,
    conditions: [],
  },
  createAt: '2024-01-15 10:30:00',
  createBy: 'admin',
  updateAt: '2024-02-20 14:25:00',
  updateBy: 'admin',
  deletable: true,
}
