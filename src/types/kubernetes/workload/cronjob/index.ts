/**
 * 定时任务（CronJob）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/cronjob/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, Namespaced, ObjectMeta } from '@/types/kubernetes/types'

import type { CronJobStatus } from '@/config/kubernetes/workload/cronjob'
import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { CronJobSpec, CronJobStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface CronJobQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: CronJobStatus
}

/**
 * 列表项响应对象
 */
export interface CronJobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: CronJobStatus
  /** 状态信息 */
  statusMsg?: string
  /** Cron 调度表达式 */
  schedule: string
  /** 当前运行中的 Job 数 */
  active: number
  /** 最近一次触发时间 */
  lastScheduleTime: string
}

/**
 * 详情响应对象
 */
export interface CronJobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: CronJobStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: CronJobSpec
  /** Status */
  statusObj: CronJobStatusObj
}

/**
 * YAML 响应对象
 */
export interface CronJobYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 关联任务（Job）查询条件请求对象
 */
export interface CronJobJobQueryForm extends UidEntity, PageForm {
  /** Job 名称 */
  name: string
  /** Job 状态 */
  status: JobStatus
}

/**
 * 关联任务（Job）列表项响应对象
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
 * 监控查询请求对象
 */
export interface CronJobMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface CronJobMonitorVo {}

/**
 * 创建请求对象
 */
export interface CronJobCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: CronJobSpec
}

/**
 * 更新请求对象
 */
export interface CronJobUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: CronJobSpec
}

/**
 * 导出查询条件请求对象
 */
export interface CronJobExportQueryForm extends ExportQueryForm, CronJobQueryForm {}
