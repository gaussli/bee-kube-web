/**
 * Kubernetes 集群管理 Mock API
 * @module mock/kubernetes/cluster
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterDetailResp,
  ClusterEventQueryReq,
  ClusterEventResp,
  ClusterListResp,
  ClusterQueryReq,
  ClusterRegistrationReq,
  ClusterReq,
  ClusterResourceResp
} from '@/types/kubernetes/cluster'
import { generateId } from '@/mock/utils'

/**
 * 集群路由配置
 * @remarks
 * - GET /kubernetes/clusters - 获取集群分页列表
 * - GET /kubernetes/clusters/:id - 获取集群详情
 * - POST /kubernetes/clusters - 创建集群
 * - POST /kubernetes/clusters/register - 注册集群
 * - PUT /kubernetes/clusters/:id - 更新集群
 * - GET /kubernetes/clusters/:id/resource - 获取集群资源用量
 * - DELETE /kubernetes/clusters/:id - 删除集群
 * - DELETE /kubernetes/clusters/batch - 批量删除集群
 * - GET /kubernetes/clusters/:id/events - 获取集群事件分页列表
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters',
    handler: (params: Partial<ClusterQueryReq>): PageVo<ClusterListResp> => getClusterPage(params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:id',
    handler: (pathParams: Record<string, string>): ClusterDetailResp => getClusterDetail(pathParams.id)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:id/resource',
    handler: (pathParams: Record<string, string>): ClusterResourceResp => getClusterResource(pathParams.id)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters',
    handler: (data: Partial<ClusterReq>): void => createCluster(data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/register',
    handler: (data: Partial<ClusterRegistrationReq>): void => registerCluster(data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:id',
    handler: (pathParams: Record<string, string>, data: Partial<ClusterReq>): void => updateCluster(pathParams.id, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:id',
    handler: (pathParams: Record<string, string>): void => deleteCluster(pathParams.id)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/batch',
    handler: (data: string[]): void => deleteClusters(data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:id/events',
    handler: (pathParams: Record<string, string>, params: Partial<ClusterEventQueryReq>): PageVo<ClusterEventResp> =>
      getClusterEventPage(pathParams.id, params)
  }
]

/**
 * 获取集群分页列表
 * @param params - 查询参数
 * @returns 分页数据
 */
