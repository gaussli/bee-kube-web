/**
 * PersistentVolume 资源类型定义
 * @module types/kubernetes/persistentVolume
 */
import type { AuditEntity, PageForm } from '@/types/common'

/**
 * PersistentVolume 访问模式
 */
export type PersistentVolumeAccessMode = 'ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany'

/**
 * PersistentVolume 状态
 */
export type PersistentVolumePhase = 'Pending' | 'Available' | 'Bound' | 'Released' | 'Failed'

/**
 * PersistentVolume 响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface PersistentVolumeResp extends AuditEntity {
  /** PersistentVolume 名称 */
  name: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 状态 */
  status: PersistentVolumePhase
  /** 容量 */
  capacity?: {
    storage: string
  }
  /** 访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 存储类名 */
  storageClassName?: string
  /** 回收策略 */
  reclaimPolicy?: 'Retain' | 'Delete' | 'Recycle'
  /** 卷模式 */
  volumeMode?: 'Filesystem' | 'Block'
  /** 关联的 PVC 名称 */
  claimName?: string
  /** 关联的 PVC 命名空间 */
  claimNamespace?: string
  /** NFS 配置（如果有） */
  nfs?: {
    server: string
    path: string
  }
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * PersistentVolume 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface PersistentVolumeQueryReq extends PageForm {
  /** PersistentVolume 名称（模糊匹配） */
  name?: string
  /** 状态 */
  status?: string
  /** 存储类名 */
  storageClassName?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * PersistentVolume 标签更新请求
 */
export interface PersistentVolumeLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * PersistentVolume 注解更新请求
 */
export interface PersistentVolumeAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
