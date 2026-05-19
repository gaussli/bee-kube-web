/**
 * ServiceAccount Mock API
 * @module mock/kubernetes/security/serviceAccount
 */
import type { PageResp } from '@/types/common'
import type { ServiceAccountResp, ServiceAccountQueryReq, ServiceAccountReq } from '@/types/kubernetes/security/serviceAccount'
import { generateId } from '@/mock/utils'

/**
 * 获取 ServiceAccount 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getServiceAccountPage(clusterId: string, namespaceName: string, params: Partial<ServiceAccountQueryReq>): PageResp<ServiceAccountResp> {
  const { name, page = 1, pageSize = 10 } = params || {}
  let filtered = mockServiceAccounts.filter(s => s.clusterId === clusterId && s.namespace === namespaceName)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 ServiceAccount 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @returns ServiceAccount 详情
 */
function getServiceAccountDetail(clusterId: string, namespaceName: string, name: string): ServiceAccountResp | null {
  return mockServiceAccounts.find(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name) || null
}

/**
 * 创建 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createServiceAccount(clusterId: string, data: Partial<ServiceAccountReq>): void {
  const created: ServiceAccountResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    secrets: [{ name: `${data.name}-token-${generateId().slice(0, 8)}`, namespace: data.namespace || '' }],
    imagePullSecrets: (data.imagePullSecrets || []).map(name => ({ name })),
    automountServiceAccountToken: data.automountServiceAccountToken,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockServiceAccounts.push(created)
}

/**
 * 更新 ServiceAccount
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateServiceAccount(clusterId: string, data: Partial<ServiceAccountReq>): void {
  const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === data.namespace && s.name === data.name)
  if (index === -1) {
    console.error('[Update ServiceAccount] can not find serviceaccount:', data.name)
    return
  }
  const updated = {
    ...mockServiceAccounts[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockServiceAccounts[index] = updated
}

/**
 * 更新 ServiceAccount 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageServiceAccountLabels(clusterId: string, namespaceName: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name)
  if (index === -1) {
    console.error('[Update ServiceAccount Labels] can not find serviceaccount:', name)
    return
  }
  const currentLabels = mockServiceAccounts[index].labels || {}
  if (operation === 1) {
    mockServiceAccounts[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockServiceAccounts[index].labels = newLabels
  } else if (operation === 3) {
    mockServiceAccounts[index].labels = labels
  }
}

/**
 * 更新 ServiceAccount 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageServiceAccountAnnotations(clusterId: string, namespaceName: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name)
  if (index === -1) {
    console.error('[Update ServiceAccount Annotations] can not find serviceaccount:', name)
    return
  }
  const currentAnnotations = mockServiceAccounts[index].annotations || {}
  if (operation === 1) {
    mockServiceAccounts[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockServiceAccounts[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockServiceAccounts[index].annotations = annotations
  }
}

/**
 * 更新 ServiceAccount 镜像拉取密钥
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 * @param imagePullSecrets - 镜像拉取密钥名称列表
 * @param operation - 操作类型
 */
function manageServiceAccountImagePullSecrets(clusterId: string, namespaceName: string, name: string, imagePullSecrets: string[], operation: number): void {
  const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name)
  if (index === -1) {
    console.error('[Update ServiceAccount ImagePullSecrets] can not find serviceaccount:', name)
    return
  }
  if (operation === 1) {
    mockServiceAccounts[index].imagePullSecrets = [...mockServiceAccounts[index].imagePullSecrets, ...imagePullSecrets.map(name => ({ name }))]
  } else if (operation === 2) {
    mockServiceAccounts[index].imagePullSecrets = mockServiceAccounts[index].imagePullSecrets.filter(s => !imagePullSecrets.includes(s.name))
  } else if (operation === 3) {
    mockServiceAccounts[index].imagePullSecrets = imagePullSecrets.map(name => ({ name }))
  }
}

/**
 * 删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - ServiceAccount 名称
 */
function deleteServiceAccount(clusterId: string, namespaceName: string, name: string): void {
  const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name)
  if (index === -1) {
    console.error('[Delete ServiceAccount] can not find serviceaccount:', name)
    return
  }
  mockServiceAccounts.splice(index, 1)
}

/**
 * 批量删除 ServiceAccount
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 ServiceAccount 名称列表
 */
function deleteServiceAccounts(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockServiceAccounts.findIndex(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name)
    if (index === -1) {
      console.error('[Delete ServiceAccounts] can not find serviceaccount:', name)
    } else {
      mockServiceAccounts.splice(index, 1)
    }
  })
}

/**
 * ServiceAccount 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts - 获取 ServiceAccount 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name - 获取 ServiceAccount 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts - 创建 ServiceAccount
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name - 更新 ServiceAccount
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/imagepullsecrets - 更新镜像拉取密钥
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name - 删除 ServiceAccount
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts - 批量删除 ServiceAccount
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts',
    handler: (pathParams: Record<string, string>, params: Partial<ServiceAccountQueryReq>) => getServiceAccountPage(pathParams.clusterId, pathParams.namespaceName, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name',
    handler: (pathParams: Record<string, string>) => getServiceAccountDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ServiceAccountReq>) => createServiceAccount(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ServiceAccountReq>) => updateServiceAccount(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      manageServiceAccountLabels(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      manageServiceAccountAnnotations(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name/imagepullsecrets',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { imagePullSecrets: string[]; operation: number }) =>
      manageServiceAccountImagePullSecrets(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.imagePullSecrets, data.operation)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name',
    handler: (pathParams: Record<string, string>) => deleteServiceAccount(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deleteServiceAccounts(pathParams.clusterId, pathParams.namespaceName, data)
  }
]

/**
 * ServiceAccount Mock 数据
 */
const mockServiceAccounts: ServiceAccountResp[] = [
  {
    id: generateId(),
    name: 'default',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: 'default-token-abc123', namespace: 'default' }],
    imagePullSecrets: [],
    automountServiceAccountToken: true,
    labels: { 'kubernetes.io/cluster-service': 'true' },
    deletable: false,
    createAt: '2024-01-15T08:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T08:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: 'kube-dns-token-xyz789', namespace: 'kube-system' }],
    imagePullSecrets: [],
    automountServiceAccountToken: false,
    labels: { 'k8s-app': 'kube-dns', 'kubernetes.io/cluster-service': 'true' },
    annotations: { 'kubernetes.io/description': 'DNS service account' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'sample-app',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: 'sample-app-token-def456', namespace: 'default' }],
    imagePullSecrets: [{ name: 'regcred' }],
    automountServiceAccountToken: true,
    labels: { 'app.kubernetes.io/name': 'sample-app' },
    deletable: true,
    createAt: '2024-03-10T10:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:30:00Z',
    updateBy: 'admin'
  }
]
