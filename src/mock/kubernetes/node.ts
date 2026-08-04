/**
 * Kubernetes 节点管理 Mock API
 * @module mock/kubernetes/node
 */
import type { PageVo } from '@/types/common'
import type {
  NodeQueryReq,
  NodeReq,
  NodeListResp,
  NodeCordonReq,
  NodeLabelsReq,
  NodeAnnotationsReq,
  NodeTaintsReq,
  NodeResourceResp,
} from '@/types/kubernetes/node'

import { generateId } from '@/mock/utils'

/**
 * 节点路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/nodes - 获取节点分页列表（getNodePage）
 * - GET /kubernetes/clusters/:clusterId/nodes/topn - 获取节点 TopN 排行（getNodeTopN）
 * - GET /kubernetes/clusters/:clusterId/nodes/:name - 获取节点详情（getNodeDetail）
 * - GET /kubernetes/clusters/:clusterId/nodes/:name/resource - 获取节点资源用量（getNodeResource）
 * - PUT /kubernetes/clusters/:clusterId/nodes/:name - 更新节点（updateNode）
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/drain - 驱逐节点（drainNode）
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/cordon - 设置可调度状态（cordonNode）
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/labels - 更新节点标签（manageNodeLabels）
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/annotations - 更新节点注解（manageNodeAnnotations）
 * - POST /kubernetes/clusters/:clusterId/nodes/:name/taints - 更新节点污点（manageNodeTaints）
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes',
    handler: (pathParams: Record<string, string>, params: Partial<NodeQueryReq>): PageVo<NodeListResp> =>
      getNodePage(pathParams.clusterId, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes/topn',
    handler: (pathParams: Record<string, string>, params: Partial<{ metric: string; count: number }>): NodeListResp[] =>
      getNodeTopN(pathParams.clusterId, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes/:name',
    handler: (pathParams: Record<string, string>): NodeListResp => getNodeDetail(pathParams.clusterId, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/resource',
    handler: (pathParams: Record<string, string>): NodeResourceResp =>
      getNodeResource(pathParams.clusterId, pathParams.name),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/nodes/:name',
    handler: (pathParams: Record<string, string>, data: Partial<NodeReq>): void =>
      updateNode(pathParams.clusterId, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/drain',
    handler: (pathParams: Record<string, string>): void => drainNode(pathParams.clusterId, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/cordon',
    handler: (pathParams: Record<string, string>, data: NodeCordonReq): void =>
      cordonNode(pathParams.clusterId, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<NodeLabelsReq>): void =>
      manageNodeLabels(pathParams.clusterId, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<NodeAnnotationsReq>): void =>
      manageNodeAnnotations(pathParams.clusterId, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/nodes/:name/taints',
    handler: (pathParams: Record<string, string>, data: Partial<NodeTaintsReq>): void =>
      manageNodeTaints(pathParams.clusterId, pathParams.name, data),
  },
]

/**
 * 获取节点分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getNodePage(_clusterId: string, params: Partial<NodeQueryReq>): PageVo<NodeListResp> {
  const { id, name, ip, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNodes]

  if (status) {
    filtered = filtered.filter(n => n.status === status)
  }

  if (id || name || ip) {
    let searchFiltered: NodeListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.id === id)]
      console.log(searchFiltered)
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))]
    }
    if (ip) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.ip === ip)]
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
 * 获取节点详情
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点详情
 */
function getNodeDetail(clusterId: string, name: string): NodeListResp {
  const node = mockNodes.find(n => n.clusterId === clusterId && n.name === name)
  if (!node) {
    console.error('[getNodeDetail] can not find node:', clusterId, name)
    return mockNodes[0]
  }
  return node
}

/**
 * 获取节点资源用量
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @returns 节点资源用量数据
 */
function getNodeResource(_clusterId: string, _name: string): NodeResourceResp {
  return generateNodeResources()
}

/**
 * 获取节点 TopN 排行
 * @param _clusterId - 集群ID（mock 中未使用）
 * @param params - 查询参数
 * @returns 随机选取的 TopN 节点列表
 */
function getNodeTopN(_clusterId: string, params: Partial<{ metric: string; count: number }>): NodeListResp[] {
  const { count = 5 } = params || {}
  return [...mockNodes].sort(() => Math.random() - 0.5).slice(0, count)
}

/**
 * 更新节点
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 更新数据
 */
function updateNode(clusterId: string, name: string, data: Partial<NodeReq>): void {
  console.debug('[updateNode] clusterId:', clusterId, 'name:', name, 'data:', data)
}

