/**
 * 通用卷源相关实体类型定义
 * @module types/kubernetes/storage/volumesource/types
 */

import type { HostPathType } from '@/config/kubernetes/core'
import type { EmptyDirStorageMedium } from '@/config/kubernetes/pod'

import type { Quantity } from '../../types'

/**
 * 宿主机路径存储来源
 * 将宿主机上已存在的路径挂载为卷
 */
export interface HostPathVolumeSource {
  /** 宿主机上的目录或文件路径，若为软链接则跟随至真实路径 */
  path: string
  /** HostPath 类型，默认为空即不检查 */
  type?: HostPathType
}

/**
 * 与 Pod 生命周期一致的临时目录
 */
export interface EmptyDirVolumeSource {
  /** 存储介质类型，默认为空即使用节点默认介质 */
  medium?: EmptyDirStorageMedium
  /** 该 EmptyDir 卷所需的本地存储总量上限，默认未定义；内存介质下取该值与 Pod 内容器内存限制之和的较小值 */
  sizeLimit?: Quantity
}

/**
 * 节点本地存储来源，使用节点上的本地挂载路径。
 */
export interface LocalVolumeSource {
  /** 节点上的本地挂载路径 */
  path: string
  /** 文件系统类型，如 ext4 / xfs */
  fsType?: string
}

/**
 * 从 ConfigMap 填充的存储卷
 */
export interface ConfigMapVolumeSource {
  /** Pod 所在命名空间中引用的 ConfigMap 名称 */
  configMapName: string
  /** 将 ConfigMap 中的键映射到指定路径，未列出键不出现 */
  items?: KeyToPath[]
  /** 创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644 */
  defaultMode?: number
  /** ConfigMap 或其键是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 从 Secret 填充的存储卷
 */
export interface SecretVolumeSource {
  /** Pod 所在命名空间中引用的 Secret 名称 */
  secretName: string
  /** 将 Secret 中的键映射到指定路径，未列出键不出现 */
  items?: KeyToPath[]
  /** 创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644 */
  defaultMode?: number
  /** Secret 或其键是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 键到路径映射
 */
export interface KeyToPath {
  /** 要映射的键名 */
  key: string
  /** 映射到的相对文件路径，不能为绝对路径或以 .. 开头 */
  path: string
  /** 该文件的权限位，未指定时沿用 defaultMode，取值范围 0–511 */
  mode?: number
}

/**
 * 引用同命名空间下的 PVC
 */
export interface PersistentVolumeClaimVolumeSource {
  /** Pod 所在命名空间中引用的 PersistentVolumeClaim 名称 */
  claimName: string
  /** 是否以只读方式挂载，为 true 时强制 VolumeMounts 中的 ReadOnly 设置，默认 false */
  readOnly?: boolean
}

/**
 * 从 Git 仓库拉取的存储卷
 */
export interface GitRepoVolumeSource {
  /** 仓库地址 */
  repository: string
  /** 检出分支或标签，默认 master */
  revision?: string
  /** 检出后映射的目标目录，默认仓库根目录 */
  directory?: string
}

/**
 * 由外部 CSI 驱动处理的临时存储
 */
export interface CSIVolumeSource {
  /** 处理该卷的 CSI 驱动名称，需与集群中注册的名称一致 */
  driver: string
  /** 是否以只读方式挂载，默认 false（读写） */
  readOnly?: boolean
  /** 挂载的文件系统类型，如 "ext4"、"xfs"、"ntfs"，未指定时由 CSI 驱动决定默认文件系统 */
  fsType?: string
  /** 传递给 CSI 驱动的特定属性，具体取值参考对应驱动文档 */
  volumeAttributes?: Record<string, string>
  /** 引用包含敏感信息的 Secret 名称，用于完成 CSI NodePublishVolume 调用；可为空表示无需 Secret */
  nodePublishSecretName?: string
}

/**
 * CSIPersistentVolumeSource 表示由外部 CSI 卷驱动管理的存储。
 */
export interface CSIPersistentVolumeSource {
  /** CSI 驱动名称，必填 */
  driver: string
  /** CSI 卷插件 CreateVolume 返回的唯一卷名，用于后续所有调用，必填 */
  volumeHandle: string
  /** 传递给 ControllerPublishVolumeRequest 的只读标志，默认 false（读写） */
  readOnly?: boolean
  /** 挂载的文件系统类型，须为主机操作系统支持的类型，如 ext4 / xfs / ntfs */
  fsType?: string
  /** 要发布的卷属性键值对 */
  volumeAttributes?: Record<string, string>
  /** 传递给 CSI 驱动完成 ControllerPublishVolume / ControllerUnpublishVolume 调用的密钥引用 */
  controllerPublishSecretRef?: SecretReference
  /** 传递给 CSI 驱动完成 NodeStageVolume / NodeUnstageVolume 调用的密钥引用 */
  nodeStageSecretRef?: SecretReference
  /** 传递给 CSI 驱动完成 NodePublishVolume / NodeUnpublishVolume 调用的密钥引用 */
  nodePublishSecretRef?: SecretReference
  /** 传递给 CSI 驱动完成 ControllerExpandVolume 调用的密钥引用 */
  controllerExpandSecretRef?: SecretReference
  /** 传递给 CSI 驱动完成 NodeExpandVolume 调用的密钥引用 */
  nodeExpandSecretRef?: SecretReference
}

/**
 * SecretReference 表示对 Secret 的引用，包含在任何命名空间中检索该 Secret 所需的足够信息。
 */
export interface SecretReference {
  /** 命名空间内唯一的 Secret 资源名称 */
  name?: string
  /** Secret 名称须唯一的命名空间 */
  namespace?: string
}
