/**
 * PersistentVolume 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/persistentvolume/index
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'
import type {
  PersistentVolumeMode,
  PersistentVolumePhase,
  PersistentVolumeReclaimPolicy,
} from '@/config/kubernetes/storage/persistentvolume'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, ObjectMeta } from '../../types'

import type { PersistentVolumeSpec, PersistentVolumeStatusObj } from './types'

/**
 * PersistentVolume 查询条件请求对象
 */
export interface PersistentVolumeQueryForm extends UidEntity, PageForm {
  /** PersistentVolume 名称 */
  name: string
  /** PersistentVolume 状态 */
  status: PersistentVolumePhase
  /** 存储类名 */
  storageClassName: string
}

/**
 * PersistentVolume 列表项响应对象
 */
export interface PersistentVolumeListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** PersistentVolume 名称 */
  name: string
  /** PersistentVolume 描述 */
  description?: string
  /** PersistentVolume 状态 */
  status: PersistentVolumePhase
  /** PersistentVolume 状态信息 */
  statusMsg?: string
  /** 访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 回收策略 */
  persistentVolumeReclaimPolicy?: PersistentVolumeReclaimPolicy
  /** 存储类名 */
  storageClassName?: string
  /** 卷模式 */
  volumeMode?: PersistentVolumeMode
  /** 关联的 PVC 名称 */
  claimName?: string
  /** 关联的 PVC 命名空间 */
  claimNamespace?: string
}

/**
 * PersistentVolume 详情视图对象
 */
export interface PersistentVolumeDetailVo extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta {
  /** PersistentVolume 描述 */
  description?: string
  /** PersistentVolume 状态 */
  status: PersistentVolumePhase
  /** PersistentVolume 状态信息 */
  statusMsg?: string
  /** PersistentVolume Spec */
  spec: PersistentVolumeSpec
  /** PersistentVolume Status */
  statusObj: PersistentVolumeStatusObj
}

/**
 * PersistentVolume YAML 响应对象
 */
export interface PersistentVolumeYamlVo {
  /** PersistentVolume 完整 YAML 文本 */
  yaml: string
}

/**
 * PersistentVolume 创建请求对象
 */
export interface PersistentVolumeCreateForm extends ObjectMetaCreatableForm {
  /** PersistentVolume 描述 */
  description: string
  /** PersistentVolume Spec */
  spec: PersistentVolumeSpec
}

/**
 * PersistentVolume 更新请求对象
 */
export interface PersistentVolumeUpdateForm extends ObjectMetaEditableForm {
  /** PersistentVolume 描述 */
  description: string
  /** PersistentVolume Spec */
  spec: PersistentVolumeSpec
}
