/**
 * Kubernetes 原始类型定义
 * @module types/kubernetes/types
 */

/**
 * 基础原数据
 */
export interface Metadata {
  /** 标签，用于组织与筛选资源 */
  labels: Record<string, string>
  /** 注解，用于存储非查询类元数据 */
  annotations: Record<string, string>
}

/**
 * 资源类型元数据
 */
export interface KindMeta {
  /** 资源类型，REST 资源名称，驼峰命名，不可更新 */
  kind: string
  /** 资源版本，对象表示形式的版本化 schema */
  apiVersion: string
}

/**
 * 资源元数据
 * @extends Metadata 继承基础原数据（labels、annotations）
 */
export interface ObjectMeta extends Metadata {
  /** 资源名称，命名空间内唯一，创建后不可更新 */
  name: string
  /** 命名空间，名称在该空间内唯一，未指定时等效于 default */
  namespace: string
  /** 资源唯一标识，由服务端生成且不可变更 */
  uid: string
  /** 资源内部版本号，用于乐观并发与变更检测 */
  resourceVersion: string
  /** 期望状态的代次序号，由系统填充，只读 */
  generation: number
  /** 删除时间戳，发起优雅删除后由系统设置，只读 */
  deletionTimestamp: string
  /** 属主引用列表，用于垃圾回收与归属关系 */
  ownerReferences: string[]
  /** 终结器列表，阻止资源被删除直至处理完成 */
  finalizers: string[]
}

/**
 * 集群归属信息
 */
export interface Clustered {
  /** 所属集群的 UID */
  clusterUid: string
  /** 所属集群的名称 */
  cluster: string
}

/**
 * 命名空间归属信息
 */
export interface Namespaced {
  /** 所属命名空间的 UID */
  namespaceUid: string
  /** 所属命名空间的名称 */
  namespace: string
}

/**
 * 资源数量单位
 */
export type QuantityUnit = '' | 'm' | 'Ki' | 'Mi' | 'Gi' | 'Ti' | 'Pi' | 'Ei' | 'K' | 'M' | 'G' | 'T' | 'P' | 'E'

/**
 * 资源数量
 */
export interface Quantity {
  /** 资源数值，例如 0.5 */
  value: number
  /** 资源单位 */
  unit: QuantityUnit
}

/**
 * 事件原始类型（Event / EventType / EventInvolvedObject / EventSeries）
 * 定义统一迁移至 ./event/types，此处仅做再导出以保持兼容
 * @see ./event/types
 */
export type { Event, EventType, EventInvolvedObject, EventSeries } from './event/types'
