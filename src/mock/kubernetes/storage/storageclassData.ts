/**
 * Kubernetes StorageClass 模拟数据
 * @module mock/kubernetes/storage/storageclassData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type {
  StorageClassDetailVo,
  StorageClassListVo,
  StorageClassYamlVo,
} from '@/types/kubernetes/storage/storageclass'

import { generateId } from '@/mock/utils'

/**
 * 模拟 StorageClass 列表数据
 */
export const mockStorageClasses: StorageClassListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'ssd-storage',
    clusterUid: 'cluster-1',
    description: 'SSD 高性能存储类',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    deletable: true,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'standard-storage',
    clusterUid: 'cluster-1',
    description: '标准磁盘存储类',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    deletable: true,
    createAt: '2024-01-15T10:05:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nfs-storage',
    clusterUid: 'cluster-1',
    description: 'NFS 共享存储类',
    provisioner: 'nfs.io/provisioner',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    deletable: true,
    createAt: '2024-02-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-12T16:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'local-storage',
    clusterUid: 'cluster-1',
    description: '节点本地存储类',
    provisioner: 'kubernetes.io/no-provisioner',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    deletable: true,
    createAt: '2024-02-15T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'ceph-rbd',
    clusterUid: 'cluster-1',
    description: 'Ceph RBD 块存储类',
    provisioner: 'ceph.com/rbd',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'WaitForFirstConsumer',
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 StorageClass 详情数据
 */
export const mockStorageClassDetail: StorageClassDetailVo = {
  id: mockStorageClasses[0].id,
  uid: mockStorageClasses[0].uid,
  name: mockStorageClasses[0].name,
  clusterUid: mockStorageClasses[0].clusterUid,
  description: mockStorageClasses[0].description,
  deletable: mockStorageClasses[0].deletable,
  createAt: mockStorageClasses[0].createAt,
  createBy: mockStorageClasses[0].createBy,
  updateAt: mockStorageClasses[0].updateAt,
  updateBy: mockStorageClasses[0].updateBy,
  labels: { 'type': 'ssd', 'app.kubernetes.io/managed-by': 'bee-kube' },
  annotations: { 'storageclass.kubernetes.io/is-default-class': 'true' },
  provisioner: 'kubernetes.io/gce-pd',
  parameters: { type: 'pd-ssd' },
  reclaimPolicy: 'Delete',
  mountOptions: ['discard'],
  allowVolumeExpansion: true,
  volumeBindingMode: 'WaitForFirstConsumer',
}

/**
 * 模拟 StorageClass YAML 数据
 */
export const mockStorageClassYaml: StorageClassYamlVo = {
  yaml: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ssd-storage
  uid: ${mockStorageClassDetail.uid}
  creationTimestamp: "2024-01-15T10:00:00Z"
  labels:
    type: ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
`,
}

/**
 * 模拟 StorageClass 事件列表数据
 */
export const mockStorageClassEvents: EventListVo[] = [
  {
    name: 'event-storageclass-created',
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
    reportingController: 'StorageClass',
    reportingInstance: 'storageclass-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'storage.k8s.io/v1',
      kind: 'StorageClass',
      name: 'ssd-storage',
      namespace: 'default',
      uid: mockStorageClassDetail.uid,
    },
    note: 'StorageClass ssd-storage created',
    type: 'Normal',
  },
  {
    name: 'event-storageclass-updated',
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
    reportingController: 'StorageClass',
    reportingInstance: 'storageclass-controller',
    action: 'Updated',
    reason: 'Updated',
    regarding: {
      apiVersion: 'storage.k8s.io/v1',
      kind: 'StorageClass',
      name: 'ssd-storage',
      namespace: 'default',
      uid: mockStorageClassDetail.uid,
    },
    note: 'StorageClass ssd-storage updated',
    type: 'Normal',
  },
]
