import type { NamespaceResp } from '@/types'

// 模拟命名空间数据
const mockNamespaces: NamespaceResp[] = [
  {
    id: 'ns-001',
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
    id: 'ns-002',
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
    id: 'ns-003',
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
    id: 'ns-004',
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
    id: 'ns-005',
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
    id: 'ns-006',
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
    id: 'ns-007',
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
    id: 'ns-008',
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
    id: 'ns-009',
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
    id: 'ns-010',
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

// 获取命名空间分页列表
function getNamespacePage(params: any) {
  const { id, name, clusterId, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNamespaces]

  // 搜索过滤
  if (id) {
    filtered = filtered.filter(ns => ns.id.includes(id))
  }
  if (name) {
    filtered = filtered.filter(ns => ns.name.toLowerCase().includes(name.toLowerCase()))
  }
  // if (clusterId) {
  //   filtered = filtered.filter(ns => ns.clusterId === clusterId)
  // }
  if (status) {
    filtered = filtered.filter(ns => ns.status === status)
  }

  // 分页
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total }
}

// 获取命名空间详情
function getNamespaceDetail(clusterId: string, name: string) {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  return ns || null
}

// 创建命名空间
function createNamespace(data: any) {
  const newNs: NamespaceResp = {
    id: `ns-${Date.now()}`,
    name: data.name || '',
    clusterId: data.clusterId || '',
    clusterName: data.clusterName || '',
    status: 'Active',
    phase: 'Active',
    labels: data.labels || {},
    annotations: data.annotations || {},
    createAt: new Date().toLocaleString()
  }
  mockNamespaces.push(newNs)
  return newNs
}

// 更新命名空间
function updateNamespace(clusterId: string, name: string, data: any) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return null

  const updated = {
    ...mockNamespaces[index],
    ...data
  }
  mockNamespaces[index] = updated
  return updated
}

// 删除命名空间
function deleteNamespace(clusterId: string, name: string) {
  const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return false

  mockNamespaces.splice(index, 1)
  return true
}

// 批量删除命名空间
function batchDeleteNamespace(data: any) {
  const { clusterId, names } = data
  names.forEach((name: string) => {
    const index = mockNamespaces.findIndex(n => n.clusterId === clusterId && n.name === name)
    if (index !== -1) {
      mockNamespaces.splice(index, 1)
    }
  })
  return true
}

export default [
  {
    method: 'get',
    url: '/kubernetes/namespace/page',
    handler: (params: any) => getNamespacePage(params)
  },
  {
    method: 'get',
    url: '/kubernetes/namespace/:clusterId/:name',
    handler: ({ clusterId, name }: any) => getNamespaceDetail(clusterId, name)
  },
  {
    method: 'post',
    url: '/kubernetes/namespace',
    handler: (data: any) => createNamespace(data)
  },
  {
    method: 'put',
    url: '/kubernetes/namespace/:clusterId/:name',
    handler: ({ clusterId, name, ...data }: any) => updateNamespace(clusterId, name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/namespace/:clusterId/:name',
    handler: ({ clusterId, name }: any) => deleteNamespace(clusterId, name)
  },
  {
    method: 'delete',
    url: '/kubernetes/namespace/batch',
    handler: (data: any) => batchDeleteNamespace(data)
  }
]
