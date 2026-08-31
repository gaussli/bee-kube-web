/**
 * 持久卷（PersistentVolume）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/persistentvolume/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '@/types/kubernetes/index'
import type { Clustered, NonNamespaceObjectMeta } from '@/types/kubernetes/types'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'
import type {
  PersistentVolumeMode,
  PersistentVolumePhase,
  PersistentVolumeReclaimPolicy,
} from '@/config/kubernetes/storage/persistentvolume'

import type { PersistentVolumeSpec, PersistentVolumeStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface PersistentVolumeQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** 状态 */
  status: PersistentVolumePhase
  /** 存储类名 */
  storageClassName: string
}

/**
 * 列表项响应对象
 */
export interface PersistentVolumeListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: PersistentVolumePhase
  /** 状态信息 */
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
 * 详情响应对象
 */
export interface PersistentVolumeDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, NonNamespaceObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: PersistentVolumePhase
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: PersistentVolumeSpec
  /** Status */
  statusObj: PersistentVolumeStatusObj
}

/**
 * YAML 响应对象
 */
export interface PersistentVolumeYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface PersistentVolumeCreateForm extends ObjectMetaCreatableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: PersistentVolumeSpec
}

/**
 * 更新请求对象
 */
export interface PersistentVolumeUpdateForm extends ObjectMetaEditableForm {
  /** 描述 */
  description?: string
  /** Spec */
  spec: PersistentVolumeSpec
}

/**
 * 导出查询条件请求对象
 */
export interface PersistentVolumeExportQueryForm extends ExportQueryForm, PersistentVolumeQueryForm {}
