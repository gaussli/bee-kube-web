/**
 * PersistentVolume 资源实体类型定义
 * @module types/kubernetes/storage/persistentvolume/types
 */

import type { PersistentVolumeAccessMode, ResourceName } from '@/config/kubernetes/core'
import type {
  PersistentVolumeReclaimPolicy,
  PersistentVolumePhase,
  NodeSelectorOperator,
  PersistentVolumeMode,
} from '@/config/kubernetes/storage/persistentvolume'

import type { Quantity, ObjectReference } from '../../types'
import type { CSIPersistentVolumeSource, HostPathVolumeSource, LocalVolumeSource } from '../volumesource/types'

/**
 * PersistentVolume 的规格定义，描述卷的容量、访问模式与存储后端来源。
 */
export interface PersistentVolumeSpec extends PersistentVolumeSource {
  /** 存储容量，如 {storage: '20Gi'} */
  capacity?: Record<ResourceName, Quantity>
  /** 访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 回收策略 */
  persistentVolumeReclaimPolicy?: PersistentVolumeReclaimPolicy
  /** 关联的 StorageClass 名称；'' 表示无类 */
  storageClassName?: string
  /** 绑定的 PersistentVolumeClaim 引用 */
  claimRef?: ObjectReference
  /** 卷模式 */
  volumeMode?: PersistentVolumeMode
  /** 挂载选项，如 ro、noexec、soft */
  mountOptions?: string[]
  /** 节点亲和性限制；local 类型必须配置 */
  nodeAffinity?: VolumeNodeAffinity
  /** 卷属性类名称，引用 VolumeAttributesClass；为空表示不应用；需启用 VolumeAttributesClass featureGate */
  volumeAttributesClassName?: string
}

/**
 * PersistentVolume 的存储后端来源（联合类型，仅可设置其一）。
 */
export interface PersistentVolumeSource {
  /** 宿主机路径来源 */
  hostPath?: HostPathVolumeSource
  /** 节点本地存储来源 */
  local?: LocalVolumeSource
  /** CSI 驱动存储来源 */
  csi?: CSIPersistentVolumeSource
}

/**
 * 卷节点亲和性，限定卷可被调度的节点。
 */
export interface VolumeNodeAffinity {
  /** 强制匹配的节点选择器，须设置 nodeSelectorTerms 限定可调度节点 */
  required?: NodeSelector
}

/**
 * 节点选择器，通过标签/字段选择限定可调度节点。
 */
export interface NodeSelector {
  /** 节点选择器项列表，各项之间为 OR 关系 */
  nodeSelectorTerms: NodeSelectorTerm[]
}

/**
 * 节点选择器项，由匹配表达式或匹配字段组成（各项之间 AND 关系）。
 */
export interface NodeSelectorTerm {
  /** 基于节点标签的匹配条件，多个条件之间为 AND 关系 */
  matchExpressions?: NodeSelectorRequirement[]
  /** 基于节点字段的匹配条件，多个条件之间为 AND 关系 */
  matchFields?: NodeSelectorRequirement[]
}

/**
 * 节点选择器匹配条件，描述对节点标签/字段的单个匹配规则。
 */
export interface NodeSelectorRequirement {
  /** 标签或字段名 */
  key: string
  /** 操作符 */
  operator: NodeSelectorOperator
  /** 匹配值列表，当 operator 为 Gt/Lt 时只能包含一个元素 */
  values?: string[]
}

/**
 * PersistentVolume 的观测状态，描述卷的可用性与绑定阶段。
 */
export interface PersistentVolumeStatusObj {
  /** 状态 */
  phase?: PersistentVolumePhase
  /** 状态原因（通常为失败原因） */
  reason?: string
  /** 状态描述消息 */
  message?: string
  /** 最近一次 phase 切换时间 */
  lastPhaseTransitionTime?: string
}
