/**
 * 持久卷声明（PersistentVolumeClaim）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/persistentvolumeclaim/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'
import type { PersistentVolumeMode } from '@/config/kubernetes/storage/persistentvolume'
import type { PersistentVolumeClaimPhase } from '@/config/kubernetes/storage/persistentvolumeclaim'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, Namespaced, ObjectMeta, Quantity } from '../../types'

import type { PersistentVolumeClaimSpec, PersistentVolumeClaimStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface PersistentVolumeClaimQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: PersistentVolumeClaimPhase
  /** 存储类名 */
  storageClassName: string
}

/**
 * 列表项响应对象
 */
export interface PersistentVolumeClaimListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 名称 */
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
  /** 实际分配的存储大小 */
  capacityStorage: Quantity
}

/**
 * 详情响应对象
 */
export interface PersistentVolumeClaimDetailVo
  extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: PersistentVolumeClaimPhase
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: PersistentVolumeClaimSpec
  /** Status */
  statusObj: PersistentVolumeClaimStatusObj
}

/**
 * YAML 响应对象
 */
export interface PersistentVolumeClaimYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface PersistentVolumeClaimCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: PersistentVolumeClaimSpec
}

/**
 * 更新请求对象
 */
export interface PersistentVolumeClaimUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: PersistentVolumeClaimSpec
}

/**
 * 导出查询条件请求对象
 */
export interface PersistentVolumeClaimExportQueryForm extends ExportQueryForm, PersistentVolumeClaimQueryForm {}