/**
 * 驱逐节点上的 Pod
 * @param clusterId - 集群ID
 * @param name - 节点名称
 */
function drainNode(clusterId: string, name: string): void {
  console.debug('[drainNode] clusterId:', clusterId, 'name:', name)
}

/**
 * 设置节点可调度/不可调度
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 调度配置
 */
function cordonNode(clusterId: string, name: string, data: NodeCordonReq): void {
  console.debug('[cordonNode] clusterId:', clusterId, 'name:', name, 'data:', data)
}

/**
 * 更新节点标签配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 标签配置
 */
function manageNodeLabels(clusterId: string, name: string, data: Partial<NodeLabelsReq>): void {
  console.debug('[manageNodeLabels] clusterId:', clusterId, 'name:', name, 'data:', data)
}

/**
 * 更新节点注解配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 注解配置
 */
function manageNodeAnnotations(clusterId: string, name: string, data: Partial<NodeAnnotationsReq>): void {
  console.debug('[manageNodeAnnotations] clusterId:', clusterId, 'name:', name, 'data:', data)
}

/**
 * 更新节点污点配置
 * @param clusterId - 集群ID
 * @param name - 节点名称
 * @param data - 污点配置
 */
function manageNodeTaints(clusterId: string, name: string, data: Partial<NodeTaintsReq>): void {
  console.debug('[manageNodeTaints] clusterId:', clusterId, 'name:', name, 'data:', data)
}

function generateNodeResources() {
  // 单节点 CPU 4~16 核
  const capacityCpu = 4 + Math.floor(Math.random() * 13)
  // 内存 8~64 GiB（Bytes）
  const capacityMemory = Math.floor(Math.pow(2, 33) + Math.random() * Math.pow(2, 36))
  // 磁盘 50~500 GiB（Bytes）
  const capacityStorage = Math.floor(Math.pow(2, 29) * 50 + Math.random() * Math.pow(2, 29) * 900)
  // Pod 50~200
  const capacityPod = 50 + Math.floor(Math.random() * 151)
  return {
    capacity: {
      cpu: capacityCpu,
      memory: capacityMemory,
      storage: capacityStorage,
      pod: capacityPod,
    },
    allocation: {
      // Kubernetes 可分配容量略低于物理容量，模拟操作系统预留
      cpu: Math.floor(capacityCpu * (0.9 + Math.random() * 0.08)),
      memory: Math.floor(capacityMemory * (0.88 + Math.random() * 0.1)),
      storage: Math.floor(capacityStorage * (0.85 + Math.random() * 0.12)),
      pod: Math.floor(capacityPod * (0.9 + Math.random() * 0.08)),
    },
    usage: {
      cpu: Math.floor(capacityCpu * (0.1 + Math.random() * 0.7)),
      memory: Math.floor(capacityMemory * (0.1 + Math.random() * 0.7)),
      storage: Math.floor(capacityStorage * (0.1 + Math.random() * 0.7)),
      pod: Math.floor(capacityPod * (0.1 + Math.random() * 0.7)),
    },
  }
}

/**
 * 模拟节点数据
 */
