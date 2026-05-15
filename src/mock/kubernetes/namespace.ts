/**
 * Kubernetes 命名空间管理 Mock API
 * @module mock/kubernetes/namespace
 */
import { generateId } from '@/mock/utils'
import type { NamespaceResp, NamespaceQueryReq, NamespaceReq, NamespaceLabelsReq, NamespaceAnnotationsReq } from '@/types'

/**
 * 命名空间路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces - 获取命名空间分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:name - 获取命名空间详情
 * - POST /kubernetes/clusters/:clusterId/namespaces - 创建命名空间
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:name - 更新命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:name - 删除命名空间
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/batch - 批量删除命名空间
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (pathParams: Record<string, string>, params: Partial<NamespaceQueryReq>) => getNamespacePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getNamespaceDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<NamespaceReq>) => createNamespace(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<NamespaceReq>) => updateNamespace(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: NamespaceLabelsReq) => manageNamespaceLabels(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: NamespaceAnnotationsReq) => manageNamespaceAnnotations(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deleteNamespace(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deleteNamespaces(pathParams.clusterId, data)
  }
]

/**
 * 获取命名空间分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getNamespacePage(clusterId: string, params: Partial<NamespaceQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNamespaces]

  // 集群过滤
  if (clusterId) {
    filtered = filtered.filter(ns => ns.clusterId === clusterId)
  }
  // 名称过滤
  if (name) {
    filtered = filtered.filter(ns => ns.name.toLowerCase().includes(name.toLowerCase()))
  }
  // 状态过滤
  if (status) {
    filtered = filtered.filter(ns => ns.status === status)
  }

  // 分页
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 获取命名空间详情
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
function getNamespaceDetail(clusterId: string, name: string) {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  return ns || null
}

/**
 * 创建命名空间
 * @param clusterId - 集群ID
 * @param data - 创建参数
 * @returns 创建的命名空间ID
 */
function createNamespace(clusterId: string, data: Partial<NamespaceReq>) {
  const newNs: NamespaceResp = {
    id: generateId(),
    name: data.name || '',
    clusterId: clusterId,
    clusterName: data.clusterName || '',
    status: 'Active',
    phase: 'Active',
    labels: data.labels || {},
    annotations: data.annotations || {},
    createAt: new Date().toLocaleString()
  }
  mockNamespaces.push(newNs)
  return newNs.id
}

/**
 * 更新命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 更新参数
 * @returns 更新后的命名空间ID
 */
function updateNamespace(clusterId: string, name: string, data: Partial<NamespaceReq>) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return null

  const updated = {
    ...mockNamespaces[index],
    ...data
  }
  mockNamespaces[index] = updated
  return updated.id
}

/**
 * 更新命名空间标签
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 标签数据
 * @returns 是否更新成功
 */
function manageNamespaceLabels(clusterId: string, name: string, data: NamespaceLabelsReq) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return false

  const currentLabels = mockNamespaces[index].labels || {}

  if (data.operation === 1) {
    // 新增
    mockNamespaces[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    // 移除
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockNamespaces[index].labels = newLabels
  } else if (data.operation === 3) {
    // 全量替换
    mockNamespaces[index].labels = data.labels
  }

  return true
}

/**
 * 更新命名空间注解
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 注解数据
 * @returns 是否更新成功
 */
function manageNamespaceAnnotations(clusterId: string, name: string, data: NamespaceAnnotationsReq) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return false

  const currentAnnotations = mockNamespaces[index].annotations || {}

  if (data.operation === 1) {
    // 新增
    mockNamespaces[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    // 移除
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockNamespaces[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    // 全量替换
    mockNamespaces[index].annotations = data.annotations
  }

  return true
}

/**
 * 删除命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 是否删除成功
 */
function deleteNamespace(clusterId: string, name: string) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return false

  mockNamespaces.splice(index, 1)
  return true
}

/**
 * 批量删除命名空间
 * @param clusterId - 集群ID
 * @param names - 命名空间名称数组
 * @returns 是否删除成功
 */
function deleteNamespaces(clusterId: string, names: string[]) {
  names.forEach((name: string) => {
    const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
    if (index !== -1) {
      mockNamespaces.splice(index, 1)
    }
  })
  return true
}

/**
 * 模拟命名空间数据
 */
const mockNamespaces: NamespaceResp[] = [
  {
    id: generateId(),
    name: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-01-15 10:30:25',
    labels: {},
    annotations: {},
    deletable: false
  },
  {
    id: generateId(),
    name: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-01-15 10:30:30',
    labels: {
      'kubernetes.io/metadata.name': 'kube-system'
    },
    annotations: {},
    deletable: false
  },
  {
    id: generateId(),
    name: 'kube-public',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-01-15 10:30:35',
    labels: {},
    annotations: {},
    deletable: false
  },
  {
    id: generateId(),
    name: 'kube-node-lease',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-01-15 10:30:40',
    labels: {},
    annotations: {},
    deletable: false
  },
  {
    id: generateId(),
    name: 'app-frontend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-02-01 08:00:00',
    description: '前端应用命名空间',
    labels: {
      env: 'production',
      app: 'frontend'
    },
    annotations: {}
  },
  {
    id: generateId(),
    name: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-02-01 08:05:00',
    description: '后端应用命名空间',
    labels: {
      env: 'production',
      app: 'backend'
    },
    annotations: {}
  },
  {
    id: generateId(),
    name: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-02-10 14:20:00',
    description: '监控组件命名空间',
    labels: {
      env: 'production'
    },
    annotations: {}
  },
  {
    id: generateId(),
    name: 'logging',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Terminating',
    phase: 'Terminating',
    createAt: '2024-02-15 09:00:00',
    description: '日志收集命名空间',
    labels: {},
    annotations: {}
  },
  {
    id: generateId(),
    name: 'staging-app',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-02-15 10:00:00',
    description: '预发布环境命名空间',
    labels: {
      env: 'staging'
    },
    annotations: {}
  },
  {
    id: generateId(),
    name: 'dev-test',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Active',
    phase: 'Active',
    createAt: '2024-03-01 09:00:00',
    description: '开发测试环境',
    labels: {
      env: 'development'
    },
    annotations: {}
  }
]
