/**
 * @fileOverview RoleBinding Mock 数据
 * @module mock/kubernetes/security/roleBinding
 */
import { getRoleBindingPage, getRoleBindingDetail } from '@/api/kubernetes/security/roleBinding'
import { generateId } from '@/mock/utils'
import type { RoleBindingResp, RoleBindingQueryReq } from '@/types/kubernetes/roleBinding'

/**
 * RoleBinding Mock 数据
 */
const mockRoleBindings: RoleBindingResp[] = [
  {
    id: generateId(),
    name: 'admin',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: {
      kind: 'ClusterRole',
      name: 'admin'
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
    name: 'edit',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: {
      kind: 'ClusterRole',
      name: 'edit'
    },
    subjects: [
      {
        kind: 'Group',
        name: 'system:authenticated',
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
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'Role',
      name: 'namespace-developer'
    },
    subjects: [
      {
        kind: 'User',
        name: 'developer@example.com',
        apiGroup: 'rbac.authorization.k8s.io'
      },
      {
        kind: 'ServiceAccount',
        name: 'app-service',
        namespace: 'default',
        apiGroup: ''
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
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'ClusterRole',
      name: 'view'
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
    annotations: { description: 'Read-only access for auditors' },
    deletable: true,
    createAt: '2024-03-15T14:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'Role',
      name: 'namespace-deployer'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'cicd-deployer',
        namespace: 'ci-cd',
        apiGroup: ''
      }
    ],
    creationTimestamp: '2024-03-20T09:00:00Z',
    labels: { 'app.kubernetes.io/component': 'deployment' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-20T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: {
      kind: 'ClusterRole',
      name: 'prometheus'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'prometheus',
        namespace: 'monitoring',
        apiGroup: ''
      }
    ],
    creationTimestamp: '2024-03-25T11:00:00Z',
    labels: { 'app.kubernetes.io/name': 'monitoring-binding' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-25T11:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-25T11:00:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/rolebindings',
    handler: (pathParams: Record<string, string>, params: RoleBindingQueryReq) => getRoleBindingPage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name',
    handler: (pathParams: Record<string, string>) => getRoleBindingDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
