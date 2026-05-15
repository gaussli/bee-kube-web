/**
 * Kubernetes 节点管理 Mock API
 * @module mock/kubernetes/node
 */
import { generateId } from '../utils'
import type { NodeQueryReq, NodeReq, NodeResp, NodeCordonReq } from '@/types'

/**
 * 节点路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/nodes - 获取节点分页列表
 * - GET /kubernetes/clusters/:clusterId/nodes/:name - 获取节点详情
 * - PUT /kubernetes/clusters/:clusterId/nodes/:name - 更新节点
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/drain - 驱逐节点
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/cordon - 设置可调度状态
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes',
    handler: (pathParams: Record<string, string>, params: Partial<NodeQueryReq>) => getNodePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getNodeDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/nodes/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<NodeReq>) => updateNode(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/drain',
    handler: (pathParams: Record<string, string>, params: any, data: any) => drainNode(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/cordon',
    handler: (pathParams: Record<string, string>, params: any, data: NodeCordonReq) => manageNodeCordon(pathParams.clusterId, pathParams.name, data)
  }
]

/**
 * 获取节点分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getNodePage(clusterId: string, params: Partial<NodeQueryReq>) {
  const { id, name, ip, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNodes]
  if (id) {
    filtered = filtered.filter(n => n.id === id)
  }
  if (name) {
    filtered = filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (ip) {
    filtered = filtered.filter(n => n.ip === ip)
  }
  if (status) {
    filtered = filtered.filter(n => n.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取节点详情
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点详情
 */
function getNodeDetail(clusterId: string, name: string) {
  return mockNodes[0]
}

/**
 * 更新节点
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 更新数据
 * @returns 更新后的节点ID
 */
function updateNode(clusterId: string, name: string, data: Partial<NodeReq>) {
  const index = mockNodes.findIndex(n => n.name === name)
  if (index === -1) {
    console.error(`[Update Node] can not find node: ${name}`)
    return null
  }

  const updated = {
    ...mockNodes[index],
    ...data
  }
  mockNodes[index] = updated
  return updated.id
}

/**
 * 驱逐节点上的 Pod
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 是否驱逐成功
 */
function drainNode(clusterId: string, name: string) {
  const node = mockNodes.find(n => n.name === name)
  if (!node) return null
  node.pods = '0' + node.pods.substring(node.pods.indexOf('/'))
  return true
}

/**
 * 设置节点可调度/不可调度
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 调度配置
 * @returns 是否设置成功
 */
function manageNodeCordon(clusterId: string, name: string, data: NodeCordonReq) {
  const node = mockNodes.find(n => n.name === name)
  if (!node) return null
  node.schedulable = data.cordon
  return true
}

/**
 * 模拟节点数据
 */
