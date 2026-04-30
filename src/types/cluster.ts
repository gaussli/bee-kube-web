// 集群管理相关类型定义

export interface ClusterResp {
  id: string
  name: string
  apiServer: string
  description: string
  status: number
  k8sVersion?: string
  createBy: string
  createAt: string
  updateBy?: string
  updateAt?: string
}

export interface ClusterQueryReq {
  id?: string
  name?: string
  status?: number
  page?: number
  pageSize?: number
}

export interface ClusterPageResp {
  list: ClusterResp[]
  total: number
}
