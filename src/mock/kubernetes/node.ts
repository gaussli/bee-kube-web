import type { NodeResp } from '@/types'

// 模拟节点数据
const mockNodes: NodeResp[] = [
  {
    id: 'node-001',
    name: 'master-01',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.10',
    cpu: '3/16',
    memory: '8Gi/32Gi',
    pods: '30/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:30:25',
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
    id: 'node-002',
    name: 'worker-01',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.11',
    cpu: '18/24',
    memory: '48Gi/64Gi',
    pods: '82/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:35:10',
    allocatedCpu: '14.5',
    allocatedMemory: '38Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    }
  },
  {
    id: 'node-003',
    name: 'worker-02',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.12',
    cpu: '20/24',
    memory: '58Gi/64Gi',
    pods: '95/110',
    createBy: 'admin',
    createAt: '2024-01-15 10:40:05',
    allocatedCpu: '18.8',
    allocatedMemory: '52Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    }
  },
  {
    id: 'node-004',
    name: 'master-01',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '10.0.1.10',
    cpu: '1/8',
    memory: '4Gi/16Gi',
    pods: '12/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:15:00',
    allocatedCpu: '0.5',
    allocatedMemory: '2Gi',
    labels: {
      'node-role.kubernetes.io/master': ''
    },
    schedulable: false
  },
  {
    id: 'node-005',
    name: 'worker-01',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'NotReady',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '10.0.1.11',
    cpu: '2/8',
    memory: '6Gi/16Gi',
    pods: '8/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:20:00',
    allocatedCpu: '1.0',
    allocatedMemory: '3Gi',
    labels: {
      'node-role.kubernetes.io/worker': ''
    }
  },
  {
    id: 'node-006',
    name: 'worker-02',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '10.0.1.12',
    cpu: '6/8',
    memory: '12Gi/16Gi',
    pods: '65/110',
    createBy: 'developer',
    createAt: '2024-02-10 09:25:00',
    allocatedCpu: '5.2',
    allocatedMemory: '10Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    }
  },
  {
    id: 'node-007',
    name: 'dev-node-01',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Ready',
    roles: ['control-plane', 'master', 'worker'],
    version: 'v1.27.5',
    os: 'Ubuntu 20.04.6 LTS',
    architecture: 'amd64',
    internalIp: '172.16.1.10',
    cpu: '6/8',
    memory: '14Gi/16Gi',
    pods: '102/110',
    createBy: 'devops',
    createAt: '2024-02-25 14:20:10',
    allocatedCpu: '5.8',
    allocatedMemory: '13Gi',
    labels: {
      'node-role.kubernetes.io/master': ''
    },
    schedulable: false
  },
  {
    id: 'node-008',
    name: 'worker-03',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.13',
    cpu: '4/24',
    memory: '8Gi/64Gi',
    pods: '18/110',
    createBy: 'admin',
    createAt: '2024-01-16 08:00:00',
    allocatedCpu: '2.5',
    allocatedMemory: '5Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'disk-type': 'ssd'
    }
  },
  {
    id: 'node-009',
    name: 'worker-04',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Unknown',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.14',
    cpu: '0/16',
    memory: '0Gi/32Gi',
    pods: '0/110',
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    allocatedCpu: '0',
    allocatedMemory: '0Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux'
    }
  },
  {
    id: 'node-010',
    name: 'worker-05',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    os: 'Ubuntu 22.04.3 LTS',
    architecture: 'amd64',
    internalIp: '192.168.1.15',
    cpu: '22/24',
    memory: '62Gi/64Gi',
    pods: '108/110',
    createBy: 'admin',
    createAt: '2024-01-17 09:00:00',
    allocatedCpu: '21.2',
    allocatedMemory: '60Gi',
    labels: {
      'node-role.kubernetes.io/worker': '',
      'kubernetes.io/os': 'linux',
      'workload-type': 'compute-intensive'
    }
  }
]

// 获取节点分页列表
function getNodePage(params: any) {
  const { id, name, clusterId, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNodes]

  // 搜索过滤
  if (id) {
    filtered = filtered.filter(n => n.id.includes(id))
  }
  if (name) {
    filtered = filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))
  }
  // if (clusterId) {
  //   filtered = filtered.filter(n => n.clusterId === clusterId)
  // }
  if (status) {
    filtered = filtered.filter(n => n.status === status)
  }

  // 分页
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total }
}

// 获取节点详情
function getNodeDetail(clusterId: string, name: string) {
  const node = mockNodes.find(n => n.clusterId === clusterId && n.name === name)
  return node || null
}

// 更新节点
function updateNode(clusterId: string, name: string, data: any) {
  const index = mockNodes.findIndex(n => n.clusterId === clusterId && n.name === name)
  if (index === -1) return null

  const updated = {
    ...mockNodes[index],
    ...data
  }
  mockNodes[index] = updated
  return updated
}

// 驱逐节点上的 Pod
function drainNode(clusterId: string, name: string) {
  const node = mockNodes.find(n => n.clusterId === clusterId && n.name === name)
  if (!node) return null
  node.pods = '0' + node.pods.substring(node.pods.indexOf('/'))
  return { success: true }
}

// 设置节点可调度/不可调度
function cordonNode(clusterId: string, name: string, unschedulable: boolean) {
  const node = mockNodes.find(n => n.clusterId === clusterId && n.name === name)
  if (!node) return null
  return { success: true, unschedulable }
}

export default [
  {
    method: 'get',
    url: '/kubernetes/node/page',
    handler: (params: any) => getNodePage(params)
  },
  {
    method: 'get',
    url: '/kubernetes/node/:clusterId/:name',
    handler: ({ clusterId, name }: any) => getNodeDetail(clusterId, name)
  },
  {
    method: 'put',
    url: '/kubernetes/node/:clusterId/:name',
    handler: ({ clusterId, name, ...data }: any) => updateNode(clusterId, name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/node/:clusterId/:name/drain',
    handler: ({ clusterId, name }: any) => drainNode(clusterId, name)
  },
  {
    method: 'post',
    url: '/kubernetes/node/:clusterId/:name/cordon',
    handler: ({ clusterId, name, unschedulable }: any) => cordonNode(clusterId, name, unschedulable)
  }
]
