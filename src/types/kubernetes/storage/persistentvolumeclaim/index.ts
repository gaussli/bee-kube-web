/**
 * PersistentVolumeClaim 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/persistentvolumeclaim/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'
import type { PersistentVolumeMode } from '@/config/kubernetes/storage/persistentvolume'
import type { PersistentVolumeClaimPhase } from '@/config/kubernetes/storage/persistentvolumeclaim'

import type { Clustered, Namespaced, ObjectMeta, Quantity } from '../../types'

import type { PersistentVolumeClaimSpec, PersistentVolumeClaimStatusObj } from './types'

/**
 * PersistentVolumeClaim 查询条件请求对象
 */
export interface PersistentVolumeClaimQueryForm extends UidEntity, PageForm {
  /** PersistentVolumeClaim 名称（模糊匹配） */
  name?: string
  /** 状态 */
  status?: PersistentVolumeClaimPhase
  /** 存储类名 */
  storageClassName?: string
}

/**
 * PersistentVolumeClaim 列表项响应对象
 */
export interface PersistentVolumeClaimListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** PersistentVolumeClaim 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: PersistentVolumeClaimPhase
  /** 状态信息 */
  statusMsg?: string
  /** 访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 存储类名 */
  storageClassName?: string
  /** 卷模式 */
  volumeMode?: PersistentVolumeMode
  /** 已绑定的 PV 名称 */
  volumeName?: string
  /** 请求的存储大小 */
  requestStorage: Quantity
  capacityStorage: Quantity
}

export interface PersistentVolumeClaimDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: PersistentVolumeClaimPhase
  /** 状态信息 */
  statusMsg?: string
  spec: PersistentVolumeClaimSpec
  statusObj: PersistentVolumeClaimStatusObj
}

/** PersistentVolumeClaim YAML 响应对象 */
export interface PersistentVolumeClaimYamlVo {
  /** PersistentVolumeClaim 完整 YAML 文本 */
  yaml: string
}

/** PersistentVolumeClaim 创建请求对象 */
export interface PersistentVolumeClaimCreateForm {
  /** 描述 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: PersistentVolumeClaimSpec
}

/** PersistentVolumeClaim 更新请求对象 */
export interface PersistentVolumeClaimUpdateForm {
  /** 描述 */
  description?: string
  /** 元数据（含名称、命名空间、标签等） */
  metadata: ObjectMeta
  spec: PersistentVolumeClaimSpec
}
