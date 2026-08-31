/**
 * DaemonSet 工作负载实体类型定义
 * @module types/kubernetes/workload/daemonset/types
 */

import type { Condition, LabelSelector } from '@/types/kubernetes/types'
import type { PodTemplateSpec } from '@/types/kubernetes/workload/types'

import type { DaemonSetConditionType, DaemonSetUpdateStrategyType } from '@/config/kubernetes/workload/daemonset'

/**
 * DaemonSet 规格信息
 */
export interface DaemonSetSpec {
  /** Pod 标签选择器，须匹配 Pod 模板的标签；DaemonSet 不支持独立 selector，其值为只读派生 */
  selector: LabelSelector
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 用于替换旧 Pod 的更新策略 */
  updateStrategy: DaemonSetUpdateStrategy
  /** 将要创建的 Pod 模板 */
  template: PodTemplateSpec
}

/**
 * DaemonSet 更新策略
 */
export interface DaemonSetUpdateStrategy {
  /** 策略类型，来自 `/src/config/kubernetes/workload.ts` */
  type: DaemonSetUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: DaemonSetRollingUpdate
}

/**
 * DaemonSet 滚动更新属性
 */
export interface DaemonSetRollingUpdate {
  /** 最大不可用副本数 */
  maxUnavailable: string | number
  /** 最大超出副本数 */
  maxSurge: string | number
}

/**
 * DaemonSet 状态信息
 */
export interface DaemonSetStatusObj {
  /** DaemonSet 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 应当在节点上调度的目标 Pod 总数 */
  desiredNumberScheduled: number
  /** 当前已调度（含运行中）的 Pod 总数 */
  currentNumberScheduled: number
  /** 处于 Ready 状态的 Pod 总数 */
  numberReady: number
  /** 至少就绪 minReadySeconds 的可用 Pod 总数 */
  numberAvailable: number
  /** 不可用 Pod 总数 */
  numberUnavailable: number
  /** 已应用期望模板 spec 的 Pod 总数 */
  updatedNumberScheduled: number
  /** DaemonSet 的哈希冲突计数 */
  collisionCount: number
  /** DaemonSet 当前状态的最新观测条件列表 */
  conditions: Condition<DaemonSetConditionType>[]
}
