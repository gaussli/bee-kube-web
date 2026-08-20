/**
 * Kubernetes 通用类型定义（元数据操作、资源用量等跨模块复用类型）
 * @module types/kubernetes/common
 */

/**
 * 元数据标签配置请求
 * @remarks 用于管理 Kubernetes 资源的 labels 元数据
 */
export interface MetadataLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据） */
  operation: number
}

/**
 * 元数据注解配置请求
 * @remarks 用于管理 Kubernetes 资源的 annotations 元数据
 */
export interface MetadataAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据） */
  operation: number
}
