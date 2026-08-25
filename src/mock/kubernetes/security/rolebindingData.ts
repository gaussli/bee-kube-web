/**
 * Kubernetes RoleBinding 模拟数据
 * @module mock/kubernetes/security/rolebindingData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { RoleBindingDetailVo, RoleBindingListVo, RoleBindingYamlVo } from '@/types/kubernetes/security/rolebinding'

import { generateId } from '@/mock/utils'

/**
 * 模拟 RoleBinding 列表数据
 */
export const mockRoleBindings: RoleBindingListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'admin-binding',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    description: '后端命名空间管理员绑定',
    roleName: 'admin-role',
    roleKind: 'Role',
    subjectCount: 1,
    deletable: true,
    createAt: '2024-02-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'edit-binding',
    namespace: 'app-frontend',
    clusterUid: 'cluster-1',
    description: '前端命名空间编辑者绑定',
    roleName: 'edit',
    roleKind: 'ClusterRole',
    subjectCount: 2,
    deletable: true,
    createAt: '2024-02-20T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'developer-binding',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    description: '开发者权限绑定',
    roleName: 'developer-role',
    roleKind: 'Role',
    subjectCount: 3,
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 RoleBinding 详情数据
 */
export const mockRoleBindingDetail: RoleBindingDetailVo = {
  id: mockRoleBindings[2].id,
  uid: mockRoleBindings[2].uid,
  name: mockRoleBindings[2].name,
  namespace: mockRoleBindings[2].namespace,
  clusterUid: mockRoleBindings[2].clusterUid,
  description: mockRoleBindings[2].description,
  deletable: mockRoleBindings[2].deletable,
  createAt: mockRoleBindings[2].createAt,
  createBy: mockRoleBindings[2].createBy,
  updateAt: mockRoleBindings[2].updateAt,
  updateBy: mockRoleBindings[2].updateBy,
  labels: { 'rbac.authorization.k8s.io/owner': 'dev-team' },
  annotations: {},
  roleRef: { apiGroup: 'rbac.authorization.k8s.io', kind: 'Role', name: 'developer-role' },
  subjects: [
    { kind: 'User', apiGroup: 'rbac.authorization.k8s.io', name: 'alice', namespace: 'app-backend' },
    { kind: 'ServiceAccount', name: 'dev-sa', namespace: 'app-backend' },
    { kind: 'Group', apiGroup: 'rbac.authorization.k8s.io', name: 'dev-group' },
  ],
}

/**
 * 模拟 RoleBinding YAML 数据
 */
export const mockRoleBindingYaml: RoleBindingYamlVo = {
  yaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: app-backend
  uid: ${mockRoleBindingDetail.uid}
  creationTimestamp: "2024-03-01T10:00:00Z"
  labels:
    rbac.authorization.k8s.io/owner: dev-team
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: developer-role
subjects:
  - kind: User
    apiGroup: rbac.authorization.k8s.io
    name: alice
    namespace: app-backend
  - kind: ServiceAccount
    name: dev-sa
    namespace: app-backend
`,
}

/**
 * 模拟 RoleBinding 事件列表数据
 */
export const mockRoleBindingEvents: EventListVo[] = [
  {
    name: 'event-rb-created',
    namespace: 'app-backend',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:00:00Z',
    reportingController: 'RoleBinding',
    reportingInstance: 'rbac-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBinding',
      name: 'developer-binding',
      namespace: 'app-backend',
      uid: mockRoleBindingDetail.uid,
    },
    note: 'RoleBinding developer-binding created',
    type: 'Normal',
  },
  {
    name: 'event-rb-updated',
    namespace: 'app-backend',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T11:00:00Z',
    reportingController: 'RoleBinding',
    reportingInstance: 'rbac-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBinding',
      name: 'developer-binding',
      namespace: 'app-backend',
      uid: mockRoleBindingDetail.uid,
    },
    note: 'RoleBinding developer-binding updated',
    type: 'Normal',
  },
]
