/**
 * CRD Mock API
 * @module mock/kubernetes/customResourceDefinition
 */
import type { PageVo } from '@/types/common'
import type { CrdResp, CrdQueryReq, CrdLabelsReq, CrdAnnotationsReq } from '@/types/kubernetes/crd'

import { generateId } from '@/mock/utils'

/**
 * CRD 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/crds - 获取 CRD 分页列表
 * - GET /kubernetes/clusters/:clusterUid/crds/:name - 获取 CRD 详情
 * - POST /kubernetes/clusters/:clusterUid/crds/:name/labels - 更新 CRD 标签
 * - POST /kubernetes/clusters/:clusterUid/crds/:name/annotations - 更新 CRD 注解
 * - DELETE /kubernetes/clusters/:clusterUid/crds/:name - 删除 CRD
 * - DELETE /kubernetes/clusters/:clusterUid/crds - 批量删除 CRD
 */
export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterUid/crds',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<CrdQueryReq>
    }): PageVo<CrdResp> => getCrdPage(pathParams.clusterUid, params),
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterUid/crds/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): CrdResp =>
      getCrdDetail(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'POST',
    url: '/kubernetes/clusters/:clusterUid/crds/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<CrdLabelsReq> }): void =>
      manageCrdLabels(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'POST',
    url: '/kubernetes/clusters/:clusterUid/crds/:name/annotations',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<CrdAnnotationsReq> }): void =>
      manageCrdAnnotations(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'DELETE',
    url: '/kubernetes/clusters/:clusterUid/crds/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteCrd(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'DELETE',
    url: '/kubernetes/clusters/:clusterUid/crds',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: { names: string[] } }): void =>
      deleteCrds(pathParams.clusterUid, data),
  },
]

/**
 * 获取 CRD 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getCrdPage(clusterUid: string, params: Partial<CrdQueryReq>): PageVo<CrdResp> {
  const { name, group, scope, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockCrds].filter(c => c.clusterUid === clusterUid)
  if (name) {
    filtered = filtered.filter(c => c.name.includes(name))
  }
  if (group) {
    filtered = filtered.filter(c => c.group.includes(group))
  }
  if (scope) {
    filtered = filtered.filter(c => c.scope === scope)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 获取 CRD 详情
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @returns CRD 详情
 */
function getCrdDetail(clusterUid: string, name: string): CrdResp {
  const crd = mockCrds.find(c => c.clusterUid === clusterUid && c.name === name)
  if (!crd) {
    throw new Error(`[Get CRD Detail] can not find crd: ${name}`)
  }
  return { ...crd }
}

/**
 * 更新 CRD 标签
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @param data - 标签更新数据
 */
function manageCrdLabels(clusterUid: string, name: string, data: Partial<CrdLabelsReq>): void {
  const index = mockCrds.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Update CRD Labels] can not find crd:', name)
    return
  }
  const { labels, operation } = data
  const currentLabels = mockCrds[index].labels || {}

  if (operation === 1) {
    mockCrds[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels || {}).forEach(key => delete newLabels[key])
    mockCrds[index].labels = newLabels
  } else if (operation === 3) {
    mockCrds[index].labels = labels
  }
  mockCrds[index].updateAt = new Date().toLocaleString()
  mockCrds[index].updateBy = 'admin'
}

/**
 * 更新 CRD 注解
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 * @param data - 注解更新数据
 */
function manageCrdAnnotations(clusterUid: string, name: string, data: Partial<CrdAnnotationsReq>): void {
  const index = mockCrds.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Update CRD Annotations] can not find crd:', name)
    return
  }
  const { annotations, operation } = data
  const currentAnnotations = mockCrds[index].annotations || {}

  if (operation === 1) {
    mockCrds[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations || {}).forEach(key => delete newAnnotations[key])
    mockCrds[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockCrds[index].annotations = annotations
  }
  mockCrds[index].updateAt = new Date().toLocaleString()
  mockCrds[index].updateBy = 'admin'
}

