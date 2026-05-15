/**
 * @fileOverview Kubernetes PersistentVolumeClaim 管理 Mock API
 * @module mock/kubernetes/storage/persistentVolumeClaim
 */
import { generateId } from '@/mock/utils'
import type { PersistentVolumeClaimResp, PersistentVolumeClaimQueryReq, PersistentVolumeClaimReq, PersistentVolumeClaimLabelsReq, PersistentVolumeClaimAnnotationsReq } from '@/types'

/**
 * PersistentVolumeClaim 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims - 获取 PersistentVolumeClaim 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name - 获取 PersistentVolumeClaim 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims - 创建 PersistentVolumeClaim
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name - 更新 PersistentVolumeClaim
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name - 删除 PersistentVolumeClaim
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims',
    handler: (pathParams: Record<string, string>, params: Partial<PersistentVolumeClaimQueryReq>) => getPersistentVolumeClaimPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getPersistentVolumeClaimDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<PersistentVolumeClaimReq>) => createPersistentVolumeClaim(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<PersistentVolumeClaimReq>) =>
      updatePersistentVolumeClaim(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: PersistentVolumeClaimLabelsReq) =>
      managePersistentVolumeClaimLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: PersistentVolumeClaimAnnotationsReq) =>
      managePersistentVolumeClaimAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deletePersistentVolumeClaim(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/persistentvolumeclaims/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deletePersistentVolumeClaims(pathParams.clusterId, pathParams.namespace, data)
  }
]

function getPersistentVolumeClaimPage(clusterId: string, namespace: string, params: Partial<PersistentVolumeClaimQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockPVCS.filter(p => p.clusterId === clusterId && p.namespace === namespace)
  if (name) filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(p => p.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getPersistentVolumeClaimDetail(clusterId: string, namespace: string, name: string) {
  return mockPVCS.find(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name) || null
}

function createPersistentVolumeClaim(clusterId: string, namespace: string, data: Partial<PersistentVolumeClaimReq>) {
  const newPvc: PersistentVolumeClaimResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    status: 'Pending',
    requestStorage: data.requestStorage || '10Gi',
    storageClassName: data.storageClassName,
    accessModes: data.accessModes || ['ReadWriteOnce'],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockPVCS.push(newPvc)
  return newPvc.id
}

function updatePersistentVolumeClaim(clusterId: string, namespace: string, name: string, data: Partial<PersistentVolumeClaimReq>) {
  const index = mockPVCS.findIndex(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name)
  if (index === -1) return null
  const updated = { ...mockPVCS[index], ...data, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockPVCS[index] = updated
  return updated.id
}

function managePersistentVolumeClaimLabels(clusterId: string, namespace: string, name: string, data: PersistentVolumeClaimLabelsReq) {
  const index = mockPVCS.findIndex(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name)
  if (index === -1) return false
  const currentLabels = mockPVCS[index].labels || {}
  if (data.operation === 1) mockPVCS[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockPVCS[index].labels = newLabels
  } else if (data.operation === 3) mockPVCS[index].labels = data.labels
  return true
}

function managePersistentVolumeClaimAnnotations(clusterId: string, namespace: string, name: string, data: PersistentVolumeClaimAnnotationsReq) {
  const index = mockPVCS.findIndex(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name)
  if (index === -1) return false
  const currentAnnotations = mockPVCS[index].annotations || {}
  if (data.operation === 1) mockPVCS[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockPVCS[index].annotations = newAnnotations
  } else if (data.operation === 3) mockPVCS[index].annotations = data.annotations
  return true
}

function deletePersistentVolumeClaim(clusterId: string, namespace: string, name: string) {
  const index = mockPVCS.findIndex(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name)
  if (index === -1) return false
  mockPVCS.splice(index, 1)
  return true
}

function deletePersistentVolumeClaims(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockPVCS.findIndex(p => p.clusterId === clusterId && p.namespace === namespace && p.name === name)
    if (index !== -1) mockPVCS.splice(index, 1)
  })
  return true
}

const mockPVCS: PersistentVolumeClaimResp[] = [
  {
    id: generateId(),
    name: 'mysql-data-pvc',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '100Gi',
    volumeName: 'pv-mysql-data-001',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'mysql-primary' },
    annotations: {},
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'mongodb-data-pvc',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '50Gi',
    volumeName: 'pv-mongodb-data-001',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'mongodb' },
    annotations: {},
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'elasticsearch-data-pvc',
    namespace: 'logging',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Pending',
    requestStorage: '300Gi',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'elasticsearch' },
    annotations: {},
    createAt: '2024-03-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'app-logs-pvc',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '20Gi',
    volumeName: 'pv-app-logs-001',
    storageClassName: 'standard-storage',
    accessModes: ['ReadWriteMany'],
    labels: { app: 'backend-api', type: 'logs' },
    annotations: {},
    createAt: '2024-02-15 14:00:00',
    createBy: 'developer',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'minio-data-pvc',
    namespace: 'storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '500Gi',
    volumeName: 'pv-minio-data-001',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'minio' },
    annotations: {},
    createAt: '2024-02-20 11:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 15:00:00',
    updateBy: 'admin'
  }
]
