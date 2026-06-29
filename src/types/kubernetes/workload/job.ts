/**
 * Job 资源相关类型定义
 * @module types/kubernetes/workload/job
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * Job 状态枚举
 * @remarks
 * - Active: 运行中（任务正在执行）
 * - Succeeded: 已完成（所有 Pod 成功终止）
 * - Failed: 已失败（达到重试上限或 Pod 异常终止）
 */
export type JobStatus = 'Active' | 'Succeeded' | 'Failed'

/**
 * Job 列表对象响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface JobListResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** Job 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: JobStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望并行副本数 */
  parallelism: number
  /** 完成数 */
  completions: number
  /** 成功数 */
  succeeded: number
  /** 活动数 */
  active: number
  /** 开始时间 */
  startTime?: string
  /** 完成时间 */
  completionTime?: string
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Job 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface JobDetailResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** Job 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: JobStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望并行副本数 */
  parallelism: number
  /** 完成数 */
  completions: number
  /** 成功数 */
  succeeded: number
  /** 失败数 */
  failed: number
  /** 活动数 */
  active: number
  /** 开始时间 */
  startTime?: string
  /** 完成时间 */
  completionTime?: string
  /** 失败重试次数 */
  backoffLimit?: number
  /** 超时秒数 */
  activeDeadlineSeconds?: number
  /** 使用的镜像列表 */
  images: string[]
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 容器配置列表 */
  containers: JobContainer[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Job 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface JobQueryReq extends PageReq {
  /** 资源 ID */
  id: string
  /** Job 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 状态 */
  status: string
}

/**
 * Job 创建/更新请求参数
 */
export interface JobReq {
  /** Job 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 期望并行副本数 */
  parallelism?: number
  /** 完成数 */
  completions?: number
  /** 失败重试次数 */
  backoffLimit?: number
  /** 超时秒数 */
  activeDeadlineSeconds?: number
  /** 容器配置列表 */
  containers: JobContainer[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Job 标签更新请求
 */
export interface JobLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Job 注解更新请求
 */
export interface JobAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Job YAML 导入请求
 * @remarks 通过 YAML 格式导入 Job 配置
 */
export interface JobYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * Job 容器配置
 */
export interface JobContainer {
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
