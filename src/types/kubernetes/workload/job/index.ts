/**
 * 任务（Job）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/workload/job/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta } from '../../types'

import type { JobSpec, JobStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface JobQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: JobStatus
}

/**
 * 列表项响应对象
 */
export interface JobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: JobStatus
  /** 状态信息 */
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
 * 详情响应对象
 */
export interface JobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: JobStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: JobSpec
  /** Status */
  statusObj: JobStatusObj
}

/**
 * YAML 响应对象
 */
export interface JobYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 监控查询请求对象
 */
export interface JobMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface JobMonitorVo {}

/**
 * 创建请求对象
 */
export interface JobCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: JobSpec
}

/**
 * 更新请求对象
 */
export interface JobUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: JobSpec
}

/**
 * 导出查询条件请求对象
 */
export interface JobExportQueryForm extends ExportQueryForm, JobQueryForm {}
