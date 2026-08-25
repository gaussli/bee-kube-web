/**
 * Kubernetes NetworkPolicy 模拟数据
 * @module mock/kubernetes/network/networkpolicyData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  NetworkPolicyDetailVo,
  NetworkPolicyListVo,
  NetworkPolicyYamlVo,
} from '@/types/kubernetes/network/networkpolicy'

import { generateId } from '@/mock/utils'

/**
 * 模拟 NetworkPolicy 列表数据
 */
export const mockNetworkPolicies: NetworkPolicyListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'default-deny-all',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '默认拒绝全部入站与出站流量',
    podCount: 0,
    policyTypes: ['Ingress', 'Egress'],
    ingressCount: 0,
    egressCount: 0,
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'allow-dns',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '允许 Pod 访问集群 DNS 服务',
    podCount: 4,
    policyTypes: ['Egress'],
    ingressCount: 0,
    egressCount: 1,
    deletable: true,
    createAt: '2024-03-05T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-05T09:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'frontend-network-policy',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '前端应用入站与出站流量限制',
    podCount: 3,
    policyTypes: ['Ingress', 'Egress'],
    ingressCount: 1,
    egressCount: 1,
    deletable: true,
    createAt: '2024-03-10T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T14:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 NetworkPolicy 详情数据
 */
export const mockNetworkPolicyDetail: NetworkPolicyDetailVo = {
  id: mockNetworkPolicies[2].id,
  uid: mockNetworkPolicies[2].uid,
  name: mockNetworkPolicies[2].name,
  namespace: mockNetworkPolicies[2].namespace,
  clusterUid: mockNetworkPolicies[2].clusterUid,
  description: mockNetworkPolicies[2].description,
  deletable: mockNetworkPolicies[2].deletable,
  createAt: mockNetworkPolicies[2].createAt,
  createBy: mockNetworkPolicies[2].createBy,
  updateAt: mockNetworkPolicies[2].updateAt,
  updateBy: mockNetworkPolicies[2].updateBy,
  labels: { 'app.kubernetes.io/name': 'frontend-network-policy' },
  annotations: {},
  spec: {
    podSelector: { matchLabels: { app: 'frontend' } },
    ingress: [
      {
        ports: [{ protocol: 'TCP', port: 8080 }],
        from: [{ podSelector: { matchLabels: { app: 'nginx' } } }],
      },
    ],
    egress: [
      {
        ports: [{ protocol: 'TCP', port: 6379 }],
        to: [{ podSelector: { matchLabels: { app: 'redis' } } }],
      },
    ],
    policyTypes: ['Ingress', 'Egress'],
  },
}

/**
 * 模拟 NetworkPolicy YAML 数据
 */
export const mockNetworkPolicyYaml: NetworkPolicyYamlVo = {
  yaml: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-network-policy
  namespace: default
  uid: ${mockNetworkPolicyDetail.uid}
  creationTimestamp: "2024-03-10T14:00:00Z"
  labels:
    app.kubernetes.io/name: frontend-network-policy
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - ports:
        - protocol: TCP
          port: 8080
      from:
        - podSelector:
            matchLabels:
              app: nginx
  egress:
    - ports:
        - protocol: TCP
          port: 6379
      to:
        - podSelector:
            matchLabels:
              app: redis
`,
}

/**
 * 模拟 NetworkPolicy 事件列表数据
 */
export const mockNetworkPolicyEvents: EventListVo[] = [
  {
    name: 'event-networkpolicy-created',
    namespace: 'default',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:00:00Z',
    reportingController: 'NetworkPolicy',
    reportingInstance: 'networkpolicy-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicy',
      name: 'frontend-network-policy',
      namespace: 'default',
      uid: mockNetworkPolicyDetail.uid,
    },
    note: 'NetworkPolicy frontend-network-policy created',
    type: 'Normal',
  },
  {
    name: 'event-networkpolicy-updated',
    namespace: 'default',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T11:00:00Z',
    reportingController: 'NetworkPolicy',
    reportingInstance: 'networkpolicy-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicy',
      name: 'frontend-network-policy',
      namespace: 'default',
      uid: mockNetworkPolicyDetail.uid,
    },
    note: 'NetworkPolicy frontend-network-policy updated',
    type: 'Normal',
  },
]
