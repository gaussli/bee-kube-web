/**
 * @fileOverview Role Mock 数据
 * @module mock/kubernetes/security/role
 */
import { getRolePage, getRoleDetail } from '@/api/kubernetes/security/role'
import { generateId } from '@/mock/utils'
import type { RoleResp, RoleQueryReq } from '@/types/kubernetes/role'

/**
 * Role Mock 数据
 */
const mockRoles: RoleResp[] = [
  {
    id: generateId(),
    name: 'system:controller:endpoint-controller',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      {
        apiGroups: [''],
        resources: ['endpoints'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch']
      }
    ],
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
    name: 'system:controller:namespace-controller',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      {
        apiGroups: [''],
        resources: ['namespaces'],
        verbs: ['get', 'list', 'watch', 'update', 'patch']
      },
      {
        apiGroups: [''],
        resources: ['namespaces/finalize'],
        verbs: ['update']
      }
    ],
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
    rules: [
      {
        apiGroups: ['apps'],
        resources: ['deployments', 'statefulsets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      },
      {
        apiGroups: [''],
        resources: ['services', 'configmaps', 'secrets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      }
    ],
    labels: { 'app.kubernetes.io/name': 'developer-role' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-10T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      {
        apiGroups: ['apps'],
        resources: ['deployments'],
        verbs: ['get', 'list', 'watch']
      },
      {
        apiGroups: [''],
        resources: ['services', 'configmaps'],
        verbs: ['get', 'list', 'watch']
      }
    ],
    labels: { 'app.kubernetes.io/name': 'readonly-role' },
    annotations: { description: 'Read-only access within namespace' },
    deletable: true,
    createAt: '2024-03-15T11:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T11:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      {
        apiGroups: ['apps'],
        resources: ['deployments'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      },
      {
        apiGroups: [''],
        resources: ['pods'],
        verbs: ['get', 'list', 'watch', 'delete']
      }
    ],
    labels: { 'app.kubernetes.io/component': 'deployment' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-20T15:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T15:30:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/roles',
    handler: (pathParams: Record<string, string>, params: RoleQueryReq) => getRolePage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name',
    handler: (pathParams: Record<string, string>) => getRoleDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
