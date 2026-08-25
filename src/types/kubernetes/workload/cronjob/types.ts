/**
 * CronJob 工作负载实体类型定义
 * @module types/kubernetes/workload/cronjob/types
 */

import type { ConcurrencyPolicy, CronJobConditionType } from '@/config/kubernetes/workload/cronjob'

import type { Condition, Metadata } from '../../types'
import type { JobSpec } from '../job/types'

/**
 * CronJob 规格信息
 */
export interface CronJobSpec {
  /** Cron 调度表达式 */
  schedule: string
  /** 并发策略，来自 `/src/config/kubernetes/workload.ts` */
  concurrencyPolicy: ConcurrencyPolicy
  /** 调度错过后的最晚启动宽限秒数 */
  startingDeadlineSeconds?: number
  /** 是否暂停 CronJob */
  suspend: boolean
  /** 调度时区名称，如 'Asia/Shanghai'，为空时采用控制器进程时区 */
  timeZone?: string
  /** 保留的成功 Job 历史数量上限，默认为 3 */
  successfulJobsHistoryLimit: number
  /** 保留的失败 Job 历史数量上限，默认为 1 */
  failedJobsHistoryLimit: number
  /** 每次触发所创建的 Job 模板 */
  jobTemplate: JobTemplateSpec
}

/**
 * Job 模板
 */
export interface JobTemplateSpec {
  /** Job 模板的元数据 */
  metadata: Metadata
  /** Job 的规格定义 */
  spec: JobSpec
}

/**
 * CronJob 状态信息
 */
export interface CronJobStatusObj {
  /** 当前正在运行的 Job 总数 */
  active: number
  /** 最近一次成功触发 Job 的时间 */
  lastScheduleTime: string
  /** 最近一次成功完成 Job 的时间 */
  lastSuccessfulTime: string
  /** CronJob 当前状态的最新观测条件列表 */
  conditions: Condition<CronJobConditionType>[]
}
