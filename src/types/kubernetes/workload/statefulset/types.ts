/**
 * StatefulSet 工作负载实体类型定义
 * @module types/kubernetes/workload/statefulset/types
 */

import type {
  PodManagementPolicyType,
  StatefulSetConditionType,
  StatefulSetUpdateStrategyType,
} from '@/config/kubernetes/workload'

import type { Condition, LabelSelector, ObjectMeta } from '../../types'
import type { PodTemplateSpec } from '../types'

/**
 * StatefulSet 规格信息
 */
export interface StatefulSetSpec {
  /** 期望副本数，默认为 1 */
  replicas: number
  /** 关联的无头 Service 名称 */
  serviceName: string
  /** Pod 标签选择器，须匹配 Pod 模板的标签 */
  selector: LabelSelector
  /** Pod 管理策略，来自 `/src/config/kubernetes/workload.ts` */
  podManagementPolicy: PodManagementPolicyType
  /** 用于替换旧 Pod 的更新策略 */
  updateStrategy: StatefulSetUpdateStrategy
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 保留的旧 ControllerRevision 数量，用于回滚，默认为 10 */
  revisionHistoryLimit: number
  /** 将要创建的 Pod 模板 */
  template: PodTemplateSpec
  /** 持久卷声明模板 */
  volumeClaimTemplates: StatefulSetVolumeClaimTemplate[]
}

/**
 * StatefulSet 更新策略
 */
export interface StatefulSetUpdateStrategy {
  /** 策略类型，来自 `/src/config/kubernetes/workload.ts` */
  type: StatefulSetUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: StatefulSetRollingUpdate
}

/**
 * StatefulSet 滚动更新属性
 */
export interface StatefulSetRollingUpdate {
  /** 最大不可用副本数 */
  maxUnavailable: string | number
  /** 最大超出副本数 */
  maxSurge: string | number
}

/**
 * StatefulSet 持久卷声明模板
 */
export interface StatefulSetVolumeClaimTemplate {
  metadata: ObjectMeta
  // todo
}

/**
 * StatefulSet 状态信息
 */
export interface StatefulSetStatusObj {
  /** StatefulSet 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 匹配选择器且未终止的 Pod 总数 */
  replicas: number
  /** 匹配选择器、且处于 Ready 状态的 Pod 总数 */
  readyReplicas: number
  /** 当前版本下已就绪且匹配模板的 Pod 总数 */
  currentReplicas: number
  /** 匹配选择器、且已应用期望模板 spec 的 Pod 总数 */
  updatedReplicas: number
  /** 当前正在使用的 ControllerRevision 名称 */
  currentRevision: string
  /** 更新目标 ControllerRevision 名称 */
  updateRevision: string
  /** StatefulSet 的哈希冲突计数 */
  collisionCount: number
  /** StatefulSet 当前状态的最新观测条件列表 */
  conditions: Condition<StatefulSetConditionType>[]
}
