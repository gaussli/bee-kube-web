/**
 * StorageClass 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/storageclass/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeReclaimPolicy } from '@/config/kubernetes/storage/persistentvolume'
import type { VolumeBindingMode } from '@/config/kubernetes/storage/storageclass'

import type { Clustered, ObjectMeta } from '../../types'

import type { StorageClass } from './types'

/**
 * StorageClass 查询条件请求对象
 */
export interface StorageClassQueryForm extends UidEntity, PageForm {
  /** StorageClass 名称（模糊匹配） */
  name?: string
  /** 存储提供者 */
  provisioner?: string
}

/**
 * StorageClass 列表项响应对象
 */
export interface StorageClassListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** StorageClass 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 存储提供者 */
  provisioner: string
  /** 回收策略 */
  reclaimPolicy?: PersistentVolumeReclaimPolicy
  /** 允许的卷绑定模式 */
  volumeBindingMode?: VolumeBindingMode
}

export interface StorageClassDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta, StorageClass {
  /** 描述 */
  description?: string
}

/** StorageClass YAML 响应对象 */
export interface StorageClassYamlVo {
  /** StorageClass 完整 YAML 文本 */
  yaml: string
}

/** StorageClass 创建请求对象 */
export interface StorageClassCreateForm extends StorageClass {
  /** 描述 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}

/** StorageClass 更新请求对象 */
export interface StorageClassUpdateForm extends StorageClass {
  /** 描述 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
}
