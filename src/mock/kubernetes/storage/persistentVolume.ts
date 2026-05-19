/**
 * PersistentVolume Mock API
 * @module mock/kubernetes/storage/persistentVolume
 */
import type { PageResp } from '@/types/common'
import type { PersistentVolumeResp, PersistentVolumeQueryReq } from '@/types/kubernetes/storage/persistentVolume'
import { generateId } from '@/mock/utils'

/**
 * 获取 PersistentVolume 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getPersistentVolumePage(clusterId: string, params: Partial<PersistentVolumeQueryReq>): PageResp<PersistentVolumeResp> {
  const { name, status, storageClassName, page = 1, pageSize = 10 } = params || {}
  let filtered = mockPVs.filter(p => p.clusterId === clusterId)
  if (name) filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(p => p.status === status)
  if (storageClassName) filtered = filtered.filter(p => p.storageClassName === storageClassName)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 PersistentVolume 详情
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @returns PersistentVolume 详情
 */
function getPersistentVolumeDetail(clusterId: string, name: string): PersistentVolumeResp | null {
  return mockPVs.find(p => p.clusterId === clusterId && p.name === name) || null
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function managePersistentVolumeLabels(clusterId: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) {
    console.error('[Update PersistentVolume Labels] can not find pv:', name)
    return
  }
  const currentLabels = mockPVs[index].labels || {}
  if (operation === 1) {
    mockPVs[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockPVs[index].labels = newLabels
  } else if (operation === 3) {
    mockPVs[index].labels = labels
  }
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function managePersistentVolumeAnnotations(clusterId: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) {
    console.error('[Update PersistentVolume Annotations] can not find pv:', name)
    return
  }
  const currentAnnotations = mockPVs[index].annotations || {}
  if (operation === 1) {
    mockPVs[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockPVs[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockPVs[index].annotations = annotations
  }
}

/**
 * 删除 PersistentVolume
 * @param clusterId - 集群 ID
 * @param name - PersistentVolume 名称
 */
function deletePersistentVolume(clusterId: string, name: string): void {
  const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
  if (index === -1) {
    console.error('[Delete PersistentVolume] can not find pv:', name)
    return
  }
  mockPVs.splice(index, 1)
}

/**
 * 批量删除 PersistentVolume
 * @param clusterId - 集群 ID
 * @param names - 待删除的 PersistentVolume 名称列表
 */
function deletePersistentVolumes(clusterId: string, names: string[]): void {
  names.forEach(name => {
    const index = mockPVs.findIndex(p => p.clusterId === clusterId && p.name === name)
    if (index === -1) {
      console.error('[Delete PersistentVolumes] can not find pv:', name)
    } else {
      mockPVs.splice(index, 1)
    }
  })
}

/**
 * PersistentVolume 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/persistentvolumes - 获取 PersistentVolume 分页列表
 * - GET /kubernetes/clusters/:clusterId/persistentvolumes/:name - 获取 PersistentVolume 详情
 * - PUT /kubernetes/clusters/:clusterId/persistentvolumes/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/persistentvolumes/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/persistentvolumes/:name - 删除 PersistentVolume
 * - DELETE /kubernetes/clusters/:clusterId/persistentvolumes - 批量删除 PersistentVolume
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
    handler: (pathParams: Record<string, string>) => getPersistentVolumeDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      managePersistentVolumeLabels(pathParams.clusterId, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      managePersistentVolumeAnnotations(pathParams.clusterId, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes/:name',
    handler: (pathParams: Record<string, string>) => deletePersistentVolume(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/persistentvolumes',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deletePersistentVolumes(pathParams.clusterId, data)
  }
]

/**
 * PersistentVolume Mock 数据
 */
const mockPVs: PersistentVolumeResp[] = [
  {
    id: generateId(),
    name: 'pv-mysql-data-001',
    clusterId: 'cluster-1',
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
    deletable: true,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-mongodb-data-001',
    clusterId: 'cluster-1',
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
    deletable: true,
    createAt: '2024-01-20T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-nfs-shared-001',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Available',
    capacity: { storage: '1Ti' },
    accessModes: ['ReadWriteMany'],
    storageClassName: 'nfs-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    nfs: { server: '192.168.1.100', path: '/shared/data' },
    labels: { type: 'shared' },
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'pv-local-001',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Released',
    capacity: { storage: '200Gi' },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'local-storage',
    reclaimPolicy: 'Retain',
    volumeMode: 'Filesystem',
    labels: { type: 'local' },
    deletable: true,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin'
  }
]
