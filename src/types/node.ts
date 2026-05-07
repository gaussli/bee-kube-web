// 节点管理相关类型定义

export interface NodeResp {
  id: string
  name: string
  clusterId: string
  clusterName?: string
  status: string
  roles: string[]
  version: string
  os: string
  architecture: string
  internalIp: string
  cpu: string
  memory: string
  pods: string
  createAt: string
  allocatedCpu?: string
  allocatedMemory?: string
  labels?: Record<string, string>
  annotations?: Record<string, string>
  schedulable?: boolean
}

export interface NodeQueryReq {
  id?: string
  name?: string
  ip?: string
  clusterId?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface NodePageResp {
  list: NodeResp[]
  total: number
}

export interface NodeEditReq {
  labels?: Record<string, string>
  annotations?: Record<string, string>
  taints?: Array<{
    key: string
    value: string
    effect: string
  }>
}