/**
 * 删除 CRD
 * @param clusterUid - 集群 UID
 * @param name - CRD 名称
 */
function deleteCrd(clusterUid: string, name: string): void {
  const index = mockCrds.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Delete CRD] can not find crd:', name)
    return
  }
  mockCrds.splice(index, 1)
}

/**
 * 批量删除 CRD
 * @param clusterUid - 集群 UID
 * @param data - 批量删除参数
 * @param data.names - 待删除的 CRD 名称列表
 */
function deleteCrds(clusterUid: string, data: { names: string[] }): void {
  const { names } = data
  names.forEach(name => {
    const index = mockCrds.findIndex(c => c.clusterUid === clusterUid && c.name === name)
    if (index === -1) {
      console.error('[Delete CRDs] can not find crd:', name)
    } else {
      mockCrds.splice(index, 1)
    }
  })
}

/**
 * 模拟 CRD 数据
 * @remarks 包含多种常见的 CRD 示例数据，如 Prometheus Operator、cert-manager、ArgoCD 等
 */
const mockCrds: CrdResp[] = [
  {
    id: generateId(),
    name: 'alertmanagers.monitoring.coreos.com',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'alertmanagers',
      kind: 'Alertmanager',
      namespaced: true,
      versions: ['v1'],
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'alertmanager' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'prometheuses.monitoring.coreos.com',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'prometheuses',
      kind: 'Prometheus',
      namespaced: true,
      versions: ['v1'],
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'prometheus' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'servicemonitors.monitoring.coreos.com',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'servicemonitors',
      kind: 'ServiceMonitor',
      namespaced: true,
      versions: ['v1'],
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'servicemonitor' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'ingresses.networking.k8s.io',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'networking.k8s.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'ingresses',
      kind: 'Ingress',
      namespaced: true,
      versions: ['v1'],
      shortNames: ['ing'],
    },
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'certificates.cert-manager.io',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'cert-manager.io',
    versions: [
      { name: 'v1', served: true, storage: true },
      { name: 'v1alpha2', served: true, storage: false },
      { name: 'v1alpha3', served: true, storage: false },
    ],
    scope: 'Namespaced',
    resource: {
      name: 'certificates',
      kind: 'Certificate',
      namespaced: true,
      versions: ['v1', 'v1alpha2', 'v1alpha3'],
      shortNames: ['cert', 'certs'],
    },
    creationTimestamp: '2024-02-10T14:00:00Z',
    labels: { app: 'cert-manager' },
    deletable: false,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-10T14:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'volumesnapshotclasses.snapshot.storage.k8s.io',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'snapshot.storage.k8s.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Cluster',
    resource: {
      name: 'volumesnapshotclasses',
      kind: 'VolumeSnapshotClass',
      namespaced: false,
      versions: ['v1'],
    },
    creationTimestamp: '2024-02-20T09:00:00Z',
    labels: { app: 'csi-snapshot' },
    deletable: false,
    createAt: '2024-02-20T09:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-20T09:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'clusterissuers.cert-manager.io',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'cert-manager.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Cluster',
    resource: {
      name: 'clusterissuers',
      kind: 'ClusterIssuer',
      namespaced: false,
      versions: ['v1'],
    },
    creationTimestamp: '2024-02-10T14:00:00Z',
    labels: { app: 'cert-manager' },
    deletable: false,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-10T14:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'argoproj.io.applicationsets',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'argoproj.io',
    versions: [{ name: 'v1alpha1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'applicationsets',
      kind: 'ApplicationSet',
      namespaced: true,
      versions: ['v1alpha1'],
    },
    creationTimestamp: '2024-03-05T11:00:00Z',
    labels: { app: 'argocd-applicationset' },
    deletable: false,
    createAt: '2024-03-05T11:00:00Z',
    createBy: 'system',
    updateAt: '2024-03-05T11:00:00Z',
    updateBy: 'system',
  },
]
