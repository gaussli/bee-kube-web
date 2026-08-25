/**
 * Kubernetes PersistentVolume 模拟数据
 * @module mock/kubernetes/storage/persistentvolumeData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  PersistentVolumeDetailVo,
  PersistentVolumeListVo,
  PersistentVolumeYamlVo,
} from '@/types/kubernetes/storage/persistentvolume'

import { generateId } from '@/mock/utils'

/**
 * 模拟 PersistentVolume 列表数据
 */
export const mockPersistentVolumes: PersistentVolumeListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'pv-mysql-data-001',
    clusterUid: 'cluster-1',
    description: 'MySQL 主库数据卷',
    status: 'Bound',
    statusMsg: 'Bound to mysql-data-pvc',
    accessModes: ['ReadWriteOnce'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    claimName: 'mysql-data-pvc',
    claimNamespace: 'data',
    deletable: true,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'pv-mongodb-data-001',
    clusterUid: 'cluster-1',
    description: 'MongoDB 数据卷',
    status: 'Bound',
    statusMsg: 'Bound to mongodb-data-pvc',
    accessModes: ['ReadWriteOnce'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    claimName: 'mongodb-data-pvc',
    claimNamespace: 'data',
    deletable: true,
    createAt: '2024-01-20T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'pv-nfs-shared-001',
    clusterUid: 'cluster-1',
    description: 'NFS 共享存储卷',
    status: 'Available',
    statusMsg: 'Ready',
    accessModes: ['ReadWriteMany'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: 'nfs-storage',
    volumeMode: 'Filesystem',
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'pv-local-001',
    clusterUid: 'cluster-1',
    description: '节点本地存储卷',
    status: 'Released',
    statusMsg: 'Released from pv-local-001',
    accessModes: ['ReadWriteOnce'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: 'local-storage',
    volumeMode: 'Filesystem',
    deletable: true,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 PersistentVolume 详情数据
 */
export const mockPersistentVolumeDetail: PersistentVolumeDetailVo = {
  id: mockPersistentVolumes[0].id,
  uid: mockPersistentVolumes[0].uid,
  name: mockPersistentVolumes[0].name,
  clusterUid: mockPersistentVolumes[0].clusterUid,
  description: mockPersistentVolumes[0].description,
  status: mockPersistentVolumes[0].status,
  statusMsg: mockPersistentVolumes[0].statusMsg,
  deletable: mockPersistentVolumes[0].deletable,
  createAt: mockPersistentVolumes[0].createAt,
  createBy: mockPersistentVolumes[0].createBy,
  updateAt: mockPersistentVolumes[0].updateAt,
  updateBy: mockPersistentVolumes[0].updateBy,
  labels: { 'type': 'database', 'app.kubernetes.io/name': 'mysql' },
  annotations: { 'kubernetes.io/createdby': 'gce-pd-dynamic-provisioner' },
  spec: {
    capacity: { storage: '100Gi' },
    accessModes: ['ReadWriteOnce'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: 'ssd-storage',
    volumeMode: 'Filesystem',
    csi: {
      driver: 'pd.csi.storage.gke.io',
      volumeHandle: 'projects/proj/zones/us-central1-a/disks/pd-1',
    },
  },
  statusObj: {
    phase: 'Bound',
    reason: '',
    message: 'Bound to mysql-data-pvc',
    lastPhaseTransitionTime: '2024-03-15T14:00:00Z',
  },
}

/**
 * 模拟 PersistentVolume YAML 数据
 */
export const mockPersistentVolumeYaml: PersistentVolumeYamlVo = {
  yaml: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-mysql-data-001
  uid: ${mockPersistentVolumeDetail.uid}
  creationTimestamp: "2024-01-15T10:00:00Z"
  labels:
    type: database
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ssd-storage
  volumeMode: Filesystem
  csi:
    driver: pd.csi.storage.gke.io
    volumeHandle: projects/proj/zones/us-central1-a/disks/pd-1
status:
  phase: Bound
  message: Bound to mysql-data-pvc
`,
}

/**
 * 模拟 PersistentVolume 事件列表数据
 */
export const mockPersistentVolumeEvents: EventListVo[] = [
  {
    name: 'event-pv-created',
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
    reportingController: 'PersistentVolume',
    reportingInstance: 'pv-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'v1',
      kind: 'PersistentVolume',
      name: 'pv-mysql-data-001',
      namespace: 'default',
      uid: mockPersistentVolumeDetail.uid,
    },
    note: 'PersistentVolume pv-mysql-data-001 created',
    type: 'Normal',
  },
  {
    name: 'event-pv-provisioned',
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
    reportingController: 'PersistentVolume',
    reportingInstance: 'pv-controller',
    action: 'Provisioning',
    reason: 'ProvisioningSucceeded',
    regarding: {
      apiVersion: 'v1',
      kind: 'PersistentVolume',
      name: 'pv-mysql-data-001',
      namespace: 'default',
      uid: mockPersistentVolumeDetail.uid,
    },
    note: 'Volume provisioned successfully',
    type: 'Normal',
  },
]
