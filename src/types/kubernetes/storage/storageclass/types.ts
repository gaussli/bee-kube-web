import type { PersistentVolumeReclaimPolicy } from '@/config/kubernetes/storage/persistentvolume'
import type { VolumeBindingMode } from '@/config/kubernetes/storage/storageclass'

/**
 * StorageClass 资源实体类型定义
 * @module types/kubernetes/storage/storageclass/types
 */
export interface StorageClass {
  /** 存储供应器标识（如 kubernetes.io/aws-ebs），决定由哪个外部供应器创建底层卷 */
  provisioner: string
  /** 传递给供应器的参数，因供应器而异 */
  parameters?: Record<string, string>
  /** 由该 StorageClass 创建卷的默认回收策略 */
  reclaimPolicy?: PersistentVolumeReclaimPolicy
  /** 由该 StorageClass 创建卷的默认挂载选项 */
  mountOptions?: string[]
  /** 是否允许通过编辑 PVC 扩大卷容量，默认 false */
  allowVolumeExpansion?: boolean
  /** 卷绑定模式 */
  volumeBindingMode?: VolumeBindingMode
  /** 限制由该 StorageClass 创建卷可使用的拓扑（节点、Zone 等） */
  allowedTopologies?: TopologySelectorTerm[]
}

/**
 * 拓扑选择器项
 */
export interface TopologySelectorTerm {
  /** 拓扑标签匹配表达式列表 */
  matchLabelExpressions?: TopologySelectorLabelRequirement[]
}

/**
 * 拓扑选择器标签匹配表达式
 */
export interface TopologySelectorLabelRequirement {
  /** 拓扑标签的 key，须为已知拓扑标签，如 topology.kubernetes.io/zone */
  key: string
  /** 匹配该 key 的拓扑标签值集合，如 ["zone1","zone2"] */
  values: string[]
}
