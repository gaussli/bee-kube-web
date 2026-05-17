/**
 * Kubernetes 命名空间管理 Mock API
 * @module mock/kubernetes/namespace
 */
import type { PageResp } from '@/types/common'
import type { NamespaceQueryReq, NamespaceReq, NamespaceResp, NamespaceLabelsReq, NamespaceAnnotationsReq, NamespaceQuotaReq, NamespaceImportReq } from '@/types/kubernetes/namespace'
import { generateId } from '@/mock/utils'

/**
 * 命名空间路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces - 获取命名空间分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:name - 获取命名空间详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces - 创建命名空间
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:name - 更新命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:name - 删除命名空间
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/batch - 批量删除命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/export - 导出命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/import - 导入命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/quota - 创建配额
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:name/quota - 更新配额
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:name/quota - 删除配额
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (pathParams: Record<string, string>, params: Partial<NamespaceQueryReq>): PageResp<NamespaceResp> => getNamespacePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>): NamespaceResp => getNamespaceDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getNamespaceYaml(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceReq>): void => createNamespace(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceReq>): void => updateNamespace(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceLabelsReq>): void => manageNamespaceLabels(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceAnnotationsReq>): void => manageNamespaceAnnotations(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>): void => deleteNamespace(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteNamespaces(pathParams.clusterId, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/export',
    handler: (pathParams: Record<string, string>, params: Partial<NamespaceQueryReq>): void => exportNamespaces(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/import',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceImportReq>): void => importNamespaces(pathParams.clusterId, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceQuotaReq>): void => createNamespaceQuota(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceQuotaReq>): void => updateNamespaceQuota(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>): void => deleteNamespaceQuota(pathParams.clusterId, pathParams.name)
  }
]

/**
 * 获取命名空间分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getNamespacePage(clusterId: string, params: Partial<NamespaceQueryReq>): PageResp<NamespaceResp> {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNamespaces]

  if (clusterId) {
    filtered = filtered.filter(ns => ns.clusterId === clusterId)
  }
  if (name) {
    filtered = filtered.filter(ns => ns.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    filtered = filtered.filter(ns => ns.status === status)
  }

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
function getNamespaceDetail(clusterId: string, name: string): NamespaceResp {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Detail] can not find namespace:', clusterId, name)
  }
  return ns!
}

/**
 * 查看命名空间 YAML
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML 配置
 */
function getNamespaceYaml(clusterId: string, name: string): string {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Yaml] can not find namespace:', clusterId, name)
    return ''
  }

  const labels = Object.entries(ns.labels || {})
    .map(([key, value]) => `    ${key}: "${value}"`)
    .join('\n')

  const annotations = Object.entries(ns.annotations || {})
    .map(([key, value]) => `    ${key}: "${value}"`)
    .join('\n')

  const yaml = `apiVersion: v1
kind: Namespace
metadata:
  name: ${ns.name}
  ${ns.description ? `annotations:\n${annotations}` : ''}
  ${Object.keys(ns.labels || {}).length > 0 ? `labels:\n${labels}` : ''}
  creationTimestamp: "${ns.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
spec:
  finalizers:
    - kubernetes
status:
  phase: ${ns.status || 'Active'}`

  return yaml
}

/**
 * 创建命名空间
 * @param clusterId - 集群ID
 * @param data - 创建参数
 */
function createNamespace(clusterId: string, data: Partial<NamespaceReq>): void {
  const created: NamespaceResp = {
    id: data.id || generateId(),
    name: data.name || '',
    description: data.description,
    clusterId: clusterId,
    clusterName: data.clusterName || '',
    status: 'Active',
    labels: data.labels || {},
    annotations: data.annotations || {},
    resourceQuota: data.resourceQuota || {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: data.limitRange || {},
    deletable: true,
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockNamespaces.push(created)
}

/**
 * 更新命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 更新参数
 */
function updateNamespace(clusterId: string, name: string, data: Partial<NamespaceReq>): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Update Namespace] can not find namespace:', clusterId, name)
    return
  }
  mockNamespaces[index] = {
    ...mockNamespaces[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 更新命名空间标签
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 标签数据
 */
function manageNamespaceLabels(clusterId: string, name: string, data: Partial<NamespaceLabelsReq>): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Manage Namespace Labels] can not find namespace:', clusterId, name)
    return
  }

  const currentLabels = mockNamespaces[index].labels || {}

  if (data.operation === 1) {
    mockNamespaces[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels || {}).forEach(key => delete newLabels[key])
    mockNamespaces[index].labels = newLabels
  } else if (data.operation === 3) {
    mockNamespaces[index].labels = data.labels || {}
  }

  mockNamespaces[index].updateBy = 'admin'
  mockNamespaces[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新命名空间注解
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 注解数据
 */
function manageNamespaceAnnotations(clusterId: string, name: string, data: Partial<NamespaceAnnotationsReq>): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Manage Namespace Annotations] can not find namespace:', clusterId, name)
    return
  }

  const currentAnnotations = mockNamespaces[index].annotations || {}

  if (data.operation === 1) {
    mockNamespaces[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations || {}).forEach(key => delete newAnnotations[key])
    mockNamespaces[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    mockNamespaces[index].annotations = data.annotations || {}
  }

  mockNamespaces[index].updateBy = 'admin'
  mockNamespaces[index].updateAt = new Date().toLocaleString()
}

