/**
 * @fileOverview Kubernetes ConfigMap 管理 Mock API
 * @module mock/kubernetes/config/configmap
 */
import type { ConfigMapResp, ConfigMapQueryReq, ConfigMapReq, ConfigMapDataReq, ConfigMapLabelsReq, ConfigMapAnnotationsReq } from '@/types'
import { generateId } from '@/mock/utils'

/**
 * ConfigMap 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps - 获取 ConfigMap 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 获取 ConfigMap 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps - 创建 ConfigMap
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 更新 ConfigMap
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data - 更新数据
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 删除 ConfigMap
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps',
    handler: (_pathParams: Record<string, string>, _params: Partial<ConfigMapQueryReq>) => getConfigMapPage(_pathParams.clusterId, pathParams.namespace, _params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => getConfigMapDetail(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<ConfigMapReq>) => createConfigMap(_pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: Partial<ConfigMapReq>) => updateConfigMap(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data',
    handler: (_pathParams: Record<string, string>, _params: any, data: ConfigMapDataReq) => manageConfigMapData(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels',
    handler: (_pathParams: Record<string, string>, _params: any, data: ConfigMapLabelsReq) => manageConfigMapLabels(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations',
    handler: (_pathParams: Record<string, string>, _params: any, data: ConfigMapAnnotationsReq) => manageConfigMapAnnotations(_pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (_pathParams: Record<string, string>, _params: any, data: any) => deleteConfigMap(_pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]) => deleteConfigMaps(_pathParams.clusterId, pathParams.namespace, data)
  }
]

function getConfigMapPage(clusterId: string, namespace: string, _params: Partial<ConfigMapQueryReq>) {
  const { name, page = 1, pageSize = 10 } = params || {}
  let filtered = mockConfigMaps.filter(c => c.clusterId === clusterId && c.namespace === namespace)
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getConfigMapDetail(clusterId: string, namespace: string, name: string) {
  return mockConfigMaps.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name) || null
}

function createConfigMap(clusterId: string, namespace: string, data: Partial<ConfigMapReq>) {
  const newCm: ConfigMapResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    data: data.data,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockConfigMaps.push(newCm)
  return newCm.id
}

function updateConfigMap(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapReq>) {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return null
  const updated = { ...mockConfigMaps[index], ...data, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockConfigMaps[index] = updated
  return updated.id
}

function manageConfigMapData(clusterId: string, namespace: string, name: string, data: ConfigMapDataReq) {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  const currentData = mockConfigMaps[index].data || {}
  if (data.operation === 1) mockConfigMaps[index].data = { ...currentData, ...data.data }
  else if (data.operation === 2) {
    const newData = { ...currentData }
    Object.keys(data.data).forEach(key => delete newData[key])
    mockConfigMaps[index].data = newData
  } else if (data.operation === 3) mockConfigMaps[index].data = data.data
  mockConfigMaps[index].updateAt = new Date().toLocaleString()
  return true
}

function manageConfigMapLabels(clusterId: string, namespace: string, name: string, data: ConfigMapLabelsReq) {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  const currentLabels = mockConfigMaps[index].labels || {}
  if (data.operation === 1) mockConfigMaps[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockConfigMaps[index].labels = newLabels
  } else if (data.operation === 3) mockConfigMaps[index].labels = data.labels
  return true
}

function manageConfigMapAnnotations(clusterId: string, namespace: string, name: string, data: ConfigMapAnnotationsReq) {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  const currentAnnotations = mockConfigMaps[index].annotations || {}
  if (data.operation === 1) mockConfigMaps[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockConfigMaps[index].annotations = newAnnotations
  } else if (data.operation === 3) mockConfigMaps[index].annotations = data.annotations
  return true
}

function deleteConfigMap(clusterId: string, namespace: string, name: string) {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockConfigMaps.splice(index, 1)
  return true
}

function deleteConfigMaps(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
    if (index !== -1) mockConfigMaps.splice(index, 1)
  })
  return true
}

const mockConfigMaps: ConfigMapResp[] = [
  {
    id: generateId(),
    name: 'nginx-config',
    namespace: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    data: { 'default.conf': 'server { listen 80; }', 'gzip.conf': 'gzip on;' },
    labels: { app: 'nginx' },
    annotations: {},
    refs: ['deploy-004'],
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'app-env',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    data: { DATABASE_HOST: 'mysql.data.svc.cluster.local', REDIS_HOST: 'redis.middleware.svc.cluster.local', LOG_LEVEL: 'info' },
    labels: { app: 'backend-api', env: 'production' },
    annotations: {},
    refs: ['deploy-005', 'deploy-008'],
    createAt: '2024-02-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-15 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'prometheus-config',
    namespace: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    data: { 'prometheus.yml': 'global: scrape_interval: 15s', 'alerts.yml': 'groups: []' },
    labels: { app: 'prometheus' },
    annotations: {},
    refs: ['deploy-006'],
    createAt: '2024-02-10 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'feature-flags',
    namespace: 'app-frontend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    data: { enable_dark_mode: 'true', enable_beta_features: 'false', max_upload_size: '10MB' },
    labels: { app: 'frontend-app', env: 'production' },
    annotations: { description: '功能开关配置' },
    refs: ['deploy-004'],
    createAt: '2024-03-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'developer'
  }
]
