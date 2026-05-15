/**
 * @fileOverview CustomResourceDefinition 资源相关类型定义
 * @module types/kubernetes/customResourceDefinition
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * CRD 版本配置
 */
export interface CustomResourceDefinitionVersion {
  /** 版本名称 */
  name: string
  /** 是否为当前生效版本 */
  served: boolean
  /** 是否可存储 */
  storage: boolean
}

/**
 * CRD 作用域
 */
export type CustomResourceDefinitionScope = 'Namespaced' | 'Cluster'

/**
 * CRD 资源描述
 */
export interface CustomResourceDefinitionResource {
  /** 复数名称 */
  name: string
  /** 种类名称 */
  kind: string
  /** 是否为命名空间级别 */
  namespaced: boolean
  /** 版本列表 */
  versions: string[]
  /** 简短名称列表 */
  shortNames?: string[]
}

/**
 * CustomResourceDefinition 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface CustomResourceDefinitionResp extends BaseEntity {
  /** CRD ID */
  id: string
  /** CRD 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 组名称 */
  group: string
  /** 版本列表 */
  versions: CustomResourceDefinitionVersion[]
  /** 作用域 */
  scope: CustomResourceDefinitionScope
  /** 资源描述 */
  resource: CustomResourceDefinitionResource
  /** 创建时间 */
  creationTimestamp?: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * CustomResourceDefinition 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface CustomResourceDefinitionQueryReq extends PageReq {
  /** 集群 ID */
  clusterId: string
  /** CRD 名称（模糊匹配） */
  name?: string
  /** API 组 */
  group?: string
  /** 作用域 */
  scope?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * CustomResourceDefinition 标签更新请求
 */
export interface CustomResourceDefinitionLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * CustomResourceDefinition 注解更新请求
 */
export interface CustomResourceDefinitionAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
