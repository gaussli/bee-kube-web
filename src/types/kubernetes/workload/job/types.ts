/**
 * Job 工作负载实体类型定义
 * @module types/kubernetes/workload/job/types
 */

import type { Condition } from '@/types/kubernetes/types'
import type { PodTemplateSpec } from '@/types/kubernetes/workload/types'

import type { JobConditionType } from '@/config/kubernetes/workload/job'

/**
 * Job 规格信息
 */
export interface JobSpec {
  /** 并行运行的最大 Pod 数量，默认为 1 */
  parallelism: number
  /** 需要成功完成的 Pod 数量，默认为 1 */
  completions: number
  /** 失败重试次数上限，超过后 Job 标记为 Failed，默认为 6 */
  backoffLimit: number
  /** Job 在节点上可存活的最长秒数 */
  activeDeadlineSeconds: number
  /** Job 完成后保留的秒数 */
  ttlSecondsAfterFinished: number
  /** 是否暂停 Job */
  suspend: boolean
  /** 将要创建的 Pod 模板 */
  template: PodTemplateSpec
}

/**
 * Job 状态信息
 */
export interface JobStatusObj {
  /** 当前处于运行状态（非成功/失败）的 Pod 总数 */
  active: number
  /** 已成功完成的 Pod 总数 */
  succeeded: number
  /** 已失败终止的 Pod 总数 */
  failed: number
  /** Job 首次被控制器接管的开始时间 */
  startTime: string
  /** Job 完成（成功或失败）的时间 */
  completionTime: string
  /** Job 当前状态的最新观测条件列表 */
  conditions: Condition<JobConditionType>[]
}
