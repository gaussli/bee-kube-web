/**
 * Deployment 工作负载实体类型定义
 * @module types/kubernetes/workload/deployment/types
 */

import type { Condition, LabelSelector } from '@/types/kubernetes/types'
import type { PodTemplateSpec } from '@/types/kubernetes/workload/types'

import type { DeploymentConditionType, DeploymentUpdateStrategyType } from '@/config/kubernetes/workload/deployment'

/**
 * Deployment 规格信息
 */
export interface DeploymentSpec {
  /** 期望副本数，默认为 1 */
  replicas: number
  /** Pod 标签选择器，须匹配 Pod 模板的标签 */
  selector: LabelSelector
  /** 用于替换旧 Pod 的更新策略 */
  strategy: DeploymentUpdateStrategy
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 保留的旧 ReplicaSet 数量，用于回滚，默认为 10 */
  revisionHistoryLimit: number
  /** 是否暂停部署；暂停后变更被记录但不会扩散到 Pod */
  paused: boolean
  /** 部署进度超时时间，超过则视为失败，默认为 600 */
  progressDeadlineSeconds: number
  /** 将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器 */
  template: PodTemplateSpec
}

/**
 * Deployment 更新策略
 */
export interface DeploymentUpdateStrategy {
  /** 策略类型 */
  type: DeploymentUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: DeploymentRollingUpdate
}

/**
 * Deployment 滚动更新属性
 */
export interface DeploymentRollingUpdate {
  /** 最大不可用副本数，可为整数或百分比字符串（如 '25%'） */
  maxUnavailable: string | number
  /** 最大超出副本数，可为整数或百分比字符串（如 '25%'） */
  maxSurge: string | number
}

/**
 * Deployment 状态信息
 */
export interface DeploymentStatusObj {
  /** Deployment 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 匹配选择器且未终止的 Pod 总数 */
  replicas: number
  /** 匹配选择器、且已应用期望模板 spec 的 Pod 总数 */
  updatedReplicas: number
  /** 匹配选择器、且处于 Ready 状态的 Pod 总数 */
  readyReplicas: number
  /** 匹配选择器、且至少就绪 minReadySeconds 的可用 Pod 总数 */
  availableReplicas: number
  /** 不可用 Pod 总数 */
  unavailableReplicas: number
  /** 匹配选择器且正在终止的 Pod 总数 */
  terminatingReplicas: number
  /** Deployment 当前状态的最新观测条件列表 */
  conditions: Condition<DeploymentConditionType>[]
  /** Deployment 的哈希冲突计数 */
  collisionCount: number
}
