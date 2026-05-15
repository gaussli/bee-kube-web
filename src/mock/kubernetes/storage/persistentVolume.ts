/**
 * @fileOverview Kubernetes PersistentVolume 管理 Mock API
 * @module mock/kubernetes/storage/persistentVolume
 */
import { generateId } from '@/mock/utils'
import type { PersistentVolumeResp, PersistentVolumeQueryReq, PersistentVolumeLabelsReq, PersistentVolumeAnnotationsReq } from '@/types'

/**
 * PersistentVolume 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/persistentvolumes - 获取 PersistentVolume 分页列表
 * - GET /kubernetes/clusters/:clusterId/persistentvolumes/:name - 获取 PersistentVolume 详情
 * - POST /kubernetes/clusters/:clusterId/persistentvolumes/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/persistentvolumes/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/persistentvolumes/:name - 删除 PersistentVolume
 * - DELETE /kubernetes/clusters/:clusterId/persistentvolumes/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes',
    handler: (pathParams: Record<string, string>, params: Partial<PersistentVolumeQueryReq>) => getPersistentVolumePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getPersistentVolumeDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: PersistentVolumeLabelsReq) => managePersistentVolumeLabels(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: PersistentVolumeAnnotationsReq) => managePersistentVolumeAnnotations(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deletePersistentVolume(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deletePersistentVolumes(pathParams.clusterId, data)
  }
]

function getPersistentVolumePage(clusterId: string, params: Partial<PersistentVolumeQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockPVs.filter(p => p.clusterId === clusterId)
  if (name) filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(p => p.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getPersistentVolumeDetail(clusterId: string, name: string) {
  return mockPVs.find(p => p.clusterId === clusterId && p.name === name) || null
}

function managePersistentVolumeLabels(clusterId: string, name: string, data: PersistentVolumeLabelsReq) {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) return false
  const currentLabels = mockPVs[index].labels || {}
  if (data.operation === 1) mockPVs[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockPVs[index].labels = newLabels
  } else if (data.operation === 3) mockPVs[index].labels = data.labels
  return true
}

function managePersistentVolumeAnnotations(clusterId: string, name: string, data: PersistentVolumeAnnotationsReq) {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) return false
  const currentAnnotations = mockPVs[index].annotations || {}
  if (data.operation === 1) mockPVs[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockPVs[index].annotations = newAnnotations
  } else if (data.operation === 3) mockPVs[index].annotations = data.annotations
  return true
}

function deletePersistentVolume(clusterId: string, name: string) {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) return false
  mockPVs.splice(index, 1)
  return true
}

function deletePersistentVolumes(clusterId: string, names: string[]) {
  names.forEach(name => {
    const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
    if (index !== -1) mockPVs.splice(index, 1)
  })
  return true
}

const mockPVs: PersistentVolumeResp[] = [
  {
    id: generateId(),
    name: 'pv-mysql-data-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    capacity: { storage: '100Gi' },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    claimName: 'mysql-data-pvc',
    claimNamespace: 'data',
    labels: { type: 'database' },
    annotations: {},
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-mongodb-data-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    capacity: { storage: '50Gi' },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    claimName: 'mongodb-data-pvc',
    claimNamespace: 'data',
    labels: { type: 'database' },
    annotations: {},
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-app-logs-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    capacity: { storage: '20Gi' },
    accessModes: ['ReadWriteMany'],
    storageClassName: 'standard-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    claimName: 'app-logs-pvc',
    claimNamespace: 'app-backend',
    labels: { type: 'logs' },
    annotations: {},
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-minio-data-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    capacity: { storage: '500Gi' },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'ssd-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    claimName: 'minio-data-pvc',
    claimNamespace: 'storage',
    labels: { type: 'object-storage' },
    annotations: {},
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 15:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-nfs-shared-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    capacity: { storage: '1Ti' },
    accessModes: ['ReadWriteMany'],
    storageClassName: 'nfs-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    nfs: { server: '192.168.1.100', path: '/shared/data' },
    labels: { type: 'shared' },
    annotations: {},
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-01 10:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-local-001',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Released',
    capacity: { storage: '200Gi' },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'local-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    labels: { type: 'local' },
    annotations: {},
    createAt: '2024-02-10 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  }
]