const mockNodes: NodeListResp[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'master-01',
    description:
      '生产集群主控制节点，负责集群调度和管理。生产集群主控制节点，负责集群调度和管理。生产集群主控制节点，负责集群调度和管理。',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '192.168.1.10',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'admin',
    updateAt: '2024-01-15 10:30:25',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'worker-01',
    description: '生产集群工作节点，运行业务应用 Pod',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '192.168.1.11',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-01-15 11:00:12',
    updateBy: 'admin',
    updateAt: '2024-03-20 09:15:30',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'worker-02',
    description: '生产集群工作节点，承担高并发业务流量',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '192.168.1.12',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-01-15 11:10:45',
    updateBy: 'admin',
    updateAt: '2024-05-10 14:22:08',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'worker-03',
    description: '生产集群工作节点，用于数据持久化服务',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '192.168.1.13',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-01-16 08:00:00',
    updateBy: 'ops',
    updateAt: '2024-06-01 10:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'worker-04',
    description: '生产集群工作节点，GPU 计算节点',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '192.168.1.14',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-02-20 09:30:00',
    updateBy: 'admin',
    updateAt: '2024-02-20 09:30:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'worker-05',
    description: '生产集群工作节点，日志和监控服务节点',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'NotReady',
    statusMsg: 'kubelet 服务异常，日志采集管道中断',
    ip: '192.168.1.15',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-06-15 16:45:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-master-01',
    description: '预发布集群主控制节点',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    status: 'Unknown',
    statusMsg: 'API Server 连接超时，无法获取节点状态',
    ip: '192.168.2.10',
    unschedulable: true,
    createBy: 'admin',
    createAt: '2024-02-10 10:30:25',
    updateBy: 'admin',
    updateAt: '2024-02-10 10:30:25',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-worker-01',
    description: '预发布集群工作节点，用于上线前验证',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    status: 'Ready',
    ip: '192.168.2.11',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-02-10 11:00:00',
    updateBy: 'qa',
    updateAt: '2024-04-15 13:25:10',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-worker-02',
    description: '预发布集群工作节点，压力测试专用',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    status: 'Ready',
    ip: '192.168.2.12',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-02-10 11:10:00',
    updateBy: 'qa',
    updateAt: '2024-05-20 10:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-worker-03',
    description: '预发布集群工作节点',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    status: 'Ready',
    ip: '192.168.2.13',
    unschedulable: true,
    createBy: 'admin',
    createAt: '2024-03-15 14:00:00',
    updateBy: 'ops',
    updateAt: '2024-06-10 12:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-master-01',
    description: '开发集群控制节点，用于日常开发调试',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    status: 'Ready',
    ip: '192.168.3.10',
    unschedulable: false,
    createBy: 'devops',
    createAt: '2024-01-10 09:00:00',
    updateBy: 'devops',
    updateAt: '2024-03-18 16:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-worker-01',
    description: '开发集群工作节点，承载开发环境服务',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    status: 'Ready',
    ip: '192.168.3.11',
    unschedulable: false,
    createBy: 'devops',
    createAt: '2024-01-10 09:30:00',
    updateBy: 'dev1',
    updateAt: '2024-04-02 11:30:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-worker-02',
    description: '开发集群工作节点，CI/CD 构建节点',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    status: 'Ready',
    ip: '192.168.3.12',
    unschedulable: false,
    createBy: 'devops',
    createAt: '2024-01-10 10:00:00',
    updateBy: 'devops',
    updateAt: '2024-05-05 08:45:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-worker-03',
    description: '开发集群工作节点',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    status: 'NotReady',
    statusMsg: '磁盘空间不足，节点标记为不可用',
    ip: '192.168.3.13',
    unschedulable: false,
    createBy: 'devops',
    createAt: '2024-01-20 10:00:00',
    updateBy: 'devops',
    updateAt: '2024-06-18 15:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'test-master-01',
    description: '测试集群主节点，集成测试环境',
    clusterId: generateId(),
    clusterName: 'test-cluster',
    status: 'Ready',
    ip: '192.168.4.10',
    unschedulable: false,
    createBy: 'qa',
    createAt: '2024-02-01 09:00:00',
    updateBy: 'qa',
    updateAt: '2024-02-01 09:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'test-worker-01',
    description: '测试集群工作节点',
    clusterId: generateId(),
    clusterName: 'test-cluster',
    status: 'Ready',
    ip: '192.168.4.11',
    unschedulable: false,
    createBy: 'qa',
    createAt: '2024-02-01 09:30:00',
    updateBy: 'qa',
    updateAt: '2024-03-10 14:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'test-worker-02',
    description: '测试集群工作节点，自动化测试运行节点',
    clusterId: generateId(),
    clusterName: 'test-cluster',
    status: 'Ready',
    ip: '192.168.4.12',
    unschedulable: false,
    createBy: 'qa',
    createAt: '2024-02-01 10:00:00',
    updateBy: 'qa',
    updateAt: '2024-05-22 09:20:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'prod-edge-01',
    description: '生产集群边缘节点，用于就近接入和低延迟服务',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '10.0.1.10',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-04-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-01 10:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'prod-edge-02',
    description: '生产集群边缘节点，异地灾备节点',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    status: 'Ready',
    ip: '10.0.2.10',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-04-01 10:30:00',
    updateBy: 'admin',
    updateAt: '2024-06-12 11:00:00',
    resource: generateNodeResources(),
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-worker-05',
    description: '预发布集群工作节点，性能基准测试节点',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    status: 'Ready',
    ip: '192.168.2.14',
    unschedulable: false,
    createBy: 'admin',
    createAt: '2024-03-20 10:00:00',
    updateBy: 'qa',
    updateAt: '2024-05-28 16:30:00',
    resource: generateNodeResources(),
  },
]
