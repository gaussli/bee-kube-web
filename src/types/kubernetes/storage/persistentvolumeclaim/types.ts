/**
 * PersistentVolumeClaim 资源实体类型定义
 * @module types/kubernetes/storage/persistentvolumeclaim/types
 */

import type { PersistentVolumeAccessMode, ResourceName } from '@/config/kubernetes/core'
import type { PersistentVolumeMode } from '@/config/kubernetes/storage/persistentvolume'
import type {
  PersistentVolumeClaimPhase,
  PersistentVolumeClaimModifyVolumeStatus,
  PersistentVolumeClaimConditionType,
  ClaimResourceStatus,
} from '@/config/kubernetes/storage/persistentvolumeclaim'

import type { Condition, LabelSelector, Quantity, TypedLocalObjectReference, TypedObjectReference } from '../../types'

/**
 * PersistentVolumeClaim 的规格定义，描述 PVC 的访问模式、容量申请与数据源。
 */
export interface PersistentVolumeClaimSpec {
  /** 访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 标签选择器，用于匹配目标 PersistentVolume */
  selector?: LabelSelector
  /** 关联的 StorageClass 名称；空字符串表示无类（延迟绑定） */
  storageClassName?: string
  /** 预绑定的 PersistentVolume 名称 */
  volumeName?: string
  /** 资源申请 */
  resources?: VolumeResourceRequirements
  /** 卷模式 */
  volumeMode?: PersistentVolumeMode
  /** 数据源引用，须为已有 PersistentVolumeClaim 或 VolumeSnapshot */
  dataSource?: TypedLocalObjectReference
  /** 数据源引用，优先于 dataSource；可跨命名空间引用（须开启 CrossNamespaceVolumeDataSource） */
  dataSourceRef?: TypedObjectReference
  /** 卷属性类名称，引用 VolumeAttributesClass；可在 PVC 创建后动态修改以调整卷运行时属性（如 CSI 磁盘性能档位），为空表示不应用 */
  volumeAttributesClassName?: string
}

/**
 * 卷资源申请，描述 PVC 的存储容量申请与上限。
 */
export interface VolumeResourceRequirements {
  /** 申请资源量，如 {storage: '10Gi'} */
  requests?: Partial<Record<ResourceName, Quantity>>
  /** 资源上限，如 {storage: '20Gi'} */
  limits?: Partial<Record<ResourceName, Quantity>>
}

/**
 * PersistentVolumeClaim 的观测状态，描述绑定阶段与扩容进度。
 */
export interface PersistentVolumeClaimStatusObj {
  /** 绑定状态 */
  phase?: PersistentVolumeClaimPhase
  /** 实际绑定的访问模式 */
  accessModes?: PersistentVolumeAccessMode[]
  /** 实际绑定的容量（资源列表），如 {storage: '10Gi'} */
  capacity?: Partial<Record<ResourceName, Quantity>>
  /** 状态条件列表 */
  conditions?: Condition<PersistentVolumeClaimConditionType>[]
  /** 已分配资源（资源列表），含容量；扩容中可大于实际容量 */
  allocatedResources?: Partial<Record<ResourceName, Quantity>>
  /** 各资源扩容状态，key 为资源名（如 storage） */
  allocatedResourceStatuses?: Record<ResourceName, ClaimResourceStatus>
  /** 当前生效的 VolumeAttributesClass 名称；为空表示未应用 */
  currentVolumeAttributesClassName?: string
  /** 卷属性变更操作状态 */
  modifyVolumeStatus?: ModifyVolumeStatus
}

/**
 * 卷属性变更操作状态，描述正在协调的 VolumeAttributesClass 变更。
 */
export interface ModifyVolumeStatus {
  /** 正在协调的目标 VolumeAttributesClass 名称 */
  targetVolumeAttributesClassName?: string
  /** 变更状态 */
  status: PersistentVolumeClaimModifyVolumeStatus
}
