/**
 * StorageClass Mock API
 * @module mock/kubernetes/storage/storageClass
 */
import type { PageVo } from '@/types/common'
import type { StorageClassResp, StorageClassQueryReq } from '@/types/kubernetes/storage/storageClass'

import { generateId } from '@/mock/utils'

/**
 * 获取 StorageClass 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getStorageClassPage(clusterUid: string, params: Partial<StorageClassQueryReq>): PageVo<StorageClassResp> {
  const { name, provisioner, page = 1, pageSize = 10 } = params || {}
  let filtered = mockSCs.filter(s => s.clusterUid === clusterUid)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (provisioner) filtered = filtered.filter(s => s.provisioner === provisioner)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 StorageClass 详情
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @returns StorageClass 详情
 */
function getStorageClassDetail(clusterUid: string, name: string): StorageClassResp | null {
  return mockSCs.find(s => s.clusterUid === clusterUid && s.name === name) || null
}

/**
 * 更新 StorageClass 标签
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageStorageClassLabels(
  clusterUid: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockSCs.findIndex(s => s.clusterUid === clusterUid && s.name === name)
  if (index === -1) {
    console.error('[Update StorageClass Labels] can not find sc:', name)
    return
  }
  const currentLabels = mockSCs[index].labels || {}
  if (operation === 1) {
    mockSCs[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockSCs[index].labels = newLabels
  } else if (operation === 3) {
    mockSCs[index].labels = labels
  }
}

/**
 * 更新 StorageClass 注解
 * @param clusterUid - 集群 UID
 * @param name - StorageClass 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageStorageClassAnnotations(
  clusterUid: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockSCs.findIndex(s => s.clusterUid === clusterUid && s.name === name)
  if (index === -1) {
    console.error('[Update StorageClass Annotations] can not find sc:', name)
    return
  }
  const currentAnnotations = mockSCs[index].annotations || {}
  if (operation === 1) {
    mockSCs[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockSCs[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockSCs[index].annotations = annotations
  }
}

/**
 * StorageClass 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/storageclasses - 获取 StorageClass 分页列表
 * - GET /kubernetes/clusters/:clusterUid/storageclasses/:name - 获取 StorageClass 详情
 * - PUT /kubernetes/clusters/:clusterUid/storageclasses/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterUid/storageclasses/:name/annotations - 更新注解
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<StorageClassQueryReq> }) =>
      getStorageClassPage(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      getStorageClassDetail(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/labels',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { labels: Record<string, string>; operation: number }
    }) => manageStorageClassLabels(pathParams.clusterUid, pathParams.name, data.labels, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/annotations',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { annotations: Record<string, string>; operation: number }
    }) => manageStorageClassAnnotations(pathParams.clusterUid, pathParams.name, data.annotations, data.operation),
  },
]

/**
 * StorageClass Mock 数据
 */
const mockSCs: StorageClassResp[] = [
  {
    id: generateId(),
    name: 'ssd-storage',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    labels: { type: 'ssd' },
    deletable: true,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'standard-storage',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/gce-pd',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    labels: { type: 'standard' },
    deletable: true,
    createAt: '2024-01-15T10:05:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'nfs-storage',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    provisioner: 'nfs.io/provisioner',
    reclaimPolicy: 'Retain',
    mountOptions: ['nfsvers=4.1', 'soft=true'],
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    labels: { type: 'nfs' },
    deletable: true,
    createAt: '2024-02-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-12T16:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'local-storage',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    provisioner: 'kubernetes.io/no-provisioner',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: false,
    labels: { type: 'local' },
    deletable: true,
    createAt: '2024-02-15T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'ceph-rbd',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    provisioner: 'ceph.com/rbd',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    labels: { type: 'ceph' },
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin',
  },
]
