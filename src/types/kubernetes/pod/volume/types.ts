/**
 * Pod 卷相关实体类型定义
 * @module types/kubernetes/pod/volume/types
 */

import type {
  ConfigMapVolumeSource,
  CSIVolumeSource,
  EmptyDirVolumeSource,
  GitRepoVolumeSource,
  HostPathVolumeSource,
  PersistentVolumeClaimVolumeSource,
  SecretVolumeSource,
} from '@/types/kubernetes/storage/volumesource/types'

/**
 * 存储卷
 */
export interface Volume {
  /** 存储卷名称，须为 DNS_LABEL 且在 Pod 内唯一 */
  name: string
  /** 存储卷来源，定义挂载的位置与类型 */
  volumeSource: VolumeSource
}

/**
 * 存储卷来源
 */
export interface VolumeSource {
  /** 挂载宿主机上已存在的文件或目录 */
  hostPath?: HostPathVolumeSource
  /** 与 Pod 生命周期一致的临时目录 */
  emptyDir?: EmptyDirVolumeSource
  /** 从 ConfigMap 填充的存储卷 */
  configMap?: ConfigMapVolumeSource
  /** 从 Secret 填充的存储卷 */
  secret?: SecretVolumeSource
  /** 引用同命名空间下的 PVC */
  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource
  /** 从 Git 仓库拉取的存储卷 */
  gitRepo?: GitRepoVolumeSource
  /** 由外部 CSI 驱动处理的临时存储 */
  csi?: CSIVolumeSource
}
