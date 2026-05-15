/**
 * @fileOverview 通用类型定义
 */

/**
 * 通用响应结构
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
export interface PageReq {
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 分页响应结构
 */
export interface PageResp<T = any> {
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
 * 基础实体
 */
export interface BaseEntity {
  /** 唯一标识 */
  id: string
  /** 创建时间 */
  createAt?: string
  /** 创建人 */
  createBy?: string
  /** 更新时间 */
  updateAt?: string
  /** 更新人 */
  updateBy?: string
}
