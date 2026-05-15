/**
 * Deployment 资源相关类型定义
 * @module types/deployment
 */
import type { BaseEntity, PageReq } from './common'

/**
 * Deployment 副本状态
 */
export interface DeploymentReplicaStatus {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新副本数 */
  updatedReplicas: number
}

/**
 * Deployment 容器配置
 */
export interface DeploymentContainer {
  /** 容器名称 */
  name: string
  /** 镜像 */
  image: string
  /** 镜像拉取策略 */
  imagePullPolicy: string
  /** 资源请求 */
  resources?: {
    requests?: {
      cpu?: string
      memory?: string
    }
    limits?: {
      cpu?: string
      memory?: string
    }
  }
  /** 端口配置 */
  ports?: Array<{
    name: string
    containerPort: number
    protocol: string
  }>
  /** 环境变量 */
  env?: Array<{
    name: string
    value?: string
    valueFrom?: {
      fieldRef?: {
        fieldPath: string
      }
      secretRef?: {
        name: string
        key: string
      }
      configMapRef?: {
        name: string
        key: string
      }
    }
  }>
  /** 健康检查 */
  livenessProbe?: object
  readinessProbe?: object
}

/**
 * Deployment 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentResp extends BaseEntity {
  /** Deployment ID */
  id: string
  /** Deployment 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 状态 */
  status: string
  /** 副本状态 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新策略 */
  strategy: string
  /** 使用的镜像列表 */
  images: string[]
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Deployment 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface DeploymentQueryReq extends PageReq {
  /** 命名空间 ID */
  id: string
  /** Deployment 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 集群 ID */
  clusterId: string
  /** 状态 */
  status: string
  /** 标签选择器 */
  labelSelector: string
}

/**
 * Deployment 创建/更新请求参数
 */
export interface DeploymentReq {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas: number
  /** 更新策略 */
  strategy: 'RollingUpdate' | 'Recreate'
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: DeploymentContainer[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Deployment 标签更新请求
 */
export interface DeploymentLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Deployment 注解更新请求
 */
export interface DeploymentAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Deployment 扩缩容请求
 */
export interface DeploymentScaleReq {
  /** 期望副本数 */
  replicas: number
}
