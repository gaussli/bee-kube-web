import type { ClusterResp } from '@/types'

// 生成32位随机ID（数字+小写字母）
function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// 模拟集群数据
const mockClusters: ClusterResp[] = [
  {
    id: generateId(),
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
    id: generateId(),
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
    id: generateId(),
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
    id: generateId(),
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
    id: generateId(),
    name: 'monitor-cluster',
    apiServer: 'https://api.monitor-cluster.local:6443',
    description: '监控集群，部署 Prometheus 和 Grafana',
    status: 1,
    k8sVersion: 'v1.28.3',
    createBy: 'admin',
    createAt: '2024-03-05 13:30:00',
    updateBy: 'admin',
    updateAt: '2024-03-21 09:45:20'
  },
  {
    id: generateId(),
    name: 'prod-us-east-cluster',
    apiServer: 'https://api.us-east.prod.local:6443',
    description: '美东生产集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'admin',
    createAt: '2024-01-20 11:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-19 15:30:00'
  },
  {
    id: generateId(),
    name: 'prod-us-west-cluster',
    apiServer: 'https://api.us-west.prod.local:6443',
    description: '美西生产集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'admin',
    createAt: '2024-01-22 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-18 14:00:00'
  },
  {
    id: generateId(),
    name: 'prod-eu-central-cluster',
    apiServer: 'https://api.eu-central.prod.local:6443',
    description: '欧洲中部生产集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'admin',
    createAt: '2024-02-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-17 16:00:00'
  },
  {
    id: generateId(),
    name: 'prod-ap-south-cluster',
    apiServer: 'https://api.ap-south.prod.local:6443',
    description: '亚太南部生产集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'admin',
    createAt: '2024-02-05 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-16 12:00:00'
  },
  {
    id: generateId(),
    name: 'staging-us-east-cluster',
    apiServer: 'https://api.us-east.staging.local:6443',
    description: '美东预发集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'developer',
    createAt: '2024-02-08 11:00:00',
    updateBy: 'developer',
    updateAt: '2024-03-15 10:00:00'
  },
  {
    id: generateId(),
    name: 'staging-eu-west-cluster',
    apiServer: 'https://api.eu-west.staging.local:6443',
    description: '欧洲西部预发集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'developer',
    createAt: '2024-02-12 14:00:00',
    updateBy: 'developer',
    updateAt: '2024-03-14 09:00:00'
  },
  {
    id: generateId(),
    name: 'dev-fe-cluster',
    apiServer: 'https://api.fe.dev.local:6443',
    description: '前端开发集群',
    status: 1,
    k8sVersion: 'v1.27.5',
    createBy: 'developer',
    createAt: '2024-02-15 09:00:00',
    updateBy: 'developer',
    updateAt: '2024-03-13 11:00:00'
  },
  {
    id: generateId(),
    name: 'dev-be-cluster',
    apiServer: 'https://api.be.dev.local:6443',
    description: '后端开发集群',
    status: 1,
    k8sVersion: 'v1.27.5',
    createBy: 'developer',
    createAt: '2024-02-16 10:00:00',
    updateBy: 'developer',
    updateAt: '2024-03-12 14:00:00'
  },
  {
    id: generateId(),
    name: 'dev-ops-cluster',
    apiServer: 'https://api.ops.dev.local:6443',
    description: '运维开发集群',
    status: 1,
    k8sVersion: 'v1.27.4',
    createBy: 'ops',
    createAt: '2024-02-17 08:00:00',
    updateBy: 'ops',
    updateAt: '2024-03-11 15:00:00'
  },
  {
    id: generateId(),
    name: 'ci-cd-cluster',
    apiServer: 'https://api.cicd.local:6443',
    description: '持续集成部署集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'devops',
    createAt: '2024-02-18 12:00:00',
    updateBy: 'devops',
    updateAt: '2024-03-10 16:00:00'
  },
  {
    id: generateId(),
    name: 'ml-training-cluster',
    apiServer: 'https://api.ml.training.local:6443',
    description: '机器学习训练集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'mlengineer',
    createAt: '2024-02-19 13:00:00',
    updateBy: 'mlengineer',
    updateAt: '2024-03-09 10:00:00'
  },
  {
    id: generateId(),
    name: 'data-lake-cluster',
    apiServer: 'https://api.datalake.local:6443',
    description: '数据湖处理集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'dataeng',
    createAt: '2024-02-20 14:00:00',
    updateBy: 'dataeng',
    updateAt: '2024-03-08 11:00:00'
  },
  {
    id: generateId(),
    name: 'security-scan-cluster',
    apiServer: 'https://api.security.scan.local:6443',
    description: '安全扫描集群',
    status: 1,
    k8sVersion: 'v1.27.6',
    createBy: 'security',
    createAt: '2024-02-21 15:00:00',
    updateBy: 'security',
    updateAt: '2024-03-07 09:00:00'
  },
  {
    id: generateId(),
    name: 'perf-test-cluster',
    apiServer: 'https://api.perf.test.local:6443',
    description: '性能测试集群',
    status: 0,
    k8sVersion: 'v1.27.6',
    createBy: 'qa',
    createAt: '2024-02-22 16:00:00',
    updateBy: 'qa',
    updateAt: '2024-03-06 14:00:00'
  },
  {
    id: generateId(),
    name: 'integration-test-cluster',
    apiServer: 'https://api.integration.test.local:6443',
    description: '集成测试集群',
    status: 1,
    k8sVersion: 'v1.27.5',
    createBy: 'qa',
    createAt: '2024-02-23 17:00:00',
    updateBy: 'qa',
    updateAt: '2024-03-05 13:00:00'
  },
  {
    id: generateId(),
    name: 'uat-cluster',
    apiServer: 'https://api.uat.local:6443',
    description: '用户验收测试集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'qa',
    createAt: '2024-02-24 08:00:00',
    updateBy: 'qa',
    updateAt: '2024-03-04 12:00:00'
  },
  {
    id: generateId(),
    name: 'dr-backup-cluster',
    apiServer: 'https://api.dr.backup.local:6443',
    description: '灾难恢复备份集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'admin',
    createAt: '2024-02-26 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-03 11:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-01',
    apiServer: 'https://api.edge01.local:6443',
    description: '边缘节点集群01',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-27 10:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-03-02 10:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-02',
    apiServer: 'https://api.edge02.local:6443',
    description: '边缘节点集群02',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 11:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-03-01 09:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-03',
    apiServer: 'https://api.edge03.local:6443',
    description: '边缘节点集群03',
    status: 0,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 12:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-29 08:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-04',
    apiServer: 'https://api.edge04.local:6443',
    description: '边缘节点集群04',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 13:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 14:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-05',
    apiServer: 'https://api.edge05.local:6443',
    description: '边缘节点集群05',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 14:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 15:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-06',
    apiServer: 'https://api.edge06.local:6443',
    description: '边缘节点集群06',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 15:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 16:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-07',
    apiServer: 'https://api.edge07.local:6443',
    description: '边缘节点集群07',
    status: 0,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 16:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 17:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-08',
    apiServer: 'https://api.edge08.local:6443',
    description: '边缘节点集群08',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 17:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 18:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-09',
    apiServer: 'https://api.edge09.local:6443',
    description: '边缘节点集群09',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 18:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 19:00:00'
  },
  {
    id: generateId(),
    name: 'edge-node-cluster-10',
    apiServer: 'https://api.edge10.local:6443',
    description: '边缘节点集群10',
    status: 1,
    k8sVersion: 'v1.27.3',
    createBy: 'edgeops',
    createAt: '2024-02-28 19:00:00',
    updateBy: 'edgeops',
    updateAt: '2024-02-28 20:00:00'
  },
  {
    id: generateId(),
    name: 'logging-cluster',
    apiServer: 'https://api.logging.local:6443',
    description: '日志收集集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'admin',
    createAt: '2024-02-28 20:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-28 21:00:00'
  },
  {
    id: generateId(),
    name: 'tracing-cluster',
    apiServer: 'https://api.tracing.local:6443',
    description: '链路追踪集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'admin',
    createAt: '2024-02-28 21:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-28 22:00:00'
  },
  {
    id: generateId(),
    name: 'metrics-cluster',
    apiServer: 'https://api.metrics.local:6443',
    description: '指标监控集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'admin',
    createAt: '2024-02-28 22:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-28 23:00:00'
  },
  {
    id: generateId(),
    name: 'cache-cluster',
    apiServer: 'https://api.cache.local:6443',
    description: '缓存服务集群',
    status: 1,
    k8sVersion: 'v1.27.8',
    createBy: 'backend',
    createAt: '2024-02-28 23:00:00',
    updateBy: 'backend',
    updateAt: '2024-03-01 00:00:00'
  },
  {
    id: generateId(),
    name: 'queue-cluster',
    apiServer: 'https://api.queue.local:6443',
    description: '消息队列集群',
    status: 1,
    k8sVersion: 'v1.27.8',
    createBy: 'backend',
    createAt: '2024-03-01 00:00:00',
    updateBy: 'backend',
    updateAt: '2024-03-01 01:00:00'
  },
  {
    id: generateId(),
    name: 'db-primary-cluster',
    apiServer: 'https://api.db.primary.local:6443',
    description: '数据库主集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'dba',
    createAt: '2024-03-01 01:00:00',
    updateBy: 'dba',
    updateAt: '2024-03-01 02:00:00'
  },
  {
    id: generateId(),
    name: 'db-replica-cluster',
    apiServer: 'https://api.db.replica.local:6443',
    description: '数据库副本集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'dba',
    createAt: '2024-03-01 02:00:00',
    updateBy: 'dba',
    updateAt: '2024-03-01 03:00:00'
  },
  {
    id: generateId(),
    name: 'search-cluster',
    apiServer: 'https://api.search.local:6443',
    description: '搜索引擎集群',
    status: 1,
    k8sVersion: 'v1.27.9',
    createBy: 'searcheng',
    createAt: '2024-03-01 03:00:00',
    updateBy: 'searcheng',
    updateAt: '2024-03-01 04:00:00'
  },
  {
    id: generateId(),
    name: 'cdn-origin-cluster',
    apiServer: 'https://api.cdn.origin.local:6443',
    description: 'CDN源站集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'cdnops',
    createAt: '2024-03-01 04:00:00',
    updateBy: 'cdnops',
    updateAt: '2024-03-01 05:00:00'
  },
  {
    id: generateId(),
    name: 'gateway-cluster',
    apiServer: 'https://api.gateway.local:6443',
    description: 'API网关集群',
    status: 1,
    k8sVersion: 'v1.28.1',
    createBy: 'gateway',
    createAt: '2024-03-01 05:00:00',
    updateBy: 'gateway',
    updateAt: '2024-03-01 06:00:00'
  },
  {
    id: generateId(),
    name: 'auth-cluster',
    apiServer: 'https://api.auth.local:6443',
    description: '认证授权集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'security',
    createAt: '2024-03-01 06:00:00',
    updateBy: 'security',
    updateAt: '2024-03-01 07:00:00'
  },
  {
    id: generateId(),
    name: 'notification-cluster',
    apiServer: 'https://api.notification.local:6443',
    description: '通知服务集群',
    status: 1,
    k8sVersion: 'v1.27.7',
    createBy: 'backend',
    createAt: '2024-03-01 07:00:00',
    updateBy: 'backend',
    updateAt: '2024-03-01 08:00:00'
  },
  {
    id: generateId(),
    name: 'email-cluster',
    apiServer: 'https://api.email.local:6443',
    description: '邮件服务集群',
    status: 1,
    k8sVersion: 'v1.27.7',
    createBy: 'backend',
    createAt: '2024-03-01 08:00:00',
    updateBy: 'backend',
    updateAt: '2024-03-01 09:00:00'
  },
  {
    id: generateId(),
    name: 'sms-cluster',
    apiServer: 'https://api.sms.local:6443',
    description: '短信服务集群',
    status: 1,
    k8sVersion: 'v1.27.7',
    createBy: 'backend',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'backend',
    updateAt: '2024-03-01 10:00:00'
  },
  {
    id: generateId(),
    name: 'storage-cluster',
    apiServer: 'https://api.storage.local:6443',
    description: '对象存储集群',
    status: 1,
    k8sVersion: 'v1.28.0',
    createBy: 'storage',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'storage',
    updateAt: '2024-03-01 11:00:00'
  },
  {
    id: generateId(),
    name: 'backup-cluster',
    apiServer: 'https://api.backup.local:6443',
    description: '数据备份集群',
    status: 1,
    k8sVersion: 'v1.27.9',
    createBy: 'backup',
    createAt: '2024-03-01 11:00:00',
    updateBy: 'backup',
    updateAt: '2024-03-01 12:00:00'
  },
  {
    id: generateId(),
    name: 'archive-cluster',
    apiServer: 'https://api.archive.local:6443',
    description: '数据归档集群',
    status: 1,
    k8sVersion: 'v1.27.9',
    createBy: 'archive',
    createAt: '2024-03-01 12:00:00',
    updateBy: 'archive',
    updateAt: '2024-03-01 13:00:00'
  },
  {
    id: generateId(),
    name: 'ai-inference-cluster',
    apiServer: 'https://api.ai.inference.local:6443',
    description: 'AI推理服务集群',
    status: 1,
    k8sVersion: 'v1.28.3',
    createBy: 'aiops',
    createAt: '2024-03-01 13:00:00',
    updateBy: 'aiops',
    updateAt: '2024-03-01 14:00:00'
  },
  {
    id: generateId(),
    name: 'batch-compute-cluster',
    apiServer: 'https://api.batch.compute.local:6443',
    description: '批处理计算集群',
    status: 0,
    k8sVersion: 'v1.27.5',
    createBy: 'compute',
    createAt: '2024-03-01 14:00:00',
    updateBy: 'compute',
    updateAt: '2024-03-01 15:00:00'
  },
  {
    id: generateId(),
    name: 'serverless-cluster',
    apiServer: 'https://api.serverless.local:6443',
    description: '无服务器函数集群',
    status: 1,
    k8sVersion: 'v1.28.2',
    createBy: 'serverless',
    createAt: '2024-03-01 15:00:00',
    updateBy: 'serverless',
    updateAt: '2024-03-01 16:00:00'
  },
  {
    id: generateId(),
    name: 'websocket-cluster',
    apiServer: 'https://api.websocket.local:6443',
    description: '实时通信集群',
    status: 1,
    k8sVersion: 'v1.27.8',
    createBy: 'realtime',
    createAt: '2024-03-01 16:00:00',
    updateBy: 'realtime',
    updateAt: '2024-03-01 17:00:00'
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
    id: generateId(),
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
