/**
 * Kubernetes ClusterRoleBinding 模拟数据
 * @module mock/kubernetes/security/clusterrolebindingData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  ClusterRoleBindingDetailVo,
  ClusterRoleBindingListVo,
  ClusterRoleBindingYamlVo,
} from '@/types/kubernetes/security/clusterrolebinding'

import { generateId } from '@/mock/utils'

/**
 * 模拟 ClusterRoleBinding 列表数据
 */
export const mockClusterRoleBindings: ClusterRoleBindingListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'cluster-admin',
    clusterUid: 'cluster-1',
    description: '集群管理员绑定',
    roleName: 'cluster-admin',
    roleKind: 'ClusterRole',
    subjectCount: 1,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'system:node-bootstrap',
    clusterUid: 'cluster-1',
    description: '节点引导绑定',
    roleName: 'system:node-bootstrapper',
    roleKind: 'ClusterRole',
    subjectCount: 1,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'developer-binding',
    clusterUid: 'cluster-1',
    description: '开发者权限绑定',
    roleName: 'developer',
    roleKind: 'ClusterRole',
    subjectCount: 2,
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 ClusterRoleBinding 详情数据
 */
export const mockClusterRoleBindingDetail: ClusterRoleBindingDetailVo = {
  id: mockClusterRoleBindings[2].id,
  uid: mockClusterRoleBindings[2].uid,
  name: mockClusterRoleBindings[2].name,
  clusterUid: mockClusterRoleBindings[2].clusterUid,
  description: mockClusterRoleBindings[2].description,
  deletable: mockClusterRoleBindings[2].deletable,
  createAt: mockClusterRoleBindings[2].createAt,
  createBy: mockClusterRoleBindings[2].createBy,
  updateAt: mockClusterRoleBindings[2].updateAt,
  updateBy: mockClusterRoleBindings[2].updateBy,
  labels: { 'rbac.authorization.k8s.io/managed-by': 'bee-kube' },
  annotations: {},
  roleRef: { apiGroup: 'rbac.authorization.k8s.io', kind: 'ClusterRole', name: 'developer' },
  subjects: [
    { kind: 'User', apiGroup: 'rbac.authorization.k8s.io', name: 'alice', namespace: 'default' },
    { kind: 'ServiceAccount', name: 'dev-sa', namespace: 'default' },
  ],
}

/**
 * 模拟 ClusterRoleBinding YAML 数据
 */
export const mockClusterRoleBindingYaml: ClusterRoleBindingYamlVo = {
  yaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: developer-binding
  uid: ${mockClusterRoleBindingDetail.uid}
  creationTimestamp: "2024-03-15T10:00:00Z"
  labels:
    rbac.authorization.k8s.io/managed-by: bee-kube
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: developer
subjects:
  - kind: User
    apiGroup: rbac.authorization.k8s.io
    name: alice
    namespace: default
  - kind: ServiceAccount
    name: dev-sa
    namespace: default
`,
}

/**
 * 模拟 ClusterRoleBinding 事件列表数据
 */
export const mockClusterRoleBindingEvents: EventListVo[] = [
  {
    name: 'event-crb-created',
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
    reportingController: 'ClusterRoleBinding',
    reportingInstance: 'rbac-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRoleBinding',
      name: 'developer-binding',
      namespace: 'default',
      uid: mockClusterRoleBindingDetail.uid,
    },
    note: 'ClusterRoleBinding developer-binding created',
    type: 'Normal',
  },
  {
    name: 'event-crb-updated',
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
    reportingController: 'ClusterRoleBinding',
    reportingInstance: 'rbac-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRoleBinding',
      name: 'developer-binding',
      namespace: 'default',
      uid: mockClusterRoleBindingDetail.uid,
    },
    note: 'ClusterRoleBinding developer-binding updated',
    type: 'Normal',
  },
]
