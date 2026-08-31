/**
 * Kubernetes 工作负载（Workload）类型定义
 * @module types/kubernetes/workload/types
 */

import type { PodSpec } from '@/types/kubernetes/pod/types'
import type { Metadata } from '@/types/kubernetes/types'

/**
 * 历史版本
 */
export interface HistoryRevision {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
  /** 创建时间 */
  createAt: string
  /** 是否为当前活跃版本 */
  active: boolean
}

/**
 * Pod 模板规格
 */
export interface PodTemplateSpec {
  /** Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝 */
  metadata: Metadata
  /** Pod 的规格定义，描述容器的实际运行期望 */
  spec: PodSpec
}
