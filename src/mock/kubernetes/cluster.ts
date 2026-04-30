import type { ClusterResp } from '@/types'

// 模拟集群数据
const mockClusters: ClusterResp[] = [
  {
    id: 'cls-001-prod',
    name: 'prod-cluster',
    apiServer: 'https://api.prod-cluster.local:6443',
    description: '生产环境集群，用于部署生产应用',
    status: 1,
    k8sVersion: 'v1.28.3',
    createBy: 'admin',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'admin',
    updateAt: '2024-03-20 14:22:18'
  },
  {
    id: 'cls-002-staging',
    name: 'staging-cluster',
    apiServer: 'https://api.staging-cluster.local:6443',
    description: '预发环境集群，用于测试部署',
    status: 1,
    k8sVersion: 'v1.28.3',
    createBy: 'admin',
    createAt: '2024-02-10 09:15:00',
    updateBy: 'admin',
    updateAt: '2024-03-18 16:45:30'
  },
  {
    id: 'cls-003-dev',
    name: 'dev-cluster',
    apiServer: 'https://api.dev-cluster.local:6443',
    description: '开发环境集群，用于日常开发测试',
    status: 1,
    k8sVersion: 'v1.27.5',
    createBy: 'developer',
    createAt: '2024-02-25 14:20:10',
    updateBy: 'developer',
    updateAt: '2024-03-15 11:30:45'
  },
  {
    id: 'cls-004-test',
    name: 'test-cluster',
    apiServer: 'https://api.test-cluster.local:6443',
    description: '测试环境集群，用于自动化测试',
    status: 0,
    k8sVersion: 'v1.27.5',
    createBy: 'tester',
    createAt: '2024-03-01 08:00:00',
    updateBy: 'tester',
    updateAt: '2024-03-22 10:15:30'
  },
  {
    id: 'cls-005-monitor',
    name: 'monitor-cluster',
    apiServer: 'https://api.monitor-cluster.local:6443',
    description: '监控集群，部署 Prometheus 和 Grafana',
    status: 1,
    k8sVersion: 'v1.28.3',
    createBy: 'admin',
    createAt: '2024-03-05 13:30:00',
    updateBy: 'admin',
    updateAt: '2024-03-21 09:45:20'
  }
]

// 获取集群分页列表
function getClusterPage(params: any) {
  const { id, name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockClusters]

  // 搜索过滤
  if (id) {
    filtered = filtered.filter(c => c.id.includes(id))
  }
  if (name) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status !== undefined && status !== null) {
    filtered = filtered.filter(c => c.status === status)
  }

  // 分页
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total }
}

// 获取集群详情
function getClusterDetail(id: string) {
  const cluster = mockClusters.find(c => c.id === id)
  return cluster || null
}

// 创建集群
function createCluster(data: Partial<ClusterResp>) {
  const newCluster: ClusterResp = {
    id: `cls-${Date.now()}`,
    name: data.name || '',
    apiServer: data.apiServer || '',
    description: data.description || '',
    status: 1,
    k8sVersion: data.k8sVersion || 'v1.28.3',
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusters.push(newCluster)
  return newCluster
}

// 更新集群
function updateCluster(id: string, data: Partial<ClusterResp>) {
  const index = mockClusters.findIndex(c => c.id === id)
  if (index === -1) return null

  const updated = {
    ...mockClusters[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusters[index] = updated
  return updated
}

// 删除集群
function deleteCluster(id: string) {
  const index = mockClusters.findIndex(c => c.id === id)
  if (index === -1) return false

  mockClusters.splice(index, 1)
  return true
}

// 批量删除集群
function batchDeleteCluster(ids: string[]) {
  ids.forEach(id => {
    const index = mockClusters.findIndex(c => c.id === id)
    if (index !== -1) {
      mockClusters.splice(index, 1)
    }
  })
  return true
}

export default [
  {
    method: 'get',
    url: '/kubernetes/cluster/page',
    handler: (params: any) => getClusterPage(params)
  },
  {
    method: 'get',
    url: '/kubernetes/cluster/:id',
    handler: ({ id }: any) => getClusterDetail(id)
  },
  {
    method: 'post',
    url: '/kubernetes/cluster',
    handler: (data: any) => createCluster(data)
  },
  {
    method: 'put',
    url: '/kubernetes/cluster/:id',
    handler: ({ id, ...data }: any) => updateCluster(id, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/cluster/:id',
    handler: ({ id }: any) => deleteCluster(id)
  },
  {
    method: 'delete',
    url: '/kubernetes/cluster/batch',
    handler: (data: any) => batchDeleteCluster(data.ids)
  }
]
