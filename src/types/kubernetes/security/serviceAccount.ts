/**
 * @fileOverview ServiceAccount 资源相关类型定义
 * @module types/kubernetes/serviceAccount
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * ServiceAccount 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ServiceAccountResp extends BaseEntity {
  /** ServiceAccount ID */
  id: string
  /** ServiceAccount 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 关联的 Secret 列表 */
  secrets: Array<{
    name: string
    namespace: string
  }>
  /** 关联的镜像拉取 Secret 列表 */
  imagePullSecrets: Array<{
    name: string
  }>
  /** 是否已自动挂载 API 凭证 */
  automountServiceAccountToken?: boolean
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * ServiceAccount 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface ServiceAccountQueryReq extends PageReq {
  /** 命名空间 ID */
  id: string
  /** ServiceAccount 名称（模糊匹配） */
  name?: string
  /** 命名空间名称 */
  namespace?: string
  /** 集群 ID */
  clusterId: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * ServiceAccount 创建/更新请求参数
 */
export interface ServiceAccountReq {
  /** ServiceAccount 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 关联的镜像拉取 Secret 列表 */
  imagePullSecrets?: string[]
  /** 是否自动挂载 API 凭证 */
  automountServiceAccountToken?: boolean
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * ServiceAccount 标签更新请求
 */
export interface ServiceAccountLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * ServiceAccount 注解更新请求
 */
export interface ServiceAccountAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * ServiceAccount 镜像拉取密钥更新请求
 */
export interface ServiceAccountImagePullSecretsReq {
  /** 镜像拉取密钥名称列表 */
  imagePullSecrets: string[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
