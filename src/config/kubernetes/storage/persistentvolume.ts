/**
 * Kubernetes PersistentVolume 存储资源常量配置
 * @module config/kubernetes/storage/persistentvolume
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes/common'

/** PersistentVolume 列表页面功能元数据 */
export const PERSISTENTVOLUME_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-persistentvolume',
  title: '持久卷',
  description:
    '持久卷（PersistentVolume）是 Kubernetes 集群中管理员预先配置的存储资源，独立于 Pod 生命周期，为应用提供持久化存储能力。',
}

/** PersistentVolume 回收策略原始数据（用于派生类型） */
const _persistentVolumeReclaimPolicies = [
  { value: 'Delete', label: '删除' },
  { value: 'Retain', label: '保留' },
  { value: 'Recycle', label: '清理复用（已废弃）' },
] as const

/** PersistentVolume 回收策略 */
export type PersistentVolumeReclaimPolicy = (typeof _persistentVolumeReclaimPolicies)[number]['value']

/** PersistentVolume 回收策略配置选项 */
export const PERSISTENTVOLUME_RECLAIM_POLICY_OPTIONS: Option[] = [..._persistentVolumeReclaimPolicies]

/** PersistentVolume 卷模式原始数据（用于派生类型） */
const _persistentVolumeModes = [
  { value: 'Block', label: '块设备' },
  { value: 'Filesystem', label: '文件系统' },
] as const

/** PersistentVolume 卷模式 */
export type PersistentVolumeMode = (typeof _persistentVolumeModes)[number]['value']

/** PersistentVolume 卷模式配置选项 */
export const PERSISTENTVOLUME_MODE_OPTIONS: Option[] = [..._persistentVolumeModes]

/** 节点选择器匹配运算符原始数据（用于派生类型） */
const _nodeSelectorOperators = [
  { value: 'In', label: '包含' },
  { value: 'NotIn', label: '不包含' },
  { value: 'Exists', label: '存在' },
  { value: 'DoesNotExist', label: '不存在' },
  { value: 'Gt', label: '大于' },
  { value: 'Lt', label: '小于' },
] as const

/** 节点选择器匹配运算符 */
export type NodeSelectorOperator = (typeof _nodeSelectorOperators)[number]['value']

/** 节点选择器匹配运算符配置选项 */
export const NODE_SELECTOR_OPERATOR_OPTIONS: Option[] = [..._nodeSelectorOperators]

/** PersistentVolume 存储状态类型原始数据（用于派生类型） */
const _persistentVolumePhases = [
  { value: 'Pending', label: '未就绪' },
  { value: 'Available', label: '可用' },
  { value: 'Bound', label: '已绑定' },
  { value: 'Released', label: '已释放' },
  { value: 'Failed', label: '失败' },
] as const

/** PersistentVolume 存储状态类型 */
export type PersistentVolumePhase = (typeof _persistentVolumePhases)[number]['value']

/** PersistentVolume 存储状态类型配置选项 */
export const PERSISTENTVOLUME_PHASE_OPTIONS: Option[] = [..._persistentVolumePhases]
