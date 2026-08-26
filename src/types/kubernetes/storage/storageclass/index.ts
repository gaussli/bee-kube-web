/**
 * 存储类（StorageClass）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/storage/storageclass/index
 */

import type { AuditEntity, DeletableEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'

import type { PersistentVolumeReclaimPolicy } from '@/config/kubernetes/storage/persistentvolume'
import type { VolumeBindingMode } from '@/config/kubernetes/storage/storageclass'

import type { ObjectMetaCreatableForm, ObjectMetaEditableForm } from '../../common'
import type { Clustered, ObjectMeta } from '../../types'

import type { StorageClass } from './types'

/**
 * 查询条件请求对象
 */
export interface StorageClassQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** 存储提供者 */
  provisioner: string
}

/**
 * 列表项响应对象
 */
export interface StorageClassListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 名称 */
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

/**
 * 详情响应对象
 */
export interface StorageClassDetailVo
  extends UidEntity, Clustered, AuditEntity, DeletableEntity, ObjectMeta, StorageClass {
  /** 描述 */
  description?: string
}

/**
 * YAML 响应对象
 */
export interface StorageClassYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 创建请求对象
 */
export interface StorageClassCreateForm extends ObjectMetaCreatableForm, StorageClass {
  /** 描述 */
  description?: string
}

/**
 * 更新请求对象
 */
export interface StorageClassUpdateForm extends ObjectMetaEditableForm, StorageClass {
  /** 描述 */
  description?: string
}

/**
 * 导出查询条件请求对象
 */
export interface StorageClassExportQueryForm extends ExportQueryForm, StorageClassQueryForm {}
