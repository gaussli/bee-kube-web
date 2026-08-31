/**
 * Kubernetes StorageClass 存储资源常量配置
 * @module config/kubernetes/storage/storageclass
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes'

/** StorageClass 列表页面功能元数据 */
export const STORAGECLASS_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-storageclass',
  title: '存储类',
  description:
    '存储类（StorageClass）是 Kubernetes 中用于定义存储供给方式的资源对象，描述集群可用的存储类型及其供给策略。',
}

/** StorageClass 卷绑定模式原始数据（用于派生类型） */
const _volumeBindingModes = [
  { value: 'Immediate', label: '立即绑定' },
  { value: 'WaitForFirstConsumer', label: '延迟至 Pod 首次消费时绑定' },
] as const

/** StorageClass 卷绑定模式 */
export type VolumeBindingMode = (typeof _volumeBindingModes)[number]['value']

/** StorageClass 卷绑定模式配置选项 */
export const VOLUME_BINDING_MODE_OPTIONS: Option[] = [..._volumeBindingModes]
