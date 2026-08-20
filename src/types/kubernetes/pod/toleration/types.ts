/**
 * Pod 污点容忍相关实体类型定义
 * @module types/kubernetes/pod/toleration/types
 */

import type { TaintEffect } from '@/config/kubernetes/core'
import type { TolerationOperator } from '@/config/kubernetes/pod'

/**
 * 污点容忍
 */
export interface Toleration {
  /** 容忍所匹配的污点键，为空表示匹配所有污点键；此时 operator 必须为 'Exists'，表示匹配所有键与值 */
  key?: string
  /** 键与值的关系运算符，默认 'Equal' */
  operator?: TolerationOperator
  /** 容忍所匹配的污点值；operator 为 'Exists' 时应为空，否则为普通字符串 */
  value?: string
  /** 匹配的污点效果，为空表示匹配所有污点效果；指定时可选 'NoSchedule' / 'PreferNoSchedule' / 'NoExecute' */
  effect?: TaintEffect
  /** 容忍时长（秒），仅对 effect 为 'NoExecute' 的污点生效；未设置表示永久容忍（不驱逐），0 或负数按 0 处理（立即驱逐） */
  tolerationSeconds?: number
}
