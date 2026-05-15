// 工作负载管理相关类型定义

// Deployment
export interface DeploymentResp {
  id: string
  name: string
  namespace: string
  clusterId: string
  clusterName?: string
  status: string
  replicas: number
  readyReplicas: number
  availableReplicas: number
  strategy: string
  images: string[]
  labels?: Record<string, string>
  annotations?: Record<string, string>
  createAt: string
  updateAt?: string
  deletable?: boolean
}

export interface DeploymentQueryReq {
  id?: string
  name?: string
  namespace?: string
  clusterId?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface DeploymentPageResp {
  list: DeploymentResp[]
  total: number
}

// StatefulSet
export interface StatefulSetResp {
  id: string
  name: string
  namespace: string
  clusterId: string
  clusterName?: string
  replicas: number
  readyReplicas: number
  serviceName: string
  selector: Record<string, string>
  labels?: Record<string, string>
  createAt: string
}

export interface StatefulSetQueryReq {
  id?: string
  name?: string
  namespace?: string
  clusterId?: string
  page?: number
  pageSize?: number
}

export interface StatefulSetPageResp {
  list: StatefulSetResp[]
  total: number
}

// DaemonSet
export interface DaemonSetResp {
  id: string
  name: string
  namespace: string
  clusterId: string
  clusterName?: string
  desiredNumberScheduled: number
  numberReady: number
  numberAvailable: number
  selector: Record<string, string>
  labels?: Record<string, string>
  createAt: string
}

export interface DaemonSetQueryReq {
  id?: string
  name?: string
  namespace?: string
  clusterId?: string
  page?: number
  pageSize?: number
}

export interface DaemonSetPageResp {
  list: DaemonSetResp[]
  total: number
}

// Job
export interface JobResp {
  id: string
  name: string
  namespace: string
  clusterId: string
  clusterName?: string
  parallelism: number
  completions: number
  active: number
  succeeded: number
  failed: number
  startTime?: string
  completionTime?: string
  labels?: Record<string, string>
  createAt: string
}

export interface JobQueryReq {
  id?: string
  name?: string
  namespace?: string
  clusterId?: string
  page?: number
  pageSize?: number
}

export interface JobPageResp {
  list: JobResp[]
  total: number
}

// CronJob
export interface CronJobResp {
  id: string
  name: string
  namespace: string
  clusterId: string
  clusterName?: string
  schedule: string
  suspend: boolean
  active: number
  lastScheduleTime?: string
  labels?: Record<string, string>
  createAt: string
}

export interface CronJobQueryReq {
  id?: string
  name?: string
  namespace?: string
  clusterId?: string
  page?: number
  pageSize?: number
}

export interface CronJobPageResp {
  list: CronJobResp[]
  total: number
}