/**
 * 删除命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
function deleteNamespace(clusterId: string, name: string): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Delete Namespace] can not find namespace:', clusterId, name)
    return
  }
  mockNamespaces.splice(index, 1)
}

/**
 * 批量删除命名空间
 * @param clusterId - 集群ID
 * @param names - 命名空间名称数组
 */
function deleteNamespaces(clusterId: string, names: string[]): void {
  names.forEach((name: string) => {
    const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
    if (index === -1) {
      console.error('[Delete Namespaces] can not find namespace:', name)
    } else {
      mockNamespaces.splice(index, 1)
    }
  })
}

/**
 * 导出命名空间 CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportNamespaces(clusterId: string, params: Partial<NamespaceQueryReq>): void {
  const { name, status } = params || {}

  let namespaces = mockNamespaces.filter(ns => ns.clusterId === clusterId)

  if (name) {
    namespaces = namespaces.filter(ns => ns.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    namespaces = namespaces.filter(ns => ns.status === status)
  }

  const headers = ['名称', '集群名称', '状态', '标签', '描述', '资源配额', '限制范围', '创建时间', '创建人', '更新时间', '更新人']
  const rows = namespaces.map(ns => [
    ns.name,
    ns.clusterName,
    ns.status,
    Object.entries(ns.labels || {})
      .map(([k, v]) => `${k}=${v}`)
      .join(';'),
    ns.description || '',
    ns.resourceQuota ? JSON.stringify(ns.resourceQuota) : '',
    ns.limitRange ? JSON.stringify(ns.limitRange) : '',
    ns.createAt,
    ns.createBy,
    ns.updateAt,
    ns.updateBy
  ])

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
  console.log('[Export Namespaces CSV]', csvContent)
}

/**
 * 导入命名空间
 * @param clusterId - 集群ID
 * @param data - 导入配置
 */
function importNamespaces(clusterId: string, data: Partial<NamespaceImportReq>): void {
  if (!data.items || data.items.length === 0) {
    console.error('[Import Namespaces] no items to import')
    return
  }

  const created: NamespaceResp[] = []
  for (const item of data.items) {
    const exists = mockNamespaces.find(ns => ns.clusterId === clusterId && ns.name === item.name)
    if (exists) {
      console.log('[Import Namespaces] namespace already exists:', item.name)
      continue
    }

    const ns: NamespaceResp = {
      id: generateId(),
      name: item.name,
      clusterId: clusterId,
      clusterName: 'prod-cluster',
      status: 'Active',
      labels: item.labels || {},
      annotations: item.annotations || {},
      description: item.description || '',
      resourceQuota: item.resourceQuota,
      limitRange: item.limitRange,
      createBy: 'admin',
      createAt: new Date().toLocaleString(),
      updateBy: 'admin',
      updateAt: new Date().toLocaleString()
    }
    mockNamespaces.push(ns)
    created.push(ns)
  }

  console.log('[Import Namespaces] created:', created.length, 'namespaces')
}

/**
 * 创建命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function createNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Create Namespace Quota] can not find namespace:', clusterId, name)
    return
  }
  mockNamespaces[index].resourceQuota = data.resouceQuota || mockNamespaces[index].resourceQuota
  mockNamespaces[index].limitRange = data.limitRange || mockNamespaces[index].limitRange
  mockNamespaces[index].updateBy = 'admin'
  mockNamespaces[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function updateNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Update Namespace Quota] can not find namespace:', clusterId, name)
    return
  }
  mockNamespaces[index].resourceQuota = data.resouceQuota || mockNamespaces[index].resourceQuota
  mockNamespaces[index].limitRange = data.limitRange || mockNamespaces[index].limitRange
  mockNamespaces[index].updateBy = 'admin'
  mockNamespaces[index].updateAt = new Date().toLocaleString()
}

/**
 * 删除命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
function deleteNamespaceQuota(clusterId: string, name: string): void {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) {
    console.error('[Delete Namespace Quota] can not find namespace:', clusterId, name)
    return
  }
  mockNamespaces[index].resourceQuota = {
    requestsCpu: 0,
    requestsMemory: '0Gi',
    limitsCpu: 0,
    limitsMemory: '0Gi',
    persistentvolumeclaims: 0,
    servicesLoadbalancers: 0,
    countDeploymentsApps: 0,
    countPods: 0
  }
  mockNamespaces[index].limitRange = {}
  mockNamespaces[index].updateBy = 'admin'
  mockNamespaces[index].updateAt = new Date().toLocaleString()
}

/**
 * 模拟命名空间数据
 * @remarks 包含系统命名空间、应用命名空间、监控命名空间等
 */
