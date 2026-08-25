/**
 * Kubernetes Role 模拟数据
 * @module mock/kubernetes/security/roleData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { RoleDetailVo, RoleListVo, RoleYamlVo } from '@/types/kubernetes/security/role'

import { generateId } from '@/mock/utils'

/**
 * 模拟 Role 列表数据
 */
export const mockRoles: RoleListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'developer-role',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    description: '开发者命名空间角色',
    ruleCount: 3,
    deletable: true,
    createAt: '2024-02-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'readonly-role',
    namespace: 'app-frontend',
    clusterUid: 'cluster-1',
    description: '只读命名空间角色',
    ruleCount: 2,
    deletable: true,
    createAt: '2024-02-20T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'admin-role',
    namespace: 'monitoring',
    clusterUid: 'cluster-1',
    description: '监控命名空间管理员角色',
    ruleCount: 4,
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 Role 详情数据
 */
export const mockRoleDetail: RoleDetailVo = {
  id: mockRoles[0].id,
  uid: mockRoles[0].uid,
  name: mockRoles[0].name,
  namespace: mockRoles[0].namespace,
  clusterUid: mockRoles[0].clusterUid,
  description: mockRoles[0].description,
  deletable: mockRoles[0].deletable,
  createAt: mockRoles[0].createAt,
  createBy: mockRoles[0].createBy,
  updateAt: mockRoles[0].updateAt,
  updateBy: mockRoles[0].updateBy,
  labels: { 'rbac.authorization.k8s.io/owner': 'dev-team' },
  annotations: {},
  rules: [
    { apiGroups: ['apps'], resources: ['deployments'], verbs: ['get', 'list', 'watch'] },
    { apiGroups: ['apps'], resources: ['deployments/scale'], verbs: ['update'] },
  ],
}

/**
 * 模拟 Role YAML 数据
 */
export const mockRoleYaml: RoleYamlVo = {
  yaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer-role
  namespace: app-backend
  uid: ${mockRoleDetail.uid}
  creationTimestamp: "2024-02-15T10:00:00Z"
  labels:
    rbac.authorization.k8s.io/owner: dev-team
rules:
  - apiGroups:
      - apps
    resources:
      - deployments
    verbs:
      - get
      - list
      - watch
`,
}

/**
 * 模拟 Role 事件列表数据
 */
export const mockRoleEvents: EventListVo[] = [
  {
    name: 'event-role-created',
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
    reportingController: 'Role',
    reportingInstance: 'rbac-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      name: 'developer-role',
      namespace: 'app-backend',
      uid: mockRoleDetail.uid,
    },
    note: 'Role developer-role created',
    type: 'Normal',
  },
  {
    name: 'event-role-updated',
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
    reportingController: 'Role',
    reportingInstance: 'rbac-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      name: 'developer-role',
      namespace: 'app-backend',
      uid: mockRoleDetail.uid,
    },
    note: 'Role developer-role updated',
    type: 'Normal',
  },
]
