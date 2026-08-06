/**
 * RoleBinding 资源类型定义
 * @module types/kubernetes/roleBinding
 */
import type { AuditEntity, PageForm } from '@/types/common'

import type { ClusterRoleBindingSubject } from './clusterRoleBinding'

/**
 * RoleBinding 响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface RoleBindingResp extends AuditEntity {
  /** RoleBinding 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 是否为系统内置角色绑定 */
  isSystem?: boolean
  /** 关联的角色引用 */
  roleRef: {
    /** 角色类型（Role 或 ClusterRole） */
    kind: 'Role' | 'ClusterRole'
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
 * RoleBinding 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface RoleBindingQueryReq extends PageForm {
  /** RoleBinding 名称（模糊匹配） */
  name?: string
  /** 标签选择器 */
  labelSelector?: string
  /** 是否显示系统内置角色绑定 */
  showSystem?: boolean
}

/**
 * RoleBinding 创建/更新请求参数
 */
export interface RoleBindingReq {
  /** RoleBinding 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 关联的角色类型 */
  roleKind: 'Role' | 'ClusterRole'
  /** 关联的角色名称 */
  roleName: string
  /** 主体列表 */
  subjects: ClusterRoleBindingSubject[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * RoleBinding 标签更新请求
 */
export interface RoleBindingLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * RoleBinding 注解更新请求
 */
export interface RoleBindingAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * RoleBinding 主体更新请求
 */
export interface RoleBindingSubjectsReq {
  /** 主体列表 */
  subjects: ClusterRoleBindingSubject[]
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
