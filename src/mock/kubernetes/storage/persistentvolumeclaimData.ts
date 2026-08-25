/**
 * Kubernetes PersistentVolumeClaim 模拟数据
 * @module mock/kubernetes/storage/persistentvolumeclaimData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  PersistentVolumeClaimDetailVo,
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimYamlVo,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import { generateId } from '@/mock/utils'

/**
 * 模拟 PersistentVolumeClaim 列表数据
 */
export const mockPersistentVolumeClaims: PersistentVolumeClaimListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-data-pvc',
    namespace: 'data',
    clusterUid: 'cluster-1',
    description: 'MySQL 主库数据持久化声明',
    status: 'Bound',
    statusMsg: 'Bound to pv-mysql-data-001',
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    volumeName: 'pv-mysql-data-001',
    requestStorage: '100Gi',
    capacityStorage: '100Gi',
    deletable: true,
    createAt: '2024-01-20T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mongodb-data-pvc',
    namespace: 'data',
    clusterUid: 'cluster-1',
    description: 'MongoDB 数据持久化声明',
    status: 'Bound',
    statusMsg: 'Bound to pv-mongodb-data-001',
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    volumeName: 'pv-mongodb-data-001',
    requestStorage: '50Gi',
    capacityStorage: '50Gi',
    deletable: true,
    createAt: '2024-02-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'elasticsearch-data-pvc',
    namespace: 'logging',
    clusterUid: 'cluster-1',
    description: 'Elasticsearch 数据持久化声明',
    status: 'Pending',
    statusMsg: 'Waiting for first consumer',
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    requestStorage: '300Gi',
    capacityStorage: '0',
    deletable: true,
    createAt: '2024-03-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-logs-pvc',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    description: '后端应用日志持久化声明',
    status: 'Bound',
    statusMsg: 'Bound to pv-app-logs-001',
    accessModes: ['ReadWriteMany'],
    storageClassName: 'standard-storage',
    volumeMode: 'Filesystem',
    volumeName: 'pv-app-logs-001',
    requestStorage: '20Gi',
    capacityStorage: '20Gi',
    deletable: true,
    createAt: '2024-02-15T14:00:00Z',
    createBy: 'developer',
    updateAt: '2024-03-12T16:00:00Z',
    updateBy: 'developer',
  },
]

/**
 * 模拟 PersistentVolumeClaim 详情数据
 */
export const mockPersistentVolumeClaimDetail: PersistentVolumeClaimDetailVo = {
  id: mockPersistentVolumeClaims[0].id,
  uid: mockPersistentVolumeClaims[0].uid,
  name: mockPersistentVolumeClaims[0].name,
  namespace: mockPersistentVolumeClaims[0].namespace,
  clusterUid: mockPersistentVolumeClaims[0].clusterUid,
  description: mockPersistentVolumeClaims[0].description,
  status: mockPersistentVolumeClaims[0].status,
  statusMsg: mockPersistentVolumeClaims[0].statusMsg,
  deletable: mockPersistentVolumeClaims[0].deletable,
  createAt: mockPersistentVolumeClaims[0].createAt,
  createBy: mockPersistentVolumeClaims[0].createBy,
  updateAt: mockPersistentVolumeClaims[0].updateAt,
  updateBy: mockPersistentVolumeClaims[0].updateBy,
  labels: { app: 'mysql', type: 'database' },
  annotations: { 'volume.beta.kubernetes.io/storage-provisioner': 'pd.csi.storage.gke.io' },
  spec: {
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    volumeName: 'pv-mysql-data-001',
    resources: { requests: { storage: '100Gi' } },
  },
  statusObj: {
    phase: 'Bound',
    accessModes: ['ReadWriteOnce'],
    capacity: { storage: '100Gi' },
    allocatedResources: { storage: '100Gi' },
  },
}

/**
 * 模拟 PersistentVolumeClaim YAML 数据
 */
export const mockPersistentVolumeClaimYaml: PersistentVolumeClaimYamlVo = {
  yaml: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-data-pvc
  namespace: data
  uid: ${mockPersistentVolumeClaimDetail.uid}
  creationTimestamp: "2024-01-20T10:00:00Z"
  labels:
    app: mysql
    type: database
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  storageClassName: ssd-storage
  volumeName: pv-mysql-data-001
  resources:
    requests:
      storage: 100Gi
status:
  phase: Bound
  capacity:
    storage: 100Gi
`,
}

/**
 * 模拟 PersistentVolumeClaim 事件列表数据
 */
export const mockPersistentVolumeClaimEvents: EventListVo[] = [
  {
    name: 'event-pvc-created',
    namespace: 'data',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:00:00Z',
    reportingController: 'PersistentVolumeClaim',
    reportingInstance: 'pvc-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      name: 'mysql-data-pvc',
      namespace: 'data',
      uid: mockPersistentVolumeClaimDetail.uid,
    },
    note: 'PersistentVolumeClaim mysql-data-pvc created',
    type: 'Normal',
  },
  {
    name: 'event-pvc-provisioned',
    namespace: 'data',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T11:00:00Z',
    reportingController: 'PersistentVolumeClaim',
    reportingInstance: 'pvc-controller',
    action: 'Provisioning',
    reason: 'ProvisioningSucceeded',
    regarding: {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      name: 'mysql-data-pvc',
      namespace: 'data',
      uid: mockPersistentVolumeClaimDetail.uid,
    },
    note: 'Volume provisioned successfully',
    type: 'Normal',
  },
]
