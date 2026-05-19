/**
 * Kubernetes Secret 管理 Mock API
 * @module mock/kubernetes/config/secret
 */
import type { PageResp } from '@/types/common'
import type { SecretQueryReq, SecretResp, SecretReq, SecretDataReq, SecretLabelsReq, SecretAnnotationsReq } from '@/types/kubernetes/config/secret'
import { generateId } from '@/mock/utils'

/**
 * Secret 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets - 获取 Secret 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 获取 Secret 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets - 创建 Secret
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 更新 Secret
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data - 更新数据
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 删除 Secret
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets',
    handler: (pathParams: Record<string, string>, params: Partial<SecretQueryReq>): PageResp<SecretResp> => getSecretPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>): SecretResp => getSecretDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets',
    handler: (pathParams: Record<string, string>, data: Partial<SecretReq>): void => createSecret(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<SecretReq>): void => updateSecret(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data',
    handler: (pathParams: Record<string, string>, data: Partial<SecretDataReq>): void => manageSecretData(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<SecretLabelsReq>): void => manageSecretLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<SecretAnnotationsReq>): void => manageSecretAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>): void => deleteSecret(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]): void => deleteSecrets(_pathParams.clusterId, _pathParams.namespace, data)
  }
]

/**
 * 获取 Secret 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getSecretPage(clusterId: string, namespace: string, params: Partial<SecretQueryReq>): PageResp<SecretResp> {
  const { name, type, page = 1, pageSize = 10 } = params || {}
  let filtered = mockSecrets.filter(s => s.clusterId === clusterId && s.namespace === namespace)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (type) filtered = filtered.filter(s => s.type === type)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

/**
 * 获取 Secret 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
function getSecretDetail(clusterId: string, namespace: string, name: string): SecretResp {
  return mockSecrets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name) || (null as any)
}

/**
 * 创建 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createSecret(clusterId: string, namespace: string, data: Partial<SecretReq>): void {
  const newSecret: SecretResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    type: data.type || 'Opaque',
    data: data.data,
    stringData: data.stringData,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockSecrets.push(newSecret)
}

/**
 * 更新 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新数据
 */
function updateSecret(clusterId: string, namespace: string, name: string, data: Partial<SecretReq>): void {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return
  const updated = {
    ...mockSecrets[index],
    ...data,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockSecrets[index] = updated
}

/**
 * 更新 Secret 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 数据参数
 */
function manageSecretData(clusterId: string, namespace: string, name: string, data: Partial<SecretDataReq>): void {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return
  const currentData = mockSecrets[index].data || {}
  if (data.operation === 1) mockSecrets[index].data = { ...currentData, ...data.data }
  else if (data.operation === 2) {
    const newData = { ...currentData }
    Object.keys(data.data || {}).forEach(key => delete newData[key])
    mockSecrets[index].data = newData
  } else if (data.operation === 3) mockSecrets[index].data = data.data
  mockSecrets[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新 Secret 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签数据
 */
function manageSecretLabels(clusterId: string, namespace: string, name: string, data: Partial<SecretLabelsReq>): void {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return
  const currentLabels = mockSecrets[index].labels || {}
  if (data.operation === 1) mockSecrets[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels || {}).forEach(key => delete newLabels[key])
    mockSecrets[index].labels = newLabels
  } else if (data.operation === 3) mockSecrets[index].labels = data.labels
}

/**
 * 更新 Secret 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解数据
 */
function manageSecretAnnotations(clusterId: string, namespace: string, name: string, data: Partial<SecretAnnotationsReq>): void {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return
  const currentAnnotations = mockSecrets[index].annotations || {}
  if (data.operation === 1) mockSecrets[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations || {}).forEach(key => delete newAnnotations[key])
    mockSecrets[index].annotations = newAnnotations
  } else if (data.operation === 3) mockSecrets[index].annotations = data.annotations
}

/**
 * 删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
function deleteSecret(clusterId: string, namespace: string, name: string): void {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return
  mockSecrets.splice(index, 1)
}

/**
 * 批量删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Secret 名称数组
 */
function deleteSecrets(clusterId: string, namespace: string, names: string[]): void {
  names.forEach(name => {
    const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
    if (index !== -1) mockSecrets.splice(index, 1)
  })
}

/**
 * 模拟 Secret 数据
 */
const mockSecrets: SecretResp[] = [
  {
    id: generateId(),
    name: 'mysql-credentials',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'Opaque',
    stringData: { username: 'dbadmin', password: '********' },
    labels: { app: 'mysql', env: 'production' },
    refs: ['sts-001'],
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'tls-cert',
    namespace: 'ingress-nginx',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'kubernetes.io/tls',
    data: { 'tls.crt': 'LS0tLS1...', 'tls.key': 'LS0tLS1...' },
    labels: { app: 'ingress-nginx' },
    refs: ['deploy-001'],
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'dockerhub-secret',
    namespace: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'kubernetes.io/dockerconfigjson',
    data: { '.dockerconfigjson': 'eyJhdXRocyI6eyJkb2NrZXIuaHViLmNvbSI6eyJ1c2VybmFtZSI6InNlY3JldCIsInBhc3N3b3JkIjoiKiMqKioqIn19fQ==' },
    labels: { app: 'pull-secret' },
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'api-keys',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'Opaque',
    stringData: { stripe_key: 'sk_live_****', sendgrid_key: 'SG.****', aws_access_key: 'AKIA****' },
    labels: { app: 'backend-api', env: 'production' },
    annotations: { description: '第三方 API 密钥' },
    refs: ['deploy-005'],
    createAt: '2024-03-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'developer'
  }
]
