/**
 * Kubernetes 通用类型定义（元数据操作、资源用量等跨模块复用类型）
 * @module types/kubernetes/comomn
 */

/**
 * 元数据操作类型枚举
 * @remarks 用于标签、注解等元数据的增删改操作
 * - 1: 新增键值对（已存在的键将被忽略）
 * - 2: 移除键值对
 * - 3: 全量替换（传入的键值对将完全覆盖现有数据）
 */
type MetadataOperation = 1 | 2 | 3

/**
 * 元数据标签配置请求
 * @remarks 用于管理 Kubernetes 资源的 labels 元数据
 */
export interface MetadataLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作类型（1: 新增；2: 移除；3: 全量替换） */
  operation: MetadataOperation
}

/**
 * 元数据注解配置请求
 * @remarks 用于管理 Kubernetes 资源的 annotations 元数据
 */
export interface MetadataAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作类型（1: 新增；2: 移除；3: 全量替换） */
  operation: MetadataOperation
}

/**
 * 资源配额数据
 * @remarks 描述 CPU、内存、存储、Pod 四种资源的数值
 */
export interface ResourceQuota {
  /** CPU 核心数 */
  cpu: number
  /** 内存，单位 Byte */
  memory: number
  /** 存储，单位 Byte */
  storage: number
  /** Pod 数量 */
  pod: number
}

/**
 * 资源用量响应数据
 * @remarks 描述集群或节点的 CPU、内存、存储、Pod 等资源。capacity 为物理容量，allocation 为 Kubernetes 可分配容量（扣除操作系统等预留资源后），usage 为实际已用量
 */
export interface ResourceVo {
  /** 物理容量（节点/集群的总硬件资源） */
  capacity: ResourceQuota
  /** Kubernetes 可分配容量（物理容量减去操作系统等系统预留资源） */
  allocation: ResourceQuota
  /** 资源已用量 */
  usage: ResourceQuota
}
