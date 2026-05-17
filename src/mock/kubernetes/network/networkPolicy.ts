/**
 * @fileOverview NetworkPolicy Mock 数据
 * @module mock/kubernetes/network/networkPolicy
 */
import type { NetworkPolicyResp, NetworkPolicyQueryReq } from '@/types/kubernetes/networkPolicy'
import { getNetworkPolicyPage, getNetworkPolicyDetail } from '@/api/kubernetes/network/networkPolicy'
import { generateId } from '@/mock/utils'

/**
 * NetworkPolicy Mock 数据
 */
const mockNetworkPolicys: NetworkPolicyResp[] = [
  {
    id: generateId(),
    name: 'default-deny-all',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: {},
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'networking.gke.io/managed-policy': 'true' },
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'allow-dns',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: {},
    ingress: [],
    egress: [
      {
        ports: [
          { protocol: 'UDP', port: 53 },
          { protocol: 'TCP', port: 53 }
        ],
        to: [{ kind: 'NamespaceSelector', namespaceSelector: { 'kubernetes.io/metadata.name': 'kube-system' } }]
      }
    ],
    policyTypes: ['Egress'],
    labels: { 'app.kubernetes.io/name': 'allow-dns' },
    deletable: true,
    createAt: '2024-03-05T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-05T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: { app: 'frontend' },
    ingress: [
      {
        ports: [{ protocol: 'TCP', port: 8080 }],
        from: [{ kind: 'PodSelector', podSelector: { app: 'nginx' } }]
      }
    ],
    egress: [
      {
        ports: [{ protocol: 'TCP', port: 6379 }],
        to: [{ kind: 'PodSelector', podSelector: { app: 'redis' } }]
      }
    ],
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'app.kubernetes.io/name': 'frontend-network-policy' },
    deletable: true,
    createAt: '2024-03-10T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T14:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: { app: 'backend' },
    ingress: [
      {
        ports: [{ protocol: 'TCP', port: 8080 }],
        from: [
          { kind: 'PodSelector', podSelector: { app: 'frontend' } },
          { kind: 'PodSelector', podSelector: { app: 'api-gateway' } }
        ]
      }
    ],
    egress: [
      {
        ports: [{ protocol: 'TCP', port: 3306 }],
        to: [{ kind: 'PodSelector', podSelector: { app: 'mysql' } }]
      }
    ],
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'app.kubernetes.io/name': 'backend-network-policy' },
    deletable: true,
    createAt: '2024-03-15T11:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T11:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: { app: 'api' },
    ingress: [
      {
        ports: [{ protocol: 'TCP', port: 8080 }],
        from: [{ kind: 'IPBlock', ipBlock: { cidr: '10.0.0.0/8', except: ['10.0.0.0/16'] } }]
      }
    ],
    policyTypes: ['Ingress'],
    labels: { 'app.kubernetes.io/name': 'api-network-policy' },
    deletable: true,
    createAt: '2024-03-20T16:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T16:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: { app: 'prometheus' },
    ingress: [
      {
        ports: [{ protocol: 'TCP', port: 9090 }],
        from: [{ kind: 'NamespaceSelector', namespaceSelector: { 'kubernetes.io/metadata.name': 'monitoring' } }]
      }
    ],
    egress: [
      {
        ports: [{ protocol: 'TCP', port: 9090 }],
        to: [{ kind: 'NamespaceSelector', namespaceSelector: {} }]
      }
    ],
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'app.kubernetes.io/component': 'monitoring' },
    deletable: true,
    createAt: '2024-03-25T09:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-25T09:30:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/networkpolicies',
    handler: (_pathParams: Record<string, string>, _params: NetworkPolicyQueryReq) => getNetworkPolicyPage(_pathParams.clusterId, _params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name',
    handler: (_pathParams: Record<string, string>) => getNetworkPolicyDetail(_pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
