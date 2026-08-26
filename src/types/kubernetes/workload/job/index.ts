/**
 * Job 工作负载页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/job/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { JobSpec, JobStatusObj } from './types'

/**
 * Job 查询条件请求对象
 */
export interface JobQueryForm extends UidEntity, PageForm {
  /** Job 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Job 状态 */
  status: JobStatus
}

/**
 * Job 列表项响应对象
 */
export interface JobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
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
 * Job 详情响应对象
 */
export interface JobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** Job 描述 */
  description?: string
  /** Job 状态 */
  status: JobStatus
  /** Job 状态信息 */
  statusMsg?: string
  /** Job Spec */
  spec: JobSpec
  /** Job Status */
  statusObj: JobStatusObj
}

/**
 * Job YAML 响应对象
 */
export interface JobYamlVo {
  /** Job 完整 YAML 文本 */
  yaml: string
}

/**
 * Job 监控查询请求对象
 */
export interface JobMonitorQueryForm {}

/**
 * Job 监控响应对象
 */
export interface JobMonitorVo {}

/**
 * Job 创建请求对象
 */
export interface JobCreateForm extends ObjectMetaCreatableForm {
  /** Job 描述 */
  description: string
  /** Job Spec */
  spec: JobSpec
}

/**
 * Job 更新请求对象
 */
export interface JobUpdateForm extends ObjectMetaEditableForm {
  /** Job 描述 */
  description: string
  /** Job Spec */
  spec: JobSpec
}
