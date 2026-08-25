/**
 * Kubernetes ServiceAccount 模拟数据
 * @module mock/kubernetes/security/serviceAccountData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  ServiceAccountDetailVo,
  ServiceAccountListVo,
  ServiceAccountYamlVo,
} from '@/types/kubernetes/security/serviceaccount'

import { generateId } from '@/mock/utils'

/**
 * 模拟 ServiceAccount 列表数据
 */
export const mockServiceAccounts: ServiceAccountListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'default',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '默认 ServiceAccount',
    secretCount: 1,
    automountServiceAccountToken: true,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterUid: 'cluster-1',
    description: 'CoreDNS 服务账号',
    secretCount: 1,
    automountServiceAccountToken: false,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'sample-app',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    description: '示例应用服务账号',
    secretCount: 2,
    automountServiceAccountToken: true,
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 ServiceAccount 详情数据
 */
export const mockServiceAccountDetail: ServiceAccountDetailVo = {
  id: mockServiceAccounts[2].id,
  uid: mockServiceAccounts[2].uid,
  name: mockServiceAccounts[2].name,
  namespace: mockServiceAccounts[2].namespace,
  clusterUid: mockServiceAccounts[2].clusterUid,
  description: mockServiceAccounts[2].description,
  deletable: mockServiceAccounts[2].deletable,
  createAt: mockServiceAccounts[2].createAt,
  createBy: mockServiceAccounts[2].createBy,
  updateAt: mockServiceAccounts[2].updateAt,
  updateBy: mockServiceAccounts[2].updateBy,
  labels: { 'app.kubernetes.io/name': 'sample-app' },
  annotations: { 'kubectl.kubernetes.io/last-applied-configuration': '{}' },
  automountServiceAccountToken: true,
  secrets: [{ apiVersion: 'v1', kind: 'Secret', name: 'sample-app-token-abc12', namespace: 'app-backend' }],
  imagePullSecrets: [{ name: 'dockerhub-secret' }],
}

/**
 * 模拟 ServiceAccount YAML 数据
 */
export const mockServiceAccountYaml: ServiceAccountYamlVo = {
  yaml: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: sample-app
  namespace: app-backend
  uid: ${mockServiceAccountDetail.uid}
  creationTimestamp: "2024-03-15T10:00:00Z"
  labels:
    app.kubernetes.io/name: sample-app
automountServiceAccountToken: true
secrets:
  - name: sample-app-token-abc12
    namespace: app-backend
imagePullSecrets:
  - name: dockerhub-secret
`,
}

/**
 * 模拟 ServiceAccount 事件列表数据
 */
export const mockServiceAccountEvents: EventListVo[] = [
  {
    name: 'event-sa-created',
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
    reportingController: 'ServiceAccount',
    reportingInstance: 'serviceaccount-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      name: 'sample-app',
      namespace: 'app-backend',
      uid: mockServiceAccountDetail.uid,
    },
    note: 'ServiceAccount sample-app created',
    type: 'Normal',
  },
  {
    name: 'event-sa-token',
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
    reportingController: 'ServiceAccount',
    reportingInstance: 'serviceaccount-controller',
    action: 'TokenCreated',
    reason: 'TokenCreated',
    regarding: {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      name: 'sample-app',
      namespace: 'app-backend',
      uid: mockServiceAccountDetail.uid,
    },
    note: 'ServiceAccount token created',
    type: 'Normal',
  },
]
