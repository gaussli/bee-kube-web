/**
 * Kubernetes ConfigMap 管理 Mock API
 * @module mock/kubernetes/config/configmap
 */
import type { PageResp } from '@/types/common'
import type { ConfigMapQueryReq, ConfigMapResp, ConfigMapReq, ConfigMapDataReq, ConfigMapLabelsReq, ConfigMapAnnotationsReq } from '@/types/kubernetes/config/configmap'
import { generateId } from '@/mock/utils'

/**
 * ConfigMap 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps - 获取 ConfigMap 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 获取 ConfigMap 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps - 创建 ConfigMap
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 更新 ConfigMap
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data - 更新数据
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 删除 ConfigMap
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps',
    handler: (pathParams: Record<string, string>, params: Partial<ConfigMapQueryReq>): PageResp<ConfigMapResp> => getConfigMapPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (pathParams: Record<string, string>): ConfigMapResp => getConfigMapDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps',
    handler: (pathParams: Record<string, string>, data: Partial<ConfigMapReq>): void => createConfigMap(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (pathParams: Record<string, string>, data: Partial<ConfigMapReq>): void => updateConfigMap(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data',
    handler: (pathParams: Record<string, string>, data: Partial<ConfigMapDataReq>): void => manageConfigMapData(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<ConfigMapLabelsReq>): void => manageConfigMapLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<ConfigMapAnnotationsReq>): void => manageConfigMapAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: (pathParams: Record<string, string>): void => deleteConfigMap(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch',
    handler: (_pathParams: Record<string, string>, _params: any, data: string[]): void => deleteConfigMaps(_pathParams.clusterId, _pathParams.namespace, data)
  }
]

/**
 * 获取 ConfigMap 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getConfigMapPage(clusterId: string, namespace: string, params: Partial<ConfigMapQueryReq>): PageResp<ConfigMapResp> {
  const { name, page = 1, pageSize = 10 } = params || {}
  let filtered = mockConfigMaps.filter(c => c.clusterId === clusterId && c.namespace === namespace)
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

/**
 * 获取 ConfigMap 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap 详情
 */
function getConfigMapDetail(clusterId: string, namespace: string, name: string): ConfigMapResp {
  return mockConfigMaps.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name) || (null as any)
}

/**
 * 创建 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createConfigMap(clusterId: string, namespace: string, data: Partial<ConfigMapReq>): void {
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
}

/**
 * 更新 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 更新数据
 */
function updateConfigMap(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapReq>): void {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const updated = {
    ...mockConfigMaps[index],
    ...data,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockConfigMaps[index] = updated
}

/**
 * 更新 ConfigMap 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 数据参数
 */
function manageConfigMapData(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapDataReq>): void {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const currentData = mockConfigMaps[index].data || {}
  if (data.operation === 1) mockConfigMaps[index].data = { ...currentData, ...data.data }
  else if (data.operation === 2) {
    const newData = { ...currentData }
    Object.keys(data.data || {}).forEach(key => delete newData[key])
    mockConfigMaps[index].data = newData
  } else if (data.operation === 3) mockConfigMaps[index].data = data.data
  mockConfigMaps[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新 ConfigMap 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 标签数据
 */
function manageConfigMapLabels(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapLabelsReq>): void {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const currentLabels = mockConfigMaps[index].labels || {}
  if (data.operation === 1) mockConfigMaps[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels || {}).forEach(key => delete newLabels[key])
    mockConfigMaps[index].labels = newLabels
  } else if (data.operation === 3) mockConfigMaps[index].labels = data.labels
}

/**
 * 更新 ConfigMap 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 注解数据
 */
function manageConfigMapAnnotations(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapAnnotationsReq>): void {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  const currentAnnotations = mockConfigMaps[index].annotations || {}
  if (data.operation === 1) mockConfigMaps[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations || {}).forEach(key => delete newAnnotations[key])
    mockConfigMaps[index].annotations = newAnnotations
  } else if (data.operation === 3) mockConfigMaps[index].annotations = data.annotations
}

/**
 * 删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 */
function deleteConfigMap(clusterId: string, namespace: string, name: string): void {
  const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return
  mockConfigMaps.splice(index, 1)
}

/**
 * 批量删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - ConfigMap 名称数组
 */
function deleteConfigMaps(clusterId: string, namespace: string, names: string[]): void {
  names.forEach(name => {
    const index = mockConfigMaps.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
    if (index !== -1) mockConfigMaps.splice(index, 1)
  })
}

/**
 * 模拟 ConfigMap 数据
 */
const mockConfigMaps: ConfigMapResp[] = [
  {
    id: generateId(),
    name: 'nginx-config',
    namespace: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    data: { 'default.conf': 'server { listen 80; }', 'gzip.conf': 'gzip on;' },
    labels: { app: 'nginx' },
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
