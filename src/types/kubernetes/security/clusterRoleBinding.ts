/**
 * ClusterRoleBinding 资源类型定义
 * @module types/kubernetes/clusterRoleBinding
 */
import type { BaseEntity, PageForm } from '@/types/common'

/**
 * Subject 主体
 * @description 表示被绑定的主体（User、Group 或 ServiceAccount）
 */
export interface ClusterRoleBindingSubject {
  /** 主体类型（User, Group, ServiceAccount） */
  kind: 'User' | 'Group' | 'ServiceAccount'
  /** 主体名称 */
  name: string
  /** 主体所属命名空间（ServiceAccount 必须） */
  namespace?: string
  /** 主体 API 组 */
  apiGroup?: string
}

/**
 * ClusterRoleBinding 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ClusterRoleBindingResp extends BaseEntity {
  /** ClusterRoleBinding 名称 */
  name: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 是否为系统内置角色绑定 */
  isSystem?: boolean
  /** 关联的 ClusterRole 名称 */
  roleRef: {
    /** 角色类型（ClusterRole） */
    kind: 'ClusterRole'
    /** 角色名称 */
    name: string
  }
  /** 主体列表 */
  subjects: ClusterRoleBindingSubject[]
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
 * ClusterRoleBinding 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface ClusterRoleBindingQueryReq extends PageForm {
  /** ClusterRoleBinding 名称（模糊匹配） */
  name?: string
  /** 标签选择器 */
  labelSelector?: string
  /** 是否显示系统内置角色绑定 */
  showSystem?: boolean
}

/**
 * ClusterRoleBinding 创建/更新请求参数
 */
export interface ClusterRoleBindingReq {
  /** ClusterRoleBinding 名称 */
  name: string
  /** 关联的 ClusterRole 名称 */
  clusterRoleName: string
  /** 主体列表 */
  subjects: ClusterRoleBindingSubject[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * ClusterRoleBinding 标签更新请求
 */
export interface ClusterRoleBindingLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * ClusterRoleBinding 注解更新请求
 */
export interface ClusterRoleBindingAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * ClusterRoleBinding 主体更新请求
 */
export interface ClusterRoleBindingSubjectsReq {
  /** 主体列表 */
  subjects: ClusterRoleBindingSubject[]
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