function getClusterPage(params: Partial<ClusterQueryReq>): PageVo<ClusterListResp> {
  const { id, name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockClusters]

  if (status) {
    filtered = filtered.filter(c => c.status === status)
  }

  if (id || name) {
    let searchFiltered: ClusterListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.id === id)]
      console.log(searchFiltered)
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))]
    }
    console.log(searchFiltered)
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(n => {
      if (seenIds.has(n.id)) return false
      seenIds.add(n.id)
      return true
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取集群详情
 * @param id - 集群ID
 * @returns 集群详情对象
 */
function getClusterDetail(id: string): ClusterDetailResp {
  const cluster = mockClusters.find(c => c.id === id)
  if (!cluster) {
    console.error('[getClusterDetail] can not find cluster:', id)
    return {
      ...mockClusters[0],
      certExpireAt: '2026-12-31 23:59:59'
    }
  }
  return {
    ...cluster,
    certExpireAt: '2026-12-31 23:59:59'
  }
}

/**
 * 获取集群资源用量
 * @param id - 集群ID
 * @returns 集群资源用量数据
 */
function getClusterResource(id: string): ClusterResourceResp {
  const cluster = mockClusters.find(c => c.id === id)
  if (!cluster) {
    console.error('[getClusterResource] can not find cluster:', id)
  }
  const totalCpu = 32 + Math.floor(Math.random() * 96)
  // 内存范围约 128 MiB ~ 4 TiB（Bytes），覆盖 Mi/Gi/Ti 三种量级
  const totalMemory = Math.floor(Math.pow(2, 27) + Math.random() * Math.pow(2, 42))
  // 磁盘范围约 1 GiB ~ 8 TiB（Bytes），覆盖 Gi/Ti 两种量级
  const totalStorage = Math.floor(Math.pow(2, 30) + Math.random() * Math.pow(2, 43))
  const totalPod = 100 + Math.floor(Math.random() * 200)
  return {
    capacity: {
      cpu: totalCpu,
      memory: totalMemory,
      storage: totalStorage,
      pod: totalPod
    },
    allocation: {
      // Kubernetes 可分配容量略低于物理容量，模拟操作系统预留
      cpu: Math.floor(totalCpu * (0.9 + Math.random() * 0.08)),
      memory: Math.floor(totalMemory * (0.88 + Math.random() * 0.1)),
      storage: Math.floor(totalStorage * (0.85 + Math.random() * 0.12)),
      pod: Math.floor(totalPod * (0.9 + Math.random() * 0.08))
    },
    usage: {
      cpu: Math.floor(totalCpu * (0.1 + Math.random() * 0.7)),
      memory: Math.floor(totalMemory * (0.1 + Math.random() * 0.7)),
      storage: Math.floor(totalStorage * (0.1 + Math.random() * 0.7)),
      pod: Math.floor(totalPod * (0.1 + Math.random() * 0.7))
    }
  }
}

/**
 * 创建集群
 * @param data - 集群创建数据
 */
function createCluster(data: Partial<ClusterReq>): void {
  const created: ClusterListResp = {
    id: generateId(),
    name: data.name || '',
    apiServer: data.apiServer || '',
    description: data.description || '',
    status: 1,
    statusMsg: undefined,
    k8sVersion: '',
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusters.push(created)
}

/**
 * 注册集群
 * @param data - 集群注册数据
 */
function registerCluster(data: Partial<ClusterRegistrationReq>): void {
  const created: ClusterListResp = {
    id: generateId(),
    name: data.name || '',
    apiServer: '',
    description: data.description || '',
    status: 1,
    statusMsg: undefined,
    k8sVersion: '',
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusters.push(created)
}

/**
 * 更新集群信息
 * @param id - 集群ID
 * @param data - 集群更新数据
 */
function updateCluster(id: string, data: Partial<ClusterReq>): void {
  const index = mockClusters.findIndex(c => c.id === id)
  if (index === -1) {
    console.error('[Update Cluster] can not find cluster:', id)
    return
  }
  const updated = {
    ...mockClusters[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusters[index] = updated
}

/**
 * 删除单个集群
 * @param id - 集群ID
 */
function deleteCluster(id: string): void {
  const index = mockClusters.findIndex(c => c.id === id)
  if (index === -1) {
    console.error('[Delete Cluster] can not find cluster:', id)
    return
  }

  mockClusters.splice(index, 1)
}

/**
 * 批量删除集群
 * @param ids - 集群ID数组
 */
function deleteClusters(ids: string[]): void {
  ids.forEach(id => {
    const index = mockClusters.findIndex(c => c.id === id)
    if (index === -1) {
      console.error('[Delete Clusters] can not find cluster:', id)
    } else {
      mockClusters.splice(index, 1)
    }
  })
}

/**
 * 获取集群事件分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页后的集群事件数据
 */
function getClusterEventPage(clusterId: string, params: Partial<ClusterEventQueryReq>): PageVo<ClusterEventResp> {
  const { type, reason, involvedObjectName, involvedObjectKind, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockClusterEvents]
  if (type) {
    filtered = filtered.filter(e => e.type === type)
  }
  if (reason) {
    filtered = filtered.filter(e => e.reason.includes(reason))
  }
  if (involvedObjectName) {
    filtered = filtered.filter(e => e.involvedObject.name.includes(involvedObjectName))
  }
  if (involvedObjectKind) {
    filtered = filtered.filter(e => e.involvedObject.kind === involvedObjectKind)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 模拟集群事件数据
 * @remarks 包含多种 Kubernetes 事件类型，覆盖 Normal 和 Warning 事件
 */
const mockClusterEvents: ClusterEventResp[] = [
  {
    id: generateId(),
    type: 'Normal',
    reason: 'Scheduled',
    message: 'Successfully assigned pod/nginx-deployment-7fb96c846b-xk2p9 to node-1',
    involvedObject: { kind: 'Pod', name: 'nginx-deployment-7fb96c846b-xk2p9', namespace: 'default', uid: generateId() },
    source: { component: 'default-scheduler', host: 'node-1' },
    count: 1,
    firstTimestamp: '2024-01-15 10:30:25',
    lastTimestamp: '2024-01-15 10:30:25',
    createBy: 'system',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:25'
  },
  {
    id: generateId(),
    type: 'Warning',
    reason: 'FailedScheduling',
    message: '0/5 nodes are available: 2 Insufficient memory, 3 node(s) were rescheduled.',
    involvedObject: { kind: 'Pod', name: 'app-pod-5d8f9c7b4-m8n2p', namespace: 'default', uid: generateId() },
    source: { component: 'default-scheduler', host: '' },
    count: 3,
    firstTimestamp: '2024-01-15 10:28:14',
    lastTimestamp: '2024-01-15 10:32:18',
    createBy: 'system',
    createAt: '2024-01-15 10:28:14',
    updateBy: 'system',
    updateAt: '2024-01-15 10:32:18'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'Pulled',
    message: 'Container image "redis:7" already present on machine',
    involvedObject: { kind: 'Pod', name: 'redis-master-0', namespace: 'default', uid: generateId() },
    source: { component: 'kubelet', host: 'node-2' },
    count: 1,
    firstTimestamp: '2024-01-15 10:25:33',
    lastTimestamp: '2024-01-15 10:25:33',
    createBy: 'system',
    createAt: '2024-01-15 10:25:33',
    updateBy: 'system',
    updateAt: '2024-01-15 10:25:33'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'Created',
    message: 'Created container redis',
    involvedObject: { kind: 'Pod', name: 'redis-master-0', namespace: 'default', uid: generateId() },
    source: { component: 'kubelet', host: 'node-2' },
    count: 1,
    firstTimestamp: '2024-01-15 10:25:34',
    lastTimestamp: '2024-01-15 10:25:34',
    createBy: 'system',
    createAt: '2024-01-15 10:25:34',
    updateBy: 'system',
    updateAt: '2024-01-15 10:25:34'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'Started',
    message: 'Started container redis',
    involvedObject: { kind: 'Pod', name: 'redis-master-0', namespace: 'default', uid: generateId() },
    source: { component: 'kubelet', host: 'node-2' },
    count: 1,
    firstTimestamp: '2024-01-15 10:25:35',
    lastTimestamp: '2024-01-15 10:25:35',
    createBy: 'system',
    createAt: '2024-01-15 10:25:35',
    updateBy: 'system',
    updateAt: '2024-01-15 10:25:35'
  },
  {
    id: generateId(),
    type: 'Warning',
    reason: 'BackOff',
    message: 'Back-off restarting failed container',
    involvedObject: { kind: 'Pod', name: 'failing-app-6d9f8c5b4-l3k7j', namespace: 'default', uid: generateId() },
    source: { component: 'kubelet', host: 'node-3' },
    count: 12,
    firstTimestamp: '2024-01-15 10:22:18',
    lastTimestamp: '2024-01-15 10:45:22',
    createBy: 'system',
    createAt: '2024-01-15 10:22:18',
    updateBy: 'system',
    updateAt: '2024-01-15 10:45:22'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    message: 'Scaled up replica set nginx-deployment-7fb96c846b to 3',
    involvedObject: { kind: 'Deployment', name: 'nginx-deployment', namespace: 'default', uid: generateId() },
    source: { component: 'deployment-controller', host: '' },
    count: 1,
    firstTimestamp: '2024-01-15 09:15:00',
    lastTimestamp: '2024-01-15 09:15:00',
    createBy: 'system',
    createAt: '2024-01-15 09:15:00',
    updateBy: 'system',
    updateAt: '2024-01-15 09:15:00'
  },
  {
    id: generateId(),
    type: 'Warning',
    reason: 'NodeMemoryPressure',
    message: 'Node is under memory pressure',
    involvedObject: { kind: 'Node', name: 'node-3', uid: generateId() },
    source: { component: 'kubelet', host: 'node-3' },
    count: 5,
    firstTimestamp: '2024-01-15 08:45:22',
    lastTimestamp: '2024-01-15 10:50:15',
    createBy: 'system',
    createAt: '2024-01-15 08:45:22',
    updateBy: 'system',
    updateAt: '2024-01-15 10:50:15'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'SuccessfulCreate',
    message: 'Created pod: nginx-deployment-7fb96c846b-xk2p9',
    involvedObject: {
      kind: 'ReplicaSet',
      name: 'nginx-deployment-7fb96c846b',
      namespace: 'default',
      uid: generateId()
    },
    source: { component: 'replicaset-controller', host: '' },
    count: 1,
    firstTimestamp: '2024-01-15 10:30:20',
    lastTimestamp: '2024-01-15 10:30:20',
    createBy: 'system',
    createAt: '2024-01-15 10:30:20',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:20'
  },
  {
    id: generateId(),
    type: 'Warning',
    reason: 'Failed',
    message: 'Error: ImagePullBackOff',
    involvedObject: { kind: 'Pod', name: 'broken-app-8f9c7b5d-2k4m', namespace: 'staging', uid: generateId() },
    source: { component: 'kubelet', host: 'node-1' },
    count: 20,
    firstTimestamp: '2024-01-15 06:12:00',
    lastTimestamp: '2024-01-15 10:55:30',
    createBy: 'system',
    createAt: '2024-01-15 06:12:00',
    updateBy: 'system',
    updateAt: '2024-01-15 10:55:30'
  },
  {
    id: generateId(),
    type: 'Normal',
    reason: 'Killing',
    message: 'Stopping container nginx',
    involvedObject: { kind: 'Pod', name: 'nginx-deployment-7fb96c846b-abc12', namespace: 'default', uid: generateId() },
    source: { component: 'kubelet', host: 'node-1' },
    count: 1,
    firstTimestamp: '2024-01-15 10:00:00',
    lastTimestamp: '2024-01-15 10:00:00',
    createBy: 'system',
    createAt: '2024-01-15 10:00:00',
    updateBy: 'system',
    updateAt: '2024-01-15 10:00:00'
  },
  {
    id: generateId(),
    type: 'Warning',
    reason: 'Unhealthy',
    message:
      'Readiness probe failed: Get "http://10.0.1.15:8080/health": dial tcp 10.0.1.15:8080: connect: connection refused',
    involvedObject: { kind: 'Pod', name: 'api-service-6d9f8c5b4-l3k7j', namespace: 'production', uid: generateId() },
    source: { component: 'kubelet', host: 'node-2' },
    count: 8,
    firstTimestamp: '2024-01-15 09:30:00',
    lastTimestamp: '2024-01-15 10:58:00',
    createBy: 'system',
    createAt: '2024-01-15 09:30:00',
    updateBy: 'system',
    updateAt: '2024-01-15 10:58:00'
  }
]

/**
 * 模拟集群数据
 * @remarks 包含生产、预发、开发、测试等多种环境的集群数据
 */
const mockClusters: ClusterListResp[] = [
  {
    id: generateId(),
    name: 'prod-cluster',
    apiServer: 'https://192.168.100.201:6443',
    description:
      '生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用生产环境集群，用于部署生产应用',
    status: 1,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: 'API Server 连接超时',
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: '节点 NotReady 状态',
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
    status: 3,
    statusMsg: undefined,
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
    statusMsg: undefined,
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
    status: 4,
    statusMsg: 'API Server 不可达超过 5 分钟',
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
    statusMsg: undefined,
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
    statusMsg: undefined,
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
    statusMsg: undefined,
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
    status: 3,
    statusMsg: undefined,
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
    status: 4,
    statusMsg: '多个 Master 节点宕机',
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
    status: 4,
    statusMsg: 'etcd 数据损坏无法恢复',
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
    status: 3,
    statusMsg: undefined,
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
    status: 4,
    statusMsg: '集群准入控制器阻塞',
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
    status: 2,
    statusMsg: 'etcd 集群不健康',
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
    status: 3,
    statusMsg: undefined,
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: '组件 CrashLoopBackOff',
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
    status: 3,
    statusMsg: undefined,
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
    status: 4,
    statusMsg: 'CNI 插件完全失效',
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
    status: 4,
    statusMsg: '集群证书全部过期',
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
    statusMsg: undefined,
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
    statusMsg: undefined,
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
    status: 4,
    statusMsg: 'kubelet 批量退出',
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
    status: 4,
    statusMsg: '存储后端故障',
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
    status: 4,
    statusMsg: '集群规模超限自动保护',
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
    status: 3,
    statusMsg: undefined,
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
    status: 4,
    statusMsg: '防火墙规则误拦截',
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
    status: 4,
    statusMsg: '集群命名空间被删除',
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
    status: 4,
    statusMsg: 'KMS 加密密钥丢失',
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
    status: 4,
    statusMsg: '容器运行时故障',
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
    status: 2,
    statusMsg: '控制面证书即将过期',
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
    status: 2,
    statusMsg: '集群网络插件异常',
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
    status: 2,
    statusMsg: 'CoreDNS 不可用',
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
    status: 2,
    statusMsg: '调度器未就绪',
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
    status: 2,
    statusMsg: '资源配额告警',
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
    statusMsg: undefined,
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: '磁盘空间不足',
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
    status: 2,
    statusMsg: '内存使用率过高',
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
    status: 3,
    statusMsg: undefined,
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
    statusMsg: undefined,
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
    status: 3,
    statusMsg: undefined,
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
    status: 4,
    statusMsg: '节点组全部不可用',
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: 'POD CIDR 耗尽',
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
    status: 2,
    statusMsg: '集群内网断开',
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
    status: 2,
    statusMsg: 'NTP 时间不同步',
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: '集群 ConfigMap 损坏',
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
    status: 3,
    statusMsg: undefined,
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
    status: 2,
    statusMsg: '异常',
    k8sVersion: 'v1.27.8',
    createBy: 'realtime',
    createAt: '2024-03-01 16:00:00',
    updateBy: 'realtime',
    updateAt: '2024-03-01 17:00:00'
  }
]
