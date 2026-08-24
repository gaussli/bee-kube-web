/**
 * PersistentVolumeClaim 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/persistentvolumeclaim/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'
import type { PersistentVolumeMode } from '@/config/kubernetes/storage/persistentvolume'
import type { PersistentVolumeClaimPhase } from '@/config/kubernetes/storage/persistentvolumeclaim'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta, Quantity } from '../../types'

import type { PersistentVolumeClaimSpec, PersistentVolumeClaimStatusObj } from './types'

/**
 * PersistentVolumeClaim 查询条件请求对象
 */
export interface PersistentVolumeClaimQueryForm extends UidEntity, PageForm {
  /** PersistentVolumeClaim 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** PersistentVolumeClaim 状态 */
  status: PersistentVolumeClaimPhase
  /** 存储类名 */
  storageClassName: string
}

/**
 * PersistentVolumeClaim 列表项响应对象
 */
export interface PersistentVolumeClaimListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** PersistentVolumeClaim 名称 */
  name: string
  /** PersistentVolumeClaim 描述 */
  description?: string
  /** PersistentVolumeClaim 状态 */
  status: PersistentVolumeClaimPhase
  /** PersistentVolumeClaim 状态信息 */
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
  /** 实际分配的存储大小 */
  capacityStorage: Quantity
}

/**
 * PersistentVolumeClaim 详情视图对象
 */
export interface PersistentVolumeClaimDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** PersistentVolumeClaim 描述 */
  description?: string
  /** PersistentVolumeClaim 状态 */
  status: PersistentVolumeClaimPhase
  /** PersistentVolumeClaim 状态信息 */
  statusMsg?: string
  /** PersistentVolumeClaim Spec */
  spec: PersistentVolumeClaimSpec
  /** PersistentVolumeClaim Status */
  statusObj: PersistentVolumeClaimStatusObj
}

/**
 * PersistentVolumeClaim YAML 响应对象
 */
export interface PersistentVolumeClaimYamlVo {
  /** PersistentVolumeClaim 完整 YAML 文本 */
  yaml: string
}

/**
 * PersistentVolumeClaim 创建请求对象
 */
export interface PersistentVolumeClaimCreateForm extends ObjectMetaCreatableForm {
  /** PersistentVolumeClaim 描述 */
  description: string
  /** PersistentVolumeClaim Spec */
  spec: PersistentVolumeClaimSpec
}

/**
 * PersistentVolumeClaim 更新请求对象
 */
export interface PersistentVolumeClaimUpdateForm extends ObjectMetaEditableForm {
  /** PersistentVolumeClaim 描述 */
  description: string
  /** PersistentVolumeClaim Spec */
  spec: PersistentVolumeClaimSpec
}
