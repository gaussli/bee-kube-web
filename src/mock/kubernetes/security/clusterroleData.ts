/**
 * Kubernetes ClusterRole 模拟数据
 * @module mock/kubernetes/security/clusterroleData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { ClusterRoleDetailVo, ClusterRoleListVo, ClusterRoleYamlVo } from '@/types/kubernetes/security/clusterrole'

import { generateId } from '@/mock/utils'

/**
 * 模拟 ClusterRole 列表数据
 */
export const mockClusterRoles: ClusterRoleListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'admin',
    clusterUid: 'cluster-1',
    description: '集群管理员角色',
    ruleCount: 4,
    deletable: true,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'view',
    clusterUid: 'cluster-1',
    description: '只读查看角色',
    ruleCount: 3,
    deletable: true,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cluster-admin',
    clusterUid: 'cluster-1',
    description: '集群超级管理员角色',
    ruleCount: 1,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'developer',
    clusterUid: 'cluster-1',
    description: '开发者自定义角色',
    ruleCount: 2,
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 ClusterRole 详情数据
 */
export const mockClusterRoleDetail: ClusterRoleDetailVo = {
  id: mockClusterRoles[0].id,
  uid: mockClusterRoles[0].uid,
  name: mockClusterRoles[0].name,
  clusterUid: mockClusterRoles[0].clusterUid,
  description: mockClusterRoles[0].description,
  deletable: mockClusterRoles[0].deletable,
  createAt: mockClusterRoles[0].createAt,
  createBy: mockClusterRoles[0].createBy,
  updateAt: mockClusterRoles[0].updateAt,
  updateBy: mockClusterRoles[0].updateBy,
  labels: { 'rbac.authorization.k8s.io/aggregate-to-admin': 'true' },
  annotations: { 'kubectl.kubernetes.io/last-applied-configuration': '{}' },
  rules: [
    { apiGroups: ['*'], resources: ['*'], verbs: ['get', 'list', 'watch'] },
    { apiGroups: ['apps'], resources: ['deployments'], verbs: ['*'] },
  ],
}

/**
 * 模拟 ClusterRole YAML 数据
 */
export const mockClusterRoleYaml: ClusterRoleYamlVo = {
  yaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: admin
  uid: ${mockClusterRoleDetail.uid}
  creationTimestamp: "2024-01-01T00:00:00Z"
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
rules:
  - apiGroups:
      - "*"
    resources:
      - "*"
    verbs:
      - get
      - list
      - watch
`,
}

/**
 * 模拟 ClusterRole 事件列表数据
 */
export const mockClusterRoleEvents: EventListVo[] = [
  {
    name: 'event-clusterrole-created',
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
    reportingController: 'ClusterRole',
    reportingInstance: 'rbac-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      name: 'admin',
      namespace: 'default',
      uid: mockClusterRoleDetail.uid,
    },
    note: 'ClusterRole admin created',
    type: 'Normal',
  },
  {
    name: 'event-clusterrole-updated',
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
    reportingController: 'ClusterRole',
    reportingInstance: 'rbac-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      name: 'admin',
      namespace: 'default',
      uid: mockClusterRoleDetail.uid,
    },
    note: 'ClusterRole admin updated',
    type: 'Normal',
  },
]
