/**
 * Deployment 资源相关类型定义
 * @module types/kubernetes/workload/deployment
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { Condition, Container, ContainerResource, Event, Metadata } from '../types'
import type { NodeAffinity, PodAffinity, PodAntiAffinity, RestartPolicy, Revision, Toleration } from './types'

/**
 * Deployment 状态枚举
 * @remarks
 * - Running: 运行中（所有 Pod 正常运行）
 * - Available: 部分就绪（至少一个副本可用，但未全部就绪）
 * - Stopped: 已停止（副本数缩容为 0）
 * - Creating: 创建中（正在创建 Pod）
 * - Updating: 更新中（正在执行滚动更新）
 * - Terminating: 终止中（正在删除）
 * - CreateTimeout: 创建超时（Pod 创建超时）
 * - UpdateTimeout: 更新超时（更新过程超时）
 * - Failed: 失败异常（创建或更新过程出现错误）
 * - Unknown: 未知状态
 */
export type DeploymentStatus = 'Running' | 'Available' | 'Stopped' | 'Creating' | 'Updating' | 'Terminating' | 'CreateTimeout' | 'UpdateTimeout' | 'Failed' | 'Unknown'

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

// ==================== 1. 列表对象 ====================

/**
 * Deployment 列表对象响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentListVo extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新策略 */
  strategyType: DeploymentStrategyType
  /** 是否可删除 */
  deletable?: boolean
}

// ==================== 2. 详情对象 ====================

/**
 * Deployment 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentDetailVo extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 更新策略 */
  strategyType: DeploymentStrategyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 容器配置列表 */
  containers: Container[]
}

// ==================== 3. 查询表单 ====================

/**
 * Deployment 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface DeploymentQueryForm extends PageReq {
  /** Deployment ID */
  id: string
  /** Deployment 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Deployment 状态 */
  status: string
}

// ==================== 4. 创建表单 ====================

/**
 * Deployment 创建请求参数
 */
export interface DeploymentCreateForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas?: number
  /** 更新策略 */
  strategy?: DeploymentStrategyType
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 5. 编辑表单 ====================

/**
 * Deployment 编辑请求参数
 */
export interface DeploymentUpdateForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas?: number
  /** 更新策略 */
  strategy?: DeploymentStrategyType
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 6. 标签表单 ====================

/**
 * Deployment 标签更新请求
 */
export interface DeploymentLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 7. 注解表单 ====================

/**
 * Deployment 注解更新请求
 */
export interface DeploymentAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 8. 其他响应对象（尾部） ====================

/**
 * Deployment 基础信息响应
 * 用于下拉选择、关联引用等场景，仅返回核心标识字段
 */
export interface DeploymentBasicVo {
  /** 资源 UID */
  uid: string
  /** 所属命名空间 */
  namespace: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: DeploymentStatus
  /** 创建时间 */
  createAt: string
}

/**
 * Deployment 概览响应
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DeploymentOverviewVo extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
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
  deletionTimestamp?: string
  /** 容器资源列表 */
  containerResources: ContainerResource[]
  /** 条件列表 */
  conditions: Condition<DeploymentConditionType>
  /** 更新策略配置 */
  strategy: {
    /** 策略类型 */
    type: DeploymentStrategyType
    /** 滚动更新参数 */
    rollingUpdate: {
      /** 最大不可用副本数（支持数字或百分比，如 "2" 或 "25%"） */
      maxUnavailable: string
      /** 最大超出副本数（支持数字或百分比，如 "2" 或 "25%"） */
      maxSurge: string
    }
  }
}

/**
 * Deployment 元数据响应
 * @extends Metadata 继承元数据类型（含 labels, annotations）
 */
export interface DeploymentMetadataVo extends Metadata {}

/**
 * Deployment 调度策略响应
 * 包含节点选择器、亲和性规则和容忍度配置
 */
export interface DeploymentScheduleVo {
  /** 节点选择器（通过节点标签筛选调度目标节点） */
  nodeSelector: Record<string, string>
  /** 亲和性规则 */
  affinity: {
    /** 节点亲和性 */
    nodeAffinity: NodeAffinity
    /** Pod 亲和性 */
    podAffinity: PodAffinity
    /** Pod 反亲和性 */
    podAntiAffinity: PodAntiAffinity
  }
  /** 容忍度配置列表 */
  tolerations: Toleration[]
}

export interface DeploymentRevisionVo extends Revision {}

/**
 * Deployment 监控响应数据
 * TODO: 待补充监控相关属性（如 CPU、内存使用率等）
 */
export interface DeploymentMonitorVo {}

/**
 * Deployment 事件响应
 * @extends Event 继承事件类型
 */
export interface DeploymentEventVo extends Event {}

/**
 * Deployment 高级配置信息
 */
export interface DeploymentAdvancedVo {
  /** 保留历史 Revision 的数量（默认 10） */
  revisionHistoryLimit: number
  /** 最小就绪等待秒数（Pod 就绪后需保持的最短时间，默认 0） */
  minReadySeconds: number
  /** 进度超时秒数（Deployment 未能完成时的最长等待时间，默认 600） */
  progressDeadlineSeconds: number
  /**
   * 重启策略
   * @remarks
   * 针对 Deployment 必须为 Always，且不可编辑
   */
  restartPolicy: RestartPolicy
  /** Pod 优雅退出时间（秒，默认 30） */
  terminationGracePeriodSeconds: number
}

// ==================== 9. 其他表单对象（尾部） ====================

/**
 * Deployment 扩缩容请求
 */
export interface DeploymentScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * Deployment YAML 导入请求
 * 通过 YAML 格式导入 Deployment 配置
 */
export interface DeploymentYamlForm {
  /** YAML 配置内容 */
  yaml: string
}
