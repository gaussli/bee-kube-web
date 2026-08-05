/**
 * PersistentVolumeClaim Mock API
 * @module mock/kubernetes/storage/persistentVolumeClaim
 */
import type { PageVo } from '@/types/common'
import type {
  PersistentVolumeClaimResp,
  PersistentVolumeClaimQueryReq,
  PersistentVolumeClaimReq,
} from '@/types/kubernetes/storage/persistentVolumeClaim'

import { generateId } from '@/mock/utils'

/**
 * 获取 PersistentVolumeClaim 分页列表
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getPersistentVolumeClaimPage(
  clusterUid: string,
  namespaceName: string,
  params: Partial<PersistentVolumeClaimQueryReq>,
): PageVo<PersistentVolumeClaimResp> {
  const { name, status, storageClassName, page = 1, pageSize = 10 } = params || {}
  let filtered = mockPVCS.filter(p => p.clusterUid === clusterUid && p.namespace === namespaceName)
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
 * 获取 PersistentVolumeClaim 详情
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 详情
 */
function getPersistentVolumeClaimDetail(
  clusterUid: string,
  namespaceName: string,
  name: string,
): PersistentVolumeClaimResp | null {
  return mockPVCS.find(p => p.clusterUid === clusterUid && p.namespace === namespaceName && p.name === name) || null
}

/**
 * 创建 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 */
function createPersistentVolumeClaim(clusterUid: string, data: Partial<PersistentVolumeClaimReq>): void {
  const created: PersistentVolumeClaimResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterUid,
    clusterName: 'prod-cluster',
    status: 'Pending',
    requestStorage: data.requestStorage || '10Gi',
    storageClassName: data.storageClassName,
    accessModes: data.accessModes || ['ReadWriteOnce'],
    volumeMode: data.volumeMode,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin',
  }
  mockPVCS.push(created)
}

/**
 * 更新 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 */
function updatePersistentVolumeClaim(clusterUid: string, data: Partial<PersistentVolumeClaimReq>): void {
  const index = mockPVCS.findIndex(
    p => p.clusterUid === clusterUid && p.namespace === data.namespace && p.name === data.name,
  )
  if (index === -1) {
    console.error('[Update PersistentVolumeClaim] can not find pvc:', data.name)
    return
  }
  const updated = {
    ...mockPVCS[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString(),
  }
  mockPVCS[index] = updated
}

/**
 * 更新 PersistentVolumeClaim 标签
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function managePersistentVolumeClaimLabels(
  clusterUid: string,
  namespaceName: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockPVCS.findIndex(p => p.clusterUid === clusterUid && p.namespace === namespaceName && p.name === name)
  if (index === -1) {
    console.error('[Update PersistentVolumeClaim Labels] can not find pvc:', name)
    return
  }
  const currentLabels = mockPVCS[index].labels || {}
  if (operation === 1) {
    mockPVCS[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockPVCS[index].labels = newLabels
  } else if (operation === 3) {
    mockPVCS[index].labels = labels
  }
}

/**
 * 更新 PersistentVolumeClaim 注解
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function managePersistentVolumeClaimAnnotations(
  clusterUid: string,
  namespaceName: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockPVCS.findIndex(p => p.clusterUid === clusterUid && p.namespace === namespaceName && p.name === name)
  if (index === -1) {
    console.error('[Update PersistentVolumeClaim Annotations] can not find pvc:', name)
    return
  }
  const currentAnnotations = mockPVCS[index].annotations || {}
  if (operation === 1) {
    mockPVCS[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockPVCS[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockPVCS[index].annotations = annotations
  }
}

/**
 * 删除 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param name - PersistentVolumeClaim 名称
 */
function deletePersistentVolumeClaim(clusterUid: string, namespaceName: string, name: string): void {
  const index = mockPVCS.findIndex(p => p.clusterUid === clusterUid && p.namespace === namespaceName && p.name === name)
  if (index === -1) {
    console.error('[Delete PersistentVolumeClaim] can not find pvc:', name)
    return
  }
  mockPVCS.splice(index, 1)
}

/**
 * 批量删除 PersistentVolumeClaim
 * @param clusterUid - 集群 UID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 PersistentVolumeClaim 名称列表
 */
function deletePersistentVolumeClaims(clusterUid: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockPVCS.findIndex(
      p => p.clusterUid === clusterUid && p.namespace === namespaceName && p.name === name,
    )
    if (index === -1) {
      console.error('[Delete PersistentVolumeClaims] can not find pvc:', name)
    } else {
      mockPVCS.splice(index, 1)
    }
  })
}

/**
 * PersistentVolumeClaim 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims - 获取 PersistentVolumeClaim 分页列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name - 获取 PersistentVolumeClaim 详情
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims - 创建 PersistentVolumeClaim
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name - 更新 PersistentVolumeClaim
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name - 删除 PersistentVolumeClaim
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims - 批量删除 PersistentVolumeClaim
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<PersistentVolumeClaimQueryReq>
    }) => getPersistentVolumeClaimPage(pathParams.clusterUid, pathParams.namespaceName, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      getPersistentVolumeClaimDetail(pathParams.clusterUid, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimReq> }) =>
      createPersistentVolumeClaim(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimReq> }) =>
      updatePersistentVolumeClaim(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name/labels',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { labels: Record<string, string>; operation: number }
    }) =>
      managePersistentVolumeClaimLabels(
        pathParams.clusterUid,
        pathParams.namespaceName,
        pathParams.name,
        data.labels,
        data.operation,
      ),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name/annotations',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { annotations: Record<string, string>; operation: number }
    }) =>
      managePersistentVolumeClaimAnnotations(
        pathParams.clusterUid,
        pathParams.namespaceName,
        pathParams.name,
        data.annotations,
        data.operation,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      deletePersistentVolumeClaim(pathParams.clusterUid, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespaceName/persistentvolumeclaims',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }) =>
      deletePersistentVolumeClaims(pathParams.clusterUid, pathParams.namespaceName, data),
  },
]

/**
 * PersistentVolumeClaim Mock 数据
 */
const mockPVCS: PersistentVolumeClaimResp[] = [
  {
    id: generateId(),
    name: 'mysql-data-pvc',
    namespace: 'data',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '100Gi',
    volumeName: 'pv-mysql-data-001',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'mysql-primary' },
    deletable: true,
    createAt: '2024-01-20T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'mongodb-data-pvc',
    namespace: 'data',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '50Gi',
    volumeName: 'pv-mongodb-data-001',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'mongodb' },
    deletable: true,
    createAt: '2024-02-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T11:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'elasticsearch-data-pvc',
    namespace: 'logging',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Pending',
    requestStorage: '300Gi',
    storageClassName: 'ssd-storage',
    accessModes: ['ReadWriteOnce'],
    labels: { app: 'elasticsearch' },
    deletable: true,
    createAt: '2024-03-01T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-19T08:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'app-logs-pvc',
    namespace: 'app-backend',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    status: 'Bound',
    requestStorage: '20Gi',
    volumeName: 'pv-app-logs-001',
    storageClassName: 'standard-storage',
    accessModes: ['ReadWriteMany'],
    labels: { app: 'backend-api', type: 'logs' },
    deletable: true,
    createAt: '2024-02-15T14:00:00Z',
    createBy: 'developer',
    updateAt: '2024-03-12T16:00:00Z',
    updateBy: 'developer',
  },
]
