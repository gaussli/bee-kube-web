/**
 * ServiceAccount 资源实体类型定义
 * @module types/kubernetes/security/serviceaccount/types
 */

import type { LocalObjectReference, ObjectReference } from '@/types/kubernetes/types'

/**
 * ServiceAccount 实体
 * @description 将身份名称、可认证的委托人以及一组 secret 绑定在一起，供 Pod 使用
 */
export interface ServiceAccount {
  /** 同命名空间下 Pod 允许使用的 secret 引用列表 */
  secrets?: ObjectReference[]
  /** 同命名空间下用于拉取镜像的 secret 引用列表 */
  imagePullSecrets?: LocalObjectReference[]
  /** 是否自动为以该 ServiceAccount 运行的 Pod 挂载 API Token；可在 Pod 级别覆盖 */
  automountServiceAccountToken?: boolean
}
