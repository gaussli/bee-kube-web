/**
 * Role 资源类型定义
 * @module types/kubernetes/role
 */
import type { BaseEntity, PageForm } from '@/types/common'
import type { ClusterRolePolicyRule } from './clusterRole'

/**
 * Role 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface RoleResp extends BaseEntity {
  /** Role 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 是否为系统内置角色 */
  isSystem?: boolean
  /** 策略规则列表 */
  rules: ClusterRolePolicyRule[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Role 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface RoleQueryReq extends PageForm {
  /** Role 名称（模糊匹配） */
  name?: string
  /** 标签选择器 */
  labelSelector?: string
  /** 是否显示系统内置角色 */
  showSystem?: boolean
}

/**
 * Role 创建/更新请求参数
 */
export interface RoleReq {
  /** Role 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 策略规则列表 */
  rules: ClusterRolePolicyRule[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Role 标签更新请求
 */
export interface RoleLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Role 注解更新请求
 */
export interface RoleAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Role 规则更新请求
 */
export interface RoleRulesReq {
  /** 策略规则列表 */
  rules: ClusterRolePolicyRule[]
}
