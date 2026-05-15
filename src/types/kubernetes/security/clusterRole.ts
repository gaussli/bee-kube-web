/**
 * @fileOverview ClusterRole 资源相关类型定义
 * @module types/kubernetes/clusterRole
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * 聚合策略类型
 * @description 用于 ClusterRole 的聚合，将子 ClusterRole 的规则合并到父角色
 */
export type ClusterRoleAggregationRule = {
  /** 聚合的 ClusterRole 标签选择器 */
  clusterRoleSelectors?: Array<{
    /** 匹配表达式类型 */
    matchExpressions?: Array<{
      key: string
      operator: string
      values?: string[]
    }>
    /** 匹配标签 */
    matchLabels?: Record<string, string>
  }>
}

/**
 * PolicyRule 策略规则
 * @description 定义一组允许或拒绝的 API 资源操作
 */
export interface ClusterRolePolicyRule {
  /** API 组列表 */
  apiGroups: string[]
  /** 资源列表 */
  resources: string[]
  /** 动词列表（如 get, list, watch, create, update, patch, delete） */
  verbs: string[]
  /** 资源名称列表（可选，用于精确指定） */
  resourceNames?: string[]
  /** 非资源型 URL（用于 /api, /healthz 等） */
  nonResourceURLs?: string[]
}

/**
 * ClusterRole 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ClusterRoleResp extends BaseEntity {
  /** ClusterRole ID */
  id: string
  /** ClusterRole 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 是否为系统内置角色 */
  isSystem?: boolean
  /** 聚合策略 */
  aggregationRule?: ClusterRoleAggregationRule
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
 * ClusterRole 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface ClusterRoleQueryReq extends PageReq {
  /** 集群 ID */
  clusterId: string
  /** ClusterRole 名称（模糊匹配） */
  name?: string
  /** 标签选择器 */
  labelSelector?: string
  /** 是否显示系统内置角色 */
  showSystem?: boolean
}

/**
 * ClusterRole 创建/更新请求参数
 */
export interface ClusterRoleReq {
  /** ClusterRole 名称 */
  name: string
  /** 聚合策略 */
  aggregationRule?: ClusterRoleAggregationRule
  /** 策略规则列表 */
  rules: ClusterRolePolicyRule[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * ClusterRole 标签更新请求
 */
export interface ClusterRoleLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * ClusterRole 注解更新请求
 */
export interface ClusterRoleAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * ClusterRole 规则更新请求
 */
export interface ClusterRoleRulesReq {
  /** 策略规则列表 */
  rules: ClusterRolePolicyRule[]
}
