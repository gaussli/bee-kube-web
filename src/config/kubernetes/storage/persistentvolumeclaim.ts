/**
 * Kubernetes PersistentVolumeClaim 存储资源常量配置
 * @module config/kubernetes/storage/persistentvolumeclaim
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes'

/** PersistentVolumeClaim 列表页面功能元数据 */
export const PERSISTENTVOLUMECLAIM_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-persistentvolumeclaim',
  title: '持久卷声明',
  description:
    '持久卷声明（PersistentVolumeClaim）是用户对持久卷的存储请求，支持指定容量、访问模式等存储需求，实现存储资源的动态申请与绑定。',
}

/** PersistentVolumeClaim 绑定状态类型原始数据（用于派生类型） */
const _persistentVolumeClaimPhases = [
  { value: 'Pending', label: '未绑定' },
  { value: 'Bound', label: '已绑定' },
  { value: 'Lost', label: '卷丢失' },
] as const

/** PersistentVolumeClaim 绑定状态类型 */
export type PersistentVolumeClaimPhase = (typeof _persistentVolumeClaimPhases)[number]['value']

/** PersistentVolumeClaim 绑定状态类型配置选项 */
export const PERSISTENTVOLUMECLAIM_PHASE_OPTIONS: Option[] = [..._persistentVolumeClaimPhases]

/** PersistentVolumeClaim 卷属性变更状态类型原始数据（用于派生类型） */
const _persistentVolumeClaimModifyVolumeStatuses = [
  { value: 'Pending', label: '未满足条件' },
  { value: 'InProgress', label: '变更中' },
  { value: 'Infeasible', label: '不可行' },
] as const

/** PersistentVolumeClaim 卷属性变更状态类型 */
export type PersistentVolumeClaimModifyVolumeStatus =
  (typeof _persistentVolumeClaimModifyVolumeStatuses)[number]['value']

/** PersistentVolumeClaim 卷属性变更状态类型配置选项 */
export const PERSISTENTVOLUMECLAIM_MODIFY_VOLUME_STATUS_OPTIONS: Option[] = [
  ..._persistentVolumeClaimModifyVolumeStatuses,
]

/** PersistentVolumeClaim 资源扩容状态原始数据（用于派生类型） */
const _claimResourceStatuses = [
  { value: 'ControllerResizeInProgress', label: '控制面扩容中' },
  { value: 'ControllerResizeInfeasible', label: '控制面扩容失败' },
  { value: 'NodeResizePending', label: '等待节点扩容' },
  { value: 'NodeResizeInProgress', label: '节点扩容中' },
  { value: 'NodeResizeInfeasible', label: '节点扩容失败' },
] as const

/** PersistentVolumeClaim 资源扩容状态 */
export type ClaimResourceStatus = (typeof _claimResourceStatuses)[number]['value']

/** PersistentVolumeClaim 资源扩容状态配置选项 */
export const CLAIM_RESOURCE_STATUS_OPTIONS: Option[] = [..._claimResourceStatuses]

/** PersistentVolumeClaim 状态条件类型原始数据（用于派生类型） */
const _persistentVolumeClaimConditionTypes = [
  { value: 'Resizing', label: '正在调整存储大小' },
  { value: 'FileSystemResizePending', label: '等待文件系统扩容' },
] as const

/** PersistentVolumeClaim 状态条件类型 */
export type PersistentVolumeClaimConditionType = (typeof _persistentVolumeClaimConditionTypes)[number]['value']

/** PersistentVolumeClaim 状态条件类型配置选项 */
export const PERSISTENTVOLUMECLAIM_CONDITION_TYPE_OPTIONS: Option[] = [..._persistentVolumeClaimConditionTypes]
