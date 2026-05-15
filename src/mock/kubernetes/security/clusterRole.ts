/**
 * @fileOverview ClusterRole Mock 数据
 * @module mock/kubernetes/security/clusterRole
 */
import { getClusterRolePage, getClusterRoleDetail } from '@/api/kubernetes/security/clusterRole'
import { generateId } from '@/mock/utils'
import type { ClusterRoleResp, ClusterRoleQueryReq, ClusterRolePolicyRule } from '@/types/kubernetes/clusterRole'

/**
 * ClusterRolePolicyRule 生成函数
 */
function createAdminRule(): ClusterRolePolicyRule {
  return {
    apiGroups: ['*'],
    resources: ['*'],
    verbs: ['*']
  }
}

function createReadOnlyRule(): ClusterRolePolicyRule {
  return {
    apiGroups: [''],
    resources: ['pods', 'services', 'configmaps', 'secrets'],
    verbs: ['get', 'list', 'watch']
  }
}

function createPodExecRule(): ClusterRolePolicyRule {
  return {
    apiGroups: [''],
    resources: ['pods/exec', 'pods/log'],
    verbs: ['get', 'list']
  }
}

/**
 * ClusterRole Mock 数据
 */
const mockClusterRole: ClusterRoleResp[] = [
  {
    id: generateId(),
    name: 'admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [createAdminRule()],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Provides full access to most resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'view',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [createReadOnlyRule(), createPodExecRule()],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Allows read-only access to most resources'
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
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      {
        apiGroups: [''],
        resources: ['configmaps', 'secrets', 'pods', 'pods/log', 'pods/exec', 'services'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      },
      {
        apiGroups: ['apps'],
        resources: ['deployments', 'statefulsets', 'daemonsets', 'replicasets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      }
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Allows read and write access to most resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      {
        apiGroups: ['*'],
        resources: ['*'],
        verbs: ['*']
      },
      {
        nonResourceURLs: ['*'],
        verbs: ['*']
      }
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Super-user access to all resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: generateName('developer'),
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      {
        apiGroups: [''],
        resources: ['pods', 'services', 'configmaps', 'secrets', 'endpoints'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      },
      {
        apiGroups: ['apps'],
        resources: ['deployments', 'statefulsets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      }
    ],
    labels: { 'app.kubernetes.io/name': 'developer-role' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateName('readonly'),
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [createReadOnlyRule()],
    labels: { 'app.kubernetes.io/name': 'readonly-role' },
    annotations: { description: 'Read-only access for auditors' },
    deletable: true,
    createAt: '2024-03-20T14:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:30:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/clusterroles',
    handler: (pathParams: Record<string, string>, params: ClusterRoleQueryReq) => getClusterRolePage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name',
    handler: (pathParams: Record<string, string>) => getClusterRoleDetail(pathParams.clusterId, pathParams.name)
  }
]
