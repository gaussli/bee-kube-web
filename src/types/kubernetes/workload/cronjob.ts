/**
 * CronJob 资源相关类型定义
 * @module types/kubernetes/workload/cronjob
 */
import type { BaseEntity, PageForm } from '@/types/common'

/** CronJob 状态 */
export type CronJobStatus = 'Active' | 'Suspended' | 'Unknown'

/**
 * CronJob 容器配置
 */
export interface CronJobContainer {
  /** 容器名称 */
  name: string
  /** 镜像 */
  image: string
  /** 镜像拉取策略 */
  imagePullPolicy?: string
  /** 资源请求 */
  resources?: {
    requests?: {
      cpu?: string
      memory?: string
    }
    limits?: {
      cpu?: string
      memory?: string
    }
  }
  /** 命令 */
  command?: string[]
  /** 参数 */
  args?: string[]
  /** 环境变量 */
  env?: Array<{
    name: string
    value?: string
    valueFrom?: Record<string, unknown>
  }>
}

/**
 * CronJob 列表响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface CronJobListResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属命名空间 */
  namespace: string
  /** CronJob 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: CronJobStatus
  /** 状态信息 */
  statusMsg?: string
  /** 调度表达式 */
  schedule: string
  /** 最近一次调度时间 */
  lastSuccessfulTime?: string
  /** 活动 Job 数量 */
  activeJobs: number
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * CronJob 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface CronJobDetailResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属命名空间 */
  namespace: string
  /** CronJob 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: CronJobStatus
  /** 状态信息 */
  statusMsg?: string
  /** 调度表达式 */
  schedule: string
  /** 最近一次调度时间 */
  lastSuccessfulTime?: string
  /** 活动 Job 数量 */
  activeJobs: number
  /** 是否可删除 */
  deletable?: boolean
  /** 并发策略 */
  concurrencyPolicy: 'Allow' | 'Forbid' | 'Replace'
  /** 是否暂停 */
  suspend: boolean
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 使用的镜像列表 */
  images: string[]
  /** 成功 Job 保留数 */
  successfulJobsHistoryLimit?: number
  /** 失败 Job 保留数 */
  failedJobsHistoryLimit?: number
  /** 起始截止秒数 */
  startingDeadlineSeconds?: number
  /** 容器配置列表 */
  containers: CronJobContainer[]
}

/**
 * CronJob 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface CronJobQueryReq extends PageForm {
  /** 资源 ID */
  id: string
  /** CronJob 名称（模糊匹配） */
  name: string
  /** 命名空间（可选，不传则查询所有命名空间） */
  namespace: string
  /** 状态 */
  status: CronJobStatus
}

/**
 * CronJob 创建/更新请求参数
 */
export interface CronJobReq {
  /** CronJob 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 调度表达式 */
  schedule: string
  /** 并发策略 */
  concurrencyPolicy: 'Allow' | 'Forbid' | 'Replace'
  /** 是否暂停 */
  suspend: boolean
  /** 成功 Job 保留数 */
  successfulJobsHistoryLimit?: number
  /** 失败 Job 保留数 */
  failedJobsHistoryLimit?: number
  /** 起始截止秒数 */
  startingDeadlineSeconds?: number
  /** 容器配置列表 */
  containers: CronJobContainer[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * CronJob 标签更新请求
 */
export interface CronJobLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * CronJob YAML 导入请求
 * @remarks 通过 YAML 格式导入 CronJob 配置
 */
export interface CronJobYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * CronJob 注解更新请求
 */
export interface CronJobAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
