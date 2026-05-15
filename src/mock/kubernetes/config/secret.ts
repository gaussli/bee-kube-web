/**
 * @fileOverview Kubernetes Secret 管理 Mock API
 * @module mock/kubernetes/config/secret
 */
import { generateId } from '@/mock/utils'
import type { SecretResp, SecretQueryReq, SecretReq, SecretDataReq, SecretLabelsReq, SecretAnnotationsReq } from '@/types'

/**
 * Secret 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets - 获取 Secret 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 获取 Secret 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets - 创建 Secret
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 更新 Secret
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data - 更新数据
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 删除 Secret
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets',
    handler: (pathParams: Record<string, string>, params: Partial<SecretQueryReq>) => getSecretPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getSecretDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<SecretReq>) => createSecret(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<SecretReq>) => updateSecret(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data',
    handler: (pathParams: Record<string, string>, params: any, data: SecretDataReq) => manageSecretData(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: SecretLabelsReq) => manageSecretLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: SecretAnnotationsReq) => manageSecretAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deleteSecret(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deleteSecrets(pathParams.clusterId, pathParams.namespace, data)
  }
]

function getSecretPage(clusterId: string, namespace: string, params: Partial<SecretQueryReq>) {
  const { name, type, page = 1, pageSize = 10 } = params || {}
  let filtered = mockSecrets.filter(s => s.clusterId === clusterId && s.namespace === namespace)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (type) filtered = filtered.filter(s => s.type === type)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getSecretDetail(clusterId: string, namespace: string, name: string) {
  return mockSecrets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name) || null
}

function createSecret(clusterId: string, namespace: string, data: Partial<SecretReq>) {
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
  return newSecret.id
}

function updateSecret(clusterId: string, namespace: string, name: string, data: Partial<SecretReq>) {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return null
  const updated = { ...mockSecrets[index], ...data, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockSecrets[index] = updated
  return updated.id
}

function manageSecretData(clusterId: string, namespace: string, name: string, data: SecretDataReq) {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false
  const currentData = mockSecrets[index].data || {}
  if (data.operation === 1) mockSecrets[index].data = { ...currentData, ...data.data }
  else if (data.operation === 2) {
    const newData = { ...currentData }
    Object.keys(data.data).forEach(key => delete newData[key])
    mockSecrets[index].data = newData
  } else if (data.operation === 3) mockSecrets[index].data = data.data
  mockSecrets[index].updateAt = new Date().toLocaleString()
  return true
}

function manageSecretLabels(clusterId: string, namespace: string, name: string, data: SecretLabelsReq) {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false
  const currentLabels = mockSecrets[index].labels || {}
  if (data.operation === 1) mockSecrets[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockSecrets[index].labels = newLabels
  } else if (data.operation === 3) mockSecrets[index].labels = data.labels
  return true
}

function manageSecretAnnotations(clusterId: string, namespace: string, name: string, data: SecretAnnotationsReq) {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false
  const currentAnnotations = mockSecrets[index].annotations || {}
  if (data.operation === 1) mockSecrets[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockSecrets[index].annotations = newAnnotations
  } else if (data.operation === 3) mockSecrets[index].annotations = data.annotations
  return true
}

function deleteSecret(clusterId: string, namespace: string, name: string) {
  const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false
  mockSecrets.splice(index, 1)
  return true
}

function deleteSecrets(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockSecrets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
    if (index !== -1) mockSecrets.splice(index, 1)
  })
  return true
}

const mockSecrets: SecretResp[] = [
  {
    id: 'secret-001',
    name: 'mysql-credentials',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'Opaque',
    stringData: { username: 'dbadmin', password: '********' },
    labels: { app: 'mysql', env: 'production' },
    annotations: {},
    refs: ['sts-001'],
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: 'secret-002',
    name: 'tls-cert',
    namespace: 'ingress-nginx',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'kubernetes.io/tls',
    data: { 'tls.crt': 'LS0tLS1...', 'tls.key': 'LS0tLS1...' },
    labels: { app: 'ingress-nginx' },
    annotations: {},
    refs: ['deploy-001'],
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: 'secret-003',
    name: 'dockerhub-secret',
    namespace: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    type: 'kubernetes.io/dockerconfigjson',
    data: { '.dockerconfigjson': 'eyJhdXRocyI6eyJkb2NrZXIuaHViLmNvbSI6eyJ1c2VybmFtZSI6InNlY3JldCIsInBhc3N3b3JkIjoiKiMqKioqIn19fQ==' },
    labels: { app: 'pull-secret' },
    annotations: {},
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: 'secret-004',
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
