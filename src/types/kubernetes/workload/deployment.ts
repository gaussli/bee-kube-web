/**
 * Deployment 资源相关类型定义
 * @module types/kubernetes/workload/deployment
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { Condition, Event, Metadata, Revision, WorkloadRestartPolicy } from '../types'

/**
 * Deployment 状态枚举
 * - Running: 运行中
 * - Updating: 更新中
 * - Deleting: 删除中
 * - StartTimeout: 启动超时
 * - UpdateTimeout: 更新超时
 * - Unknown: 未知
 */
export type DeploymentStatus = 'Running' | 'Updating' | 'Deleting' | 'StartTimeout' | 'UpdateTimeout' | 'Unknown'

/**
 * Deployment 条件类型枚举
 * - Available: Deployment 至少有一个可用副本
 * - Progressing: Deployment 正在处理中
 * - ReplicaFailure: Deployment 副本创建失败
 */
export type DeploymentConditionType = 'Available' | 'Progressing' | 'ReplicaFailure'

/**
 * Deployment 策略枚举
 * - RollingUpdate: 滚动更新策略（逐步替换旧版本 Pod）
 * - Recreate: 重建策略（先删除旧 Pod，再创建新 Pod）
 */
export type DeploymentStrategyType = 'RollingUpdate' | 'Recreate'

/**
 * Deployment 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 所属命名空间 */
  namespace: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 期望副本数 */
  replicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新策略 */
  strategyType: DeploymentStrategyType
  /** 使用的镜像列表 */
  images: string[]
  /** 触发删除时间 */
  detetionAt?: string
}

/**
 * Deployment 概览响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentOverviewResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 所属命名空间 */
  namespace: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 已更新副本数 */
  updatedReplicas: number
  /** 标签选择器 */
  selector: Record<string, string>
  /** 触发删除时间 */
  deletionAt?: string
  /** Pod CPU 请求 */
  podCpuRequest?: string
  /** Pod CPU 限制 */
  podCpuLimit?: string
  /** Pod 内存请求 */
  podMemoryRequest?: string
  /** Pod 内存限制 */
  podMemoryLimit?: string
  /** 条件列表 */
  conditions: Condition<DeploymentConditionType>
}

/**
 * Deployment 更新响应数据
 */
export interface DeploymentUpdateResp {
  /** 更新策略类型 */
  strategyType: DeploymentStrategyType
  /** 滚动更新配置 */
  rollingUpdate: {
    /** 最大不可用副本数 */
    maxUnavailable: string | number
    /** 最大超出副本数 */
    maxSurge: string | number
  }
  /** 修订版本列表 */
  revisions: Revision[]
}

/**
 * Deployment 监控响应数据
 * TODO: 监控属性
 */
export interface DeploymentMonitorResp {}

/**
 * Deployment 元数据更新请求
 * @extends Metadata 继承元数据类型（含 labels, annotations）
 */
export interface DeploymentMetadataResp extends Metadata {}

/**
 * Deployment 事件请求
 * @extends Event 继承事件类型
 */
export interface DeploymentEventResp extends Event {}

/**
 * Deployment 高级配置信息
 */
export interface DeploymentAdvancedResp {
  /** 历史版本数量限制 */
  revisionHistoryLimit: number
  /** 最小就绪等待秒数（Pod 就绪后需保持的最短时间） */
  minReadySeconds: number
  /** 进度超时秒数（Deployment 未能完成时的最长等待时间） */
  progressDeadlineSeconds: number
  /** 重启策略 */
  restartPolicy: WorkloadRestartPolicy
}

/**
 * Deployment 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface DeploymentQueryReq extends PageReq {
  /** 命名空间 ID */
  id?: string
  /** Deployment 名称（模糊匹配） */
  name?: string
  /** 命名空间名称 */
  namespace?: string
  /** 集群 ID */
  clusterId?: string
  /** 状态 */
  status?: string
  /** 标签选择器 */
  labelSelector?: string
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
  replicas?: number
  /** 更新策略 */
  strategy?: 'RollingUpdate' | 'Recreate'
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 容器配置列表 */
  containers?: DeploymentContainer[]
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

/**
 * Deployment YAML 导入请求
 * 通过 YAML 格式导入 Deployment 配置
 */
export interface DeploymentYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

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
  /** 已更新副本数 */
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
  imagePullPolicy?: 'Always' | 'Never' | 'IfNotPresent'
  /** 资源请求/限制 */
  resources?: {
    /** 请求资源 */
    requests?: {
      /** CPU 请求 */
      cpu?: string
      /** 内存请求 */
      memory?: string
    }
    /** 限制资源 */
    limits?: {
      /** CPU 限制 */
      cpu?: string
      /** 内存限制 */
      memory?: string
    }
  }
  /** 端口配置列表 */
  ports?: Array<{
    /** 端口名称 */
    name: string
    /** 容器端口 */
    containerPort: number
    /** 协议 */
    protocol: string
  }>
  /** 环境变量列表 */
  env?: Array<{
    /** 变量名称 */
    name: string
    /** 变量值 */
    value?: string
    /** 值来源 */
    valueFrom?: {
      /** 字段引用 */
      fieldRef?: {
        /** 字段路径 */
        fieldPath: string
      }
      /** Secret 引用 */
      secretRef?: {
        /** Secret 名称 */
        name: string
        /** Key */
        key: string
      }
      /** ConfigMap 引用 */
      configMapRef?: {
        /** ConfigMap 名称 */
        name: string
        /** Key */
        key: string
      }
    }
  }>
  /** 存活探针 */
  livenessProbe?: object
  /** 就绪探针 */
  readinessProbe?: object
}
