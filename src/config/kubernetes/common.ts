/**
 * Kubernetes 通用常量配置（共享类型、证书等跨模块常量）
 * @module config/kubernetes/common
 */

/**
 * 状态配置项
 */
export interface StatusOption {
  /** 状态匹配值 */
  value: string | number | undefined
  /** 状态中文标签 */
  label: string
  /** 状态英文标签 */
  labelEn: string
  /** 状态指示色 */
  color: string
}

/** 资源页面元数据 */
export interface ResourcePageMeta {
  /** 图标名称 */
  icon: string
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description: string
}

/** 证书即将过期告警阈值（天） */
export const CERT_EXPIRE_WARNING_DAYS = 30
