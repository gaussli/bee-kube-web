/**
 * CronJob 工作负载页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/cronjob/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { CronJobStatus } from '@/config/kubernetes/workload/cronjob'
import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { CronJobSpec, CronJobStatusObj } from './types'

/**
 * CronJob 查询条件请求对象
 */
export interface CronJobQueryForm extends UidEntity, PageForm {
  /** CronJob 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** CronJob 状态 */
  status: CronJobStatus
}

/**
 * CronJob 列表项响应对象
 */
export interface CronJobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** CronJob 名称 */
  name: string
  /** CronJob 描述 */
  description?: string
  /** CronJob 状态 */
  status: CronJobStatus
  /** CronJob 状态信息 */
  statusMsg?: string
  /** Cron 调度表达式 */
  schedule: string
  /** 当前运行中的 Job 数 */
  active: number
  /** 最近一次触发时间 */
  lastScheduleTime: string
}

/**
 * CronJob 详情响应对象
 */
export interface CronJobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** CronJob 描述 */
  description?: string
  /** CronJob 状态 */
  status: CronJobStatus
  /** CronJob 状态信息 */
  statusMsg?: string
  /** CronJob Spec */
  spec: CronJobSpec
  /** CronJob Status */
  statusObj: CronJobStatusObj
}

/**
 * CronJob YAML 响应对象
 */
export interface CronJobYamlVo {
  /** CronJob 完整 YAML 文本 */
  yaml: string
}

/**
 * CronJob 关联 Job 查询条件请求对象
 */
export interface CronJobJobQueryForm extends UidEntity, PageForm {
  /** Job 名称 */
  name: string
  /** Job 状态 */
  status: JobStatus
}

/**
 * CronJob 关联 Job 列表项响应对象
 */
export interface CronJobJobListVo extends UidEntity, AuditEntity {
  /** Job 名称 */
  name: string
  /** Job 描述 */
  description?: string
  /** Job 状态 */
  status: JobStatus
  /** Job 状态信息 */
  statusMsg?: string
  /** 运行中的 Pod 数 */
  active: number
  /** 已成功完成的 Pod 数 */
  succeeded: number
  /** 已失败的 Pod 数 */
  failed: number
  /** 需要成功完成的 Pod 数 */
  completions: number
  /** 并行运行的 Pod 数 */
  parallelism: number
}

/**
 * CronJob 监控查询请求对象
 */
export interface CronJobMonitorQueryForm {}

/**
 * CronJob 监控响应对象
 */
export interface CronJobMonitorVo {}

/**
 * CronJob 创建请求对象
 */
export interface CronJobCreateForm extends ObjectMetaCreatableForm {
  /** CronJob 描述 */
  description: string
  /** CronJob Spec */
  spec: CronJobSpec
}

/**
 * CronJob 更新请求对象
 */
export interface CronJobUpdateForm extends ObjectMetaEditableForm {
  /** CronJob 描述 */
  description: string
  /** CronJob Spec */
  spec: CronJobSpec
}

/**
 * CronJob 导出查询条件请求对象
 */
export interface CronJobExportQueryForm extends ExportQueryForm, CronJobQueryForm {}
