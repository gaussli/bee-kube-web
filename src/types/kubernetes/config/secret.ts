/**
 * @fileOverview Secret 资源相关类型定义
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * Secret 类型枚举
 */
export type SecretType = 'Opaque' | 'kubernetes.io/service-account-token' | 'kubernetes.io/dockercfg' | 'kubernetes.io/dockerconfigjson' | 'kubernetes.io/basic-auth' | 'kubernetes.io/ssh-auth' | 'kubernetes.io/tls' | 'kubernetes.io/boot-straph-token'

/**
 * Secret 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface SecretResp extends BaseEntity {
  /** Secret ID */
  id: string
  /** Secret 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** Secret 类型 */
  type: SecretType
  /** 数据键值对（base64 编码） */
  data?: Record<string, string>
  /** 字符串数据（未编码） */
  stringData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 引用数 */
  refs?: string[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Secret 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface SecretQueryReq extends PageReq {
  /** 命名空间 ID */
  id: string
  /** Secret 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 集群 ID */
  clusterId: string
  /** Secret 类型 */
  type: SecretType
  /** 标签选择器 */
  labelSelector: string
}

/**
 * Secret 创建/更新请求参数
 */
export interface SecretReq {
  /** Secret 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Secret 类型 */
  type: SecretType
  /** 数据键值对（base64 编码） */
  data?: Record<string, string>
  /** 字符串数据（未编码） */
  stringData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Secret 数据更新请求
 */
export interface SecretDataReq {
  /** 数据键值对 */
  data: Record<string, string>
  /** 操作（1: 新增/更新；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Secret 标签更新请求
 */
export interface SecretLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Secret 注解更新请求
 */
export interface SecretAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
