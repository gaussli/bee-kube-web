/**
 * Kubernetes 原始类型定义
 * @module types/kubernetes/types
 */

import type { HostPathType, LabelSelectorOperator } from '@/config/kubernetes/core'

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
 * 集群对象的引用
 * 描述事件或关联所指向的资源对象（如 Pod、Deployment）
 */
export interface ObjectReference {
  /** 被引用对象的类型（Kind），如 Pod、Deployment、StatefulSet */
  kind?: string
  /** 被引用对象所属命名空间 */
  namespace?: string
  /** 被引用对象的名称 */
  name?: string
  /** 被引用对象的 UID */
  uid?: string
  /** 被引用对象的 API 版本，如 v1、apps/v1 */
  apiVersion?: string
  /** 被引用对象的具体资源版本，通常不参与实际匹配 */
  resourceVersion?: string
  /** 指向对象内某个子字段的 JSON/Go 字段访问语句，如 spec.containers[2] */
  fieldPath?: string
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
 * 资源条件（泛型，T 为条件类型枚举）
 * 描述资源在某时刻的可观测状态条件
 */
export interface Condition<T extends string = string> {
  /** 条件类型 */
  type: T
  /** 条件状态，取值 True / False / Unknown */
  status: string
  /** 最近探测时间（ISO 时间） */
  lastProbeTime?: string
  /** 最近一次状态转移时间（ISO 时间） */
  lastTransitionTime?: string
  /** 状态转移原因（机器可读短字符串） */
  reason?: string
  /** 状态转移的可读说明 */
  message?: string
}

/**
 * 标签表达式匹配项
 * 用于 LabelSelector.matchExpressions，描述单条标签匹配规则
 */
export interface LabelSelectorRequirement {
  /** 标签键 */
  key: string
  /** 标签表达式运算符，In/NotIn 需配合 values */
  operator: LabelSelectorOperator
  /** 匹配值列表，operator 为 Exists / DoesNotExist 时忽略 */
  values?: string[]
}

/**
 * 标签选择器
 * 通过标签匹配一组资源对象，支持精确标签与表达式两种匹配方式（逻辑与关系）
 */
export interface LabelSelector {
  /** 键值对，资源须同时具备所有标签且值相等才匹配 */
  matchLabels?: Record<string, string>
  /** 标签表达式匹配列表，与 matchLabels 取逻辑与 */
  matchExpressions?: LabelSelectorRequirement[]
}

/**
 * 同命名空间内类型化对象引用
 * 指向数据源或后端等目标对象
 */
export interface TypedLocalObjectReference {
  /** 被引用对象所属 API 组；不指定时 Kind 须属于 core API 组；第三方类型必填 */
  apiGroup?: string
  /** 被引用对象的类型（Kind） */
  kind: string
  /** 被引用对象的名称 */
  name: string
}

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
 * NFS 网络存储来源
 * 挂载 NFS 服务器导出的路径
 */
export interface NFSVolumeSource {
  /** NFS 服务器地址或主机名 */
  server: string
  /** NFS 服务器导出的路径 */
  path: string
  /** 是否只读挂载，默认 false */
  readOnly?: boolean
}
