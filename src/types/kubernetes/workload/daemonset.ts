/**
 * @fileOverview DaemonSet 资源相关类型定义
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * DaemonSet 副本状态
 */
export interface DaemonSetReplicaStatus {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前副本数 */
  currentReplicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新副本数 */
  updatedReplicas: number
}

/**
 * DaemonSet 容器配置
 */
export interface DaemonSetContainer {
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
 * DaemonSet 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DaemonSetResp extends BaseEntity {
  /** DaemonSet ID */
  id: string
  /** DaemonSet 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 状态 */
  status: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前副本数 */
  currentReplicas: number
  /** 可用副本数 */
  availableReplicas: number
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
 * DaemonSet 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface DaemonSetQueryReq extends PageReq {
  /** 命名空间 ID */
  id: string
  /** DaemonSet 名称（模糊匹配） */
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
 * DaemonSet 创建/更新请求参数
 */
export interface DaemonSetReq {
  /** DaemonSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 更新策略 */
  updateStrategy: 'RollingUpdate' | 'OnDelete'
  /** 最小弹性窗口秒数 */
  minReadySeconds?: number
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: DaemonSetContainer[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * DaemonSet 标签更新请求
 */
export interface DaemonSetLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * DaemonSet 注解更新请求
 */
export interface DaemonSetAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
