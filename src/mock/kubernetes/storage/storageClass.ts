/**
 * @fileOverview Kubernetes StorageClass 管理 Mock API
 * @module mock/kubernetes/storage/storageClass
 */
import { generateId } from '@/mock/utils'
import type { StorageClassResp, StorageClassQueryReq, StorageClassLabelsReq, StorageClassAnnotationsReq } from '@/types'

/**
 * StorageClass 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/storageclasses - 获取 StorageClass 分页列表
 * - GET /kubernetes/clusters/:clusterId/storageclasses/:name - 获取 StorageClass 详情
 * - POST /kubernetes/clusters/:clusterId/storageclasses/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/storageclasses/:name/annotations - 更新注解
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/storageclasses',
    handler: (pathParams: Record<string, string>, params: Partial<StorageClassQueryReq>) => getStorageClassPage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/storageclasses/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getStorageClassDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/storageclasses/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: StorageClassLabelsReq) => manageStorageClassLabels(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/storageclasses/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: StorageClassAnnotationsReq) => manageStorageClassAnnotations(pathParams.clusterId, pathParams.name, data)
  }
]

function getStorageClassPage(clusterId: string, params: Partial<StorageClassQueryReq>) {
  const { name, provisioner, page = 1, pageSize = 10 } = params || {}
  let filtered = mockSCs.filter(s => s.clusterId === clusterId)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (provisioner) filtered = filtered.filter(s => s.provisioner === provisioner)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getStorageClassDetail(clusterId: string, name: string) {
  return mockSCs.find(s => s.clusterId === clusterId && s.name === name) || null
}

function manageStorageClassLabels(clusterId: string, name: string, data: StorageClassLabelsReq) {
  const index = mockSCs.findIndex(s => s.clusterId === clusterId && s.name === name)
  if (index === -1) return false
  const currentLabels = mockSCs[index].labels || {}
  if (data.operation === 1) mockSCs[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockSCs[index].labels = newLabels
  } else if (data.operation === 3) mockSCs[index].labels = data.labels
  return true
}

function manageStorageClassAnnotations(clusterId: string, name: string, data: StorageClassAnnotationsReq) {
  const index = mockSCs.findIndex(s => s.clusterId === clusterId && s.name === name)
  if (index === -1) return false
  const currentAnnotations = mockSCs[index].annotations || {}
  if (data.operation === 1) mockSCs[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockSCs[index].annotations = newAnnotations
  } else if (data.operation === 3) mockSCs[index].annotations = data.annotations
  return true
}

const mockSCs: StorageClassResp[] = [
  {
    id: generateId(),
    name: 'ssd-storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    labels: { type: 'ssd' },
    annotations: {},
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'standard-storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    labels: { type: 'standard' },
    annotations: {},
    createAt: '2024-01-15 10:05:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'nfs-storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    provisioner: 'nfs.io/provisioner',
    reclaimPolicy: 'Retain',
    mountOptions: ['nfsvers=4.1', 'soft=true'],
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    labels: { type: 'nfs' },
    annotations: {},
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'local-storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/no-provisioner',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: false,
    labels: { type: 'local' },
    annotations: {},
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-01 10:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'ceph-rbd',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    provisioner: 'ceph.com/rbd',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    labels: { type: 'ceph' },
    annotations: {},
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  }
]
