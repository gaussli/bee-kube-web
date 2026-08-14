/**
 * CronJob 资源相关类型定义
 * @module types/kubernetes/workload/cronjob
 *
 * @remarks
 * 类型分区及对象简述（按文档功能描述出现顺序排列）：
 *   1. 查看 CronJob 列表
 *      - CronJobQueryForm：CronJob 查询条件请求对象
 *      - CronJobListVo：CronJob 列表项响应对象
 *   2. 查看 CronJob 详情
 *      - CronJobDetailVo：CronJob 详情响应对象
 *   3. 查看 CronJob YAML
 *      - CronJobYamlVo：CronJob YAML 响应对象
 *   4. 查看 CronJob 关联 Job 列表
 *      - CronJobJobQueryForm：CronJob 关联 Job 查询条件请求对象
 *      - CronJobJobListVo：CronJob 关联 Job 列表项响应对象
 *   5. 查看 CronJob 监控数据
 *      - CronJobMonitorVo：CronJob 监控响应对象
 *   6. 创建
 *      - CronJobCreateForm：CronJob 创建请求对象
 *   7. 更新
 *      - CronJobUpdateForm：CronJob 更新请求对象
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { CronJobStatus } from '@/config/kubernetes/workload/cronjob'
import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { Clustered, Namespaced, ObjectMeta } from '../types'

import type { CronJobSpec, CronJobStatusObj } from './types'

/**
 * CronJob 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface CronJobQueryForm extends UidEntity, PageForm {
  /** CronJob 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** CronJob 状态 */
  status: CronJobStatus
}

/**
 * CronJob 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface CronJobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** CronJob 名称 */
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
  /** 是否已暂停 */
  suspend: boolean
}

/**
 * CronJob 详情响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface CronJobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** 状态标签 */
  status: CronJobStatus
  /** 状态信息 */
  statusMsg?: string
  /** CronJob 的资源元数据 */
  metadata: ObjectMeta
  /** CronJob 的规格定义 */
  spec: CronJobSpec
  /** CronJob 的观测状态 */
  statusObj: CronJobStatusObj
}

/**
 * CronJob YAML 响应对象
 */
export interface CronJobYamlVo {
  /** CronJob 的完整 YAML 文本 */
  yaml: string
}

/**
 * CronJob 关联 Job 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface CronJobJobQueryForm extends UidEntity, PageForm {
  /** Job 名称 */
  name: string
  /** Job 状态 */
  status: JobStatus
}

/**
 * CronJob 关联 Job 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface CronJobJobListVo extends UidEntity, AuditEntity {
  /** Job 名称 */
  name: string
  /** Job 状态 */
  status: JobStatus
  /** Job 状态信息 */
  statusMsg: string
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

/** CronJob 监控响应对象 */
export interface CronJobMonitorVo {}

/** CronJob 创建请求对象 */
export interface CronJobCreateForm {
  /** CronJob 描述 */
  description?: string
  /** CronJob 的资源元数据 */
  metadata: ObjectMeta
  /** CronJob 的规格定义 */
  spec: CronJobSpec
}

/** CronJob 更新请求对象 */
export interface CronJobUpdateForm {
  /** CronJob 描述 */
  description?: string
  /** CronJob 的资源元数据 */
  metadata: ObjectMeta
  /** CronJob 的规格定义 */
  spec: CronJobSpec
}
