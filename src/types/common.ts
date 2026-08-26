/**
 * 通用类型定义
 * @module types/common
 */

import type { ExportType } from '@/config'

/**
 * 通用 API 响应结构
 * @template T - 响应数据类型
 */
export interface ApiResult<T = any> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 请求唯一标识 */
  requestId: string
}

/**
 * 分页请求参数
 */
export interface PageForm {
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 分页响应结构
 * @template T - 列表数据类型
 */
export interface PageVo<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * ID 实体
 * @remarks 包含唯一标识的实体，继承该类型
 */
export interface IdEntity {
  /** 唯一标识 */
  id: string
}

/**
 * UID 实体
 * @remarks Kubernetes 资源中包含 uid 字段的实体，继承该类型
 */
export interface UidEntity {
  /** 资源 UID */
  uid: string
}

/**
 * 审计实体
 * @remarks 包含审计信息的实体，继承该类型
 */
export interface AuditEntity {
  /** 创建时间 */
  createAt?: string
  /** 创建人 */
  createBy?: string
  /** 更新时间 */
  updateAt?: string
  /** 更新人 */
  updateBy?: string
}

/**
 * 可删除实体
 * @remarks 包含删除判断标识的实体，继承该类型
 */
export interface DeletableEntity {
  /** 是否可删除 */
  deletable: boolean
}

export interface ExportQueryForm {
  exportType?: ExportType
}
