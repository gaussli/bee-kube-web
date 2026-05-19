/**
 * Kubernetes 通用请求类型定义
 * @module types/kubernetes/comomn
 */

/**
 * 元数据标签配置请求
 */
export interface MetadataLabelReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 元数据注解配置请求
 */
export interface MetadataAnnotationReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