const mockNodes: NodeResp[] = [
  {
    id: generateId(),
    name: 'master-01',
    description: '生产集群主控制节点，负责集群调度和管理',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.10',
    cpu: '3/16',
    memory: '8Gi/32Gi',
    pods: '30/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'admin',
    updateAt: '2024-01-15 10:30:25',
    allocatedCpu: '1.2',
    allocatedMemory: '4Gi',
    labels: {
      'node-role.kubernetes.io/master': '',
      'kubernetes.io/os': 'linux'
    },
    annotations: {
      'kubeadm.alpha.kubernetes.io/cri-socket': 'unix:///var/run/containerd/containerd.sock'
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-01',
    description: '生产集群计算节点，运行有状态服务和中间件',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.11',
    cpu: '18/24',
    memory: '48Gi/64Gi',
    pods: '82/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:35:10',
    updateBy: 'admin',
    updateAt: '2024-02-20 14:22:35',
    allocatedCpu: '14.5',
    allocatedMemory: '38Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'worker-02',
    description: '生产集群计算节点，主要运行无状态Web服务',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.12',
    cpu: '20/24',
    memory: '58Gi/64Gi',
    pods: '95/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:40:05',
    updateBy: 'admin',
    updateAt: '2024-03-10 09:15:42',
    allocatedCpu: '18.8',
    allocatedMemory: '52Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'master-01',
    description: '预发集群主控制节点',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '10.0.1.10',
    cpu: '1/8',
    memory: '4Gi/16Gi',
    pods: '12/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:15:00',
    updateBy: 'developer',
    updateAt: '2024-02-10 09:15:00',
    allocatedCpu: '0.5',
    allocatedMemory: '2Gi',
    labels: {
      'node-role.kubernetes.io/master': ''
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-01',
    description: '预发集群计算节点，承载预发测试流量',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'NotReady',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '10.0.1.11',
    cpu: '2/8',
    memory: '6Gi/16Gi',
    pods: '8/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:20:00',
    updateBy: 'developer',
    updateAt: '2024-04-05 16:30:18',
    allocatedCpu: '1.0',
    allocatedMemory: '3Gi',
    labels: {
      'node-role.kubernetes.io/worker': ''
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'worker-02',
    description: '预发集群计算节点',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '10.0.1.12',
    cpu: '6/8',
    memory: '12Gi/16Gi',
    pods: '65/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:25:00',
    updateBy: 'developer',
    updateAt: '2024-03-28 11:45:22',
    allocatedCpu: '5.2',
    allocatedMemory: '10Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'dev-node-01',
    description: '开发集群混合节点，同时运行所有类型工作负载',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master', 'worker'],
    version: 'v1.27.5',
    os: 'Ubuntu 20.04.6 LTS',
    architecture: 'amd64',
    ip: '172.16.1.10',
    cpu: '6/8',
    memory: '14Gi/16Gi',
    pods: '102/110',
    createBy: 'devops',
    createAt: '2024-02-25 14:20:10',
    updateBy: 'devops',
    updateAt: '2024-02-25 14:20:10',
    allocatedCpu: '5.8',
    allocatedMemory: '13Gi',
    labels: {
      'node-role.kubernetes.io/master': ''
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-03',
    description: '生产集群存储优化节点，配备SSD磁盘',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.13',
    cpu: '4/24',
    memory: '8Gi/64Gi',
    pods: '18/110',
    createBy: 'admin',
    createAt: '2024-01-16 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-01-30 10:12:55',
    allocatedCpu: '2.5',
    allocatedMemory: '5Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'disk-type': 'ssd'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'worker-04',
    description: '生产集群节点，状态异常待排查',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Unknown',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.14',
    cpu: '0/16',
    memory: '0Gi/32Gi',
    pods: '0/110',
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-15 08:30:00',
    allocatedCpu: '0',
    allocatedMemory: '0Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-05',
    description: '生产集群高性能计算节点',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.15',
    cpu: '22/24',
    memory: '62Gi/64Gi',
    pods: '108/110',
    createBy: 'admin',
    createAt: '2024-01-17 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-10 14:55:30',
    allocatedCpu: '21.2',
    allocatedMemory: '60Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'compute-intensive'
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-06',
    description: '预发集群GPU计算节点，用于AI推理任务',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '10.0.1.13',
    cpu: '8/16',
    memory: '32Gi/64Gi',
    pods: '45/110',
    createBy: 'developer',
    createAt: '2024-03-15 14:20:00',
    updateBy: 'developer',
    updateAt: '2024-03-15 14:20:00',
    allocatedCpu: '6.5',
    allocatedMemory: '28Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'gpu-type': 'nvidia-t4'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'master-02',
    description: '生产集群高可用控制节点',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.16',
    cpu: '4/16',
    memory: '12Gi/32Gi',
    pods: '28/110',
    createBy: 'admin',
    createAt: '2024-01-20 11:00:00',
    updateBy: 'admin',
    updateAt: '2024-01-20 11:00:00',
    allocatedCpu: '2.0',
    allocatedMemory: '6Gi',
    labels: {
      'node-role.kubernetes.io/master': '',
      'kubernetes.io/os': 'linux'
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'worker-07',
    description: '生产集群内存优化节点',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.17',
    cpu: '12/32',
    memory: '120Gi/128Gi',
    pods: '85/110',
    createBy: 'admin',
    createAt: '2024-02-05 09:30:00',
    updateBy: 'admin',
    updateAt: '2024-02-05 09:30:00',
    allocatedCpu: '10.5',
    allocatedMemory: '110Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'memory-optimized': 'true'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'dev-worker-01',
    description: '开发集群通用工作节点',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.27.5',
    os: 'Ubuntu 20.04.6 LTS',
    architecture: 'amd64',
    ip: '172.16.1.11',
    cpu: '4/8',
    memory: '8Gi/16Gi',
    pods: '55/110',
    createBy: 'devops',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'devops',
    updateAt: '2024-03-01 10:00:00',
    allocatedCpu: '3.2',
    allocatedMemory: '6Gi',
    labels: {
      'node-role.kubernetes.io/worker': ''
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'worker-08',
    description: '生产集群网络优化节点',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.18',
    cpu: '8/16',
    memory: '16Gi/32Gi',
    pods: '42/110',
    createBy: 'admin',
    createAt: '2024-02-12 15:45:00',
    updateBy: 'admin',
    updateAt: '2024-02-12 15:45:00',
    allocatedCpu: '5.8',
    allocatedMemory: '12Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'network-optimized': 'true'
    },
    schedulable: false
  },
  {
    id: generateId(),
    name: 'edge-node-01',
    description: '边缘计算节点，部署在区域机房',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'arm64',
    ip: '192.168.2.10',
    cpu: '4/8',
    memory: '8Gi/16Gi',
    pods: '35/110',
    createBy: 'admin',
    createAt: '2024-03-10 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-10 08:00:00',
    allocatedCpu: '3.0',
    allocatedMemory: '6Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'edge-node': 'true'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'edge-node-02',
    description: '边缘计算节点，部署在区域机房',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'arm64',
    ip: '192.168.2.11',
    cpu: '4/8',
    memory: '8Gi/16Gi',
    pods: '28/110',
    createBy: 'admin',
    createAt: '2024-03-10 08:15:00',
    updateBy: 'admin',
    updateAt: '2024-03-10 08:15:00',
    allocatedCpu: '2.5',
    allocatedMemory: '5Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'edge-node': 'true'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'preempt-worker-01',
    description: '预发集群可抢占式计算节点',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '10.0.1.14',
    cpu: '4/8',
    memory: '8Gi/16Gi',
    pods: '38/110',
    createBy: 'developer',
    createAt: '2024-03-20 11:30:00',
    updateBy: 'developer',
    updateAt: '2024-03-20 11:30:00',
    allocatedCpu: '3.2',
    allocatedMemory: '6Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'preemptible': 'true'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'db-worker-01',
    description: '数据库专用计算节点，运行有状态数据库集群',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.19',
    cpu: '16/32',
    memory: '64Gi/128Gi',
    pods: '12/110',
    createBy: 'admin',
    createAt: '2024-02-28 14:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-28 14:00:00',
    allocatedCpu: '12.0',
    allocatedMemory: '56Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'database'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'ci-worker-01',
    description: 'CI/CD专用构建节点',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.27.5',
    os: 'Ubuntu 20.04.6 LTS',
    architecture: 'amd64',
    ip: '172.16.1.12',
    cpu: '6/8',
    memory: '12Gi/16Gi',
    pods: '48/110',
    createBy: 'devops',
    createAt: '2024-03-25 09:00:00',
    updateBy: 'devops',
    updateAt: '2024-03-25 09:00:00',
    allocatedCpu: '4.5',
    allocatedMemory: '9Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'ci-runner'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'monitor-node-01',
    description: '监控和日志采集专用节点',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.20',
    cpu: '4/16',
    memory: '16Gi/32Gi',
    pods: '22/110',
    createBy: 'admin',
    createAt: '2024-01-25 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-01-25 10:00:00',
    allocatedCpu: '2.8',
    allocatedMemory: '12Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'monitoring'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'cache-worker-01',
    description: '缓存服务专用节点，运行Redis集群',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    ip: '192.168.1.21',
    cpu: '8/16',
    memory: '28Gi/32Gi',
    pods: '8/110',
    createBy: 'admin',
    createAt: '2024-02-08 13:30:00',
    updateBy: 'admin',
    updateAt: '2024-02-08 13:30:00',
    allocatedCpu: '6.5',
    allocatedMemory: '24Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'cache'
    },
    schedulable: true
  },
  {
    id: generateId(),
    name: 'dev-worker-02',
    description: '开发集群备用工作节点',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.27.5',
    os: 'Ubuntu 20.04.6 LTS',
    architecture: 'amd64',
    ip: '172.16.1.13',
    cpu: '2/8',
    memory: '4Gi/16Gi',
    pods: '30/110',
    createBy: 'devops',
    createAt: '2024-04-01 10:30:00',
    updateBy: 'devops',
    updateAt: '2024-04-01 10:30:00',
    allocatedCpu: '1.5',
    allocatedMemory: '2.5Gi',
    labels: {
      'node-role.kubernetes.io/worker': ''
    },
    schedulable: true
  }
]
