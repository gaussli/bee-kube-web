/**
 * StorageClass 资源类型定义
 * @module types/kubernetes/storageClass
 */
import type { BaseEntity, PageForm } from '@/types/common'

/**
 * StorageClass 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface StorageClassResp extends BaseEntity {
  /** StorageClass 名称 */
  name: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 存储提供者 */
  provisioner: string
  /** 回收策略 */
  reclaimPolicy?: 'Retain' | 'Delete'
  /** 挂载选项 */
  mountOptions?: string[]
  /** 允许的卷绑定模式 */
  volumeBindingMode?: 'Immediate' | 'WaitForFirstConsumer'
  /** 允许的卷扩展 */
  allowVolumeExpansion?: boolean
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * StorageClass 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface StorageClassQueryReq extends PageForm {
  /** StorageClass 名称（模糊匹配） */
  name?: string
  /** 存储提供者 */
  provisioner?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * StorageClass 标签更新请求
 */
export interface StorageClassLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * StorageClass 注解更新请求
 */
export interface StorageClassAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
