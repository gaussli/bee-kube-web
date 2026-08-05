/**
 * PersistentVolumeClaim 资源类型定义
 * @module types/kubernetes/persistentVolumeClaim
 */
import type { BaseEntity, PageForm } from '@/types/common'

/**
 * PersistentVolumeClaim 访问模式
 */
export type PersistentVolumeClaimAccessMode = 'ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany'

/**
 * PersistentVolumeClaim 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface PersistentVolumeClaimResp extends BaseEntity {
  /** PersistentVolumeClaim 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 状态 */
  status: 'Pending' | 'Bound' | 'Lost'
  /** 请求的存储大小 */
  requestStorage: string
  /** 已绑定的 PV 名称 */
  volumeName?: string
  /** 存储类名 */
  storageClassName?: string
  /** 访问模式 */
  accessModes?: PersistentVolumeClaimAccessMode[]
  /** 卷模式 */
  volumeMode?: 'Filesystem' | 'Block'
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * PersistentVolumeClaim 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface PersistentVolumeClaimQueryReq extends PageForm {
  /** PersistentVolumeClaim 名称（模糊匹配） */
  name?: string
  /** 状态 */
  status?: string
  /** 存储类名 */
  storageClassName?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * PersistentVolumeClaim 创建/更新请求参数
 */
export interface PersistentVolumeClaimReq {
  /** PersistentVolumeClaim 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 存储类名 */
  storageClassName?: string
  /** 访问模式 */
  accessModes?: PersistentVolumeClaimAccessMode[]
  /** 请求的存储大小 */
  requestStorage: string
  /** 卷模式 */
  volumeMode?: 'Filesystem' | 'Block'
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * PersistentVolumeClaim 标签更新请求
 */
export interface PersistentVolumeClaimLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * PersistentVolumeClaim 注解更新请求
 */
export interface PersistentVolumeClaimAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
