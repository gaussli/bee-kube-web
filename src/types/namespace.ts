// 命名空间管理相关类型定义

export interface NamespaceResp {
  id: string
  name: string
  clusterId: string
  clusterName?: string
  status: string
  phase: string
  labels?: Record<string, string>
  annotations?: Record<string, string>
  createAt: string
}

export interface NamespaceQueryReq {
  id?: string
  name?: string
  clusterId?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface NamespacePageResp {
  list: NamespaceResp[]
  total: number
}

export interface NamespaceCreateReq {
  name: string
  clusterId: string
  labels?: Record<string, string>
  annotations?: Record<string, string>
}

export interface NamespaceEditReq {
  labels?: Record<string, string>
  annotations?: Record<string, string>
}
