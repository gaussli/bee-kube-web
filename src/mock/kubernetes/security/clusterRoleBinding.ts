/**
 * @fileOverview ClusterRoleBinding Mock 数据
 * @module mock/kubernetes/security/clusterRoleBinding
 */
import { getClusterRoleBindingPage, getClusterRoleBindingDetail } from '@/api/kubernetes/security/clusterRoleBinding'
import { generateId } from '@/mock/utils'
import type { ClusterRoleBindingResp, ClusterRoleBindingQueryReq } from '@/types/kubernetes/clusterRoleBinding'

/**
 * ClusterRoleBinding Mock 数据
 */
const mockClusterRoleBindings: ClusterRoleBindingResp[] = [
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-admin'
    },
    subjects: [
      {
        kind: 'User',
        name: 'admin',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ],
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'system:node-bootstrap',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: {
      kind: 'ClusterRole',
      name: 'system:node-bootstrap'
    },
    subjects: [
      {
        kind: 'Group',
        name: 'system:bootstrappers:kubeadm:default-node-token',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ],
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: generateId(),
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-developer'
    },
    subjects: [
      {
        kind: 'User',
        name: 'developer@example.com',
        apiGroup: 'rbac.authorization.k8s.io'
      },
      {
        kind: 'Group',
        name: 'engineering',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ],
    creationTimestamp: '2024-03-10T10:00:00Z',
    labels: { 'app.kubernetes.io/name': 'developer-binding' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-readonly'
    },
    subjects: [
      {
        kind: 'Group',
        name: 'auditors',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ],
    creationTimestamp: '2024-03-15T14:30:00Z',
    labels: { 'app.kubernetes.io/name': 'readonly-binding' },
    annotations: { description: 'Read-only access for audit team' },
    deletable: true,
    createAt: '2024-03-15T14:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-admin'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'default',
        namespace: 'monitoring',
        apiGroup: ''
      },
      {
        kind: 'ServiceAccount',
        name: 'prometheus',
        namespace: 'monitoring',
        apiGroup: ''
      }
    ],
    creationTimestamp: '2024-03-20T09:00:00Z',
    labels: { 'app.kubernetes.io/component': 'monitoring' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-20T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T09:00:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings',
    handler: (pathParams: Record<string, string>, params: ClusterRoleBindingQueryReq) => getClusterRoleBindingPage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name',
    handler: (pathParams: Record<string, string>) => getClusterRoleBindingDetail(pathParams.clusterId, pathParams.name)
  }
]
