/**
 * Kubernetes 通用常量配置（共享类型、证书等跨模块常量）
 * @module config/kubernetes/common
 */

import type { BeeType } from '..'

/** 资源页面元数据 */
export interface ResourcePageMeta {
  /** 图标名称 */
  icon: string
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description: string
}

/**
 * 配置项
 */
export interface Option {
  /** 状态匹配值 */
  value?: string | number
  /** 状态中文标签 */
  label: string
  /** 选项类型 */
  type?: BeeType
}

/** 证书即将过期告警阈值（天） */
export const CERT_EXPIRE_WARNING_DAYS = 30