const mockNamespaces: NamespaceResp[] = [
  {
    id: generateId(),
    name: 'default',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    labels: {},
    annotations: {},
    resourceQuota: {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:25'
  },
  {
    id: generateId(),
    name: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    labels: {
      'kubernetes.io/metadata.name': 'kube-system'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:30:30',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:30'
  },
  {
    id: generateId(),
    name: 'kube-public',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    labels: {},
    annotations: {},
    resourceQuota: {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:30:35',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:35'
  },
  {
    id: generateId(),
    name: 'kube-node-lease',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Active',
    labels: {},
    annotations: {},
    resourceQuota: {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:30:40',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:40'
  },
  {
    id: generateId(),
    name: 'app-frontend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    description: '前端应用命名空间',
    status: 'Active',
    labels: {
      env: 'production',
      app: 'frontend'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 10,
      requestsMemory: '20Gi',
      limitsCpu: 20,
      limitsMemory: '40Gi',
      persistentvolumeclaims: 10,
      servicesLoadbalancers: 5,
      countDeploymentsApps: 20,
      countPods: 50
    },
    limitRange: {
      container: {
        defaultRequestCpu: 100,
        defaultRequestMemory: '256Mi',
        defaultCpu: 500,
        defaultMemory: '512Mi'
      }
    },
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-01 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 14:22:18'
  },
  {
    id: generateId(),
    name: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    description: '后端应用命名空间',
    status: 'Active',
    labels: {
      env: 'production',
      app: 'backend'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 20,
      requestsMemory: '40Gi',
      limitsCpu: 40,
      limitsMemory: '80Gi',
      persistentvolumeclaims: 20,
      servicesLoadbalancers: 10,
      countDeploymentsApps: 30,
      countPods: 100
    },
    limitRange: {
      container: {
        defaultRequestCpu: 200,
        defaultRequestMemory: '512Mi',
        defaultCpu: 1000,
        defaultMemory: '1Gi'
      }
    },
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-01 08:05:00',
    updateBy: 'admin',
    updateAt: '2024-03-20 09:15:30'
  },
  {
    id: generateId(),
    name: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    description: '监控组件命名空间',
    status: 'Active',
    labels: {
      env: 'production'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 8,
      requestsMemory: '16Gi',
      limitsCpu: 16,
      limitsMemory: '32Gi',
      persistentvolumeclaims: 5,
      servicesLoadbalancers: 2,
      countDeploymentsApps: 10,
      countPods: 30
    },
    limitRange: {},
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-10 14:20:00',
    updateBy: 'admin',
    updateAt: '2024-02-10 14:20:00'
  },
  {
    id: generateId(),
    name: 'logging',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    description: '日志收集命名空间',
    status: 'Terminating',
    labels: {},
    annotations: {},
    resourceQuota: {
      requestsCpu: 0,
      requestsMemory: '0Gi',
      limitsCpu: 0,
      limitsMemory: '0Gi',
      persistentvolumeclaims: 0,
      servicesLoadbalancers: 0,
      countDeploymentsApps: 0,
      countPods: 0
    },
    limitRange: {},
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-15 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-01 16:30:00'
  },
  {
    id: generateId(),
    name: 'staging-app',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    description: '预发布环境命名空间',
    status: 'Active',
    labels: {
      env: 'staging'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 5,
      requestsMemory: '10Gi',
      limitsCpu: 10,
      limitsMemory: '20Gi',
      persistentvolumeclaims: 5,
      servicesLoadbalancers: 3,
      countDeploymentsApps: 10,
      countPods: 30
    },
    limitRange: {
      container: {
        defaultRequestCpu: 100,
        defaultRequestMemory: '256Mi',
        defaultCpu: 500,
        defaultMemory: '512Mi'
      }
    },
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-15 10:00:00'
  },
  {
    id: generateId(),
    name: 'dev-test',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    description: '开发测试环境',
    status: 'Active',
    labels: {
      env: 'development'
    },
    annotations: {},
    resourceQuota: {
      requestsCpu: 2,
      requestsMemory: '4Gi',
      limitsCpu: 4,
      limitsMemory: '8Gi',
      persistentvolumeclaims: 5,
      servicesLoadbalancers: 2,
      countDeploymentsApps: 10,
      countPods: 20
    },
    limitRange: {
      container: {
        defaultRequestCpu: 50,
        defaultRequestMemory: '128Mi',
        defaultCpu: 200,
        defaultMemory: '256Mi'
      }
    },
    deletable: true,
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-01 09:00:00'
  }
]
