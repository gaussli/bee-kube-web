/**
 * 命名空间管理类型定义
 * @module types/kubernetes/namespace
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { NamespaceConditionType, NamespaceType } from '@/config/kubernetes/namespace'

import type { MetadataAnnotationForm, MetadataLabelForm } from './comomn'
import type { Condition, Metadata } from './types'

export type { NamespaceConditionType, NamespaceStatus, NamespaceType } from '@/config/kubernetes/namespace'

/**
 * 命名空间查询模式枚举
 * - normal: 标准分页查询，返回完整字段
 * - simple: 简化查询，不分页，仅返回 id、uid、name
 */
export type NamespaceMode = 'normal' | 'simple'

// ============================================================
// 1. 查询表单
// ============================================================

/**
 * 命名空间查询请求参数
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface NamespaceQueryForm extends UidEntity, PageForm {
  /** 命名空间名称（模糊匹配） */
  name: string
  /** 状态 */
  status: string
  /** 查询模式：normal-标准分页 / simple-不分页仅返回 id/uid/name */
  mode?: NamespaceMode
}

// ============================================================
// 2. 列表对象
// ============================================================

/**
 * 命名空间列表对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface NamespaceListVo extends UidEntity, AuditEntity, DeletableEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: string
  /** 状态描述信息 */
  statusMsg?: string
  /** 命名空间类型 */
  type: NamespaceType
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
}

// ============================================================
// 3. 简化列表对象
// ============================================================

/**
 * 命名空间简化列表对象响应数据
 * @remarks 不分页，仅返回 id、uid、name
 */
export interface NamespaceSimpleListVo {
  /** 资源 ID */
  id: string
  /** 资源 UID */
  uid: string
  /** 命名空间名称 */
  name: string
}

// ============================================================
// 4. 详情对象
// ============================================================

/**
 * 命名空间详情对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface NamespaceDetailVo extends UidEntity, AuditEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: string
  /** 状态描述信息 */
  statusMsg?: string
  /** 命名空间类型 */
  type: NamespaceType
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 资源配额 */
  resourceQuota?: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange?: NamespaceLimitRange
}

// ============================================================
// 5. 创建表单
// ============================================================

/**
 * 命名空间创建表单
 */
export interface NamespaceCreateForm {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
}

// ============================================================
// 6. 更新表单
// ============================================================

/**
 * 命名空间更新表单
 */
export interface NamespaceUpdateForm {
  /** 资源 ID */
  id: string
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
}

// ============================================================
// 7. 其他对象
// ============================================================

/**
 * 命名空间概览对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface NamespaceOverviewVo extends UidEntity, AuditEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: string
  /** 命名空间类型 */
  type: NamespaceType
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 触发删除时间 */
  deletionTimestamp: string
  /** 条件列表 */
  conditions: Condition<NamespaceConditionType>[]
}

/**
 * 命名空间监控对象响应数据
 */
export interface NamespaceMonitorVo {
  /** Pod 使用数量 */
  podUsage: number
  /** Deployment 使用数量 */
  deploymentUsage: number
  /** StatefulSet 使用数量 */
  statefulSetUsage: number
  /** DaemonSet 使用数量 */
  daemonSetUsage: number
  /** Service 使用数量 */
  serviceUsage: number
}

/**
 * 命名空间配额对象响应数据
 */
export interface NamespaceQuotaVo {
  /** 资源配额 */
  resourceQuota: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange: NamespaceLimitRange
}

/**
 * 命名空间元数据对象响应数据
 * @extends Metadata 继承元数据类型
 */
export interface NamespaceMetadataVo extends Metadata {}

/**
 * 命名空间事件对象响应数据
 */
export interface NamespaceEventVo extends Event {}

// ============================================================
// 7.1 请求表单
// ============================================================

/**
 * 命名空间标签更新表单
 * @extends MetadataLabelForm 继承元数据标签表单
 */
export interface NamespaceLabelsForm extends MetadataLabelForm {}

/**
 * 命名空间注解更新表单
 * @extends MetadataAnnotationForm 继承元数据注解表单
 */
export interface NamespaceAnnotationsForm extends MetadataAnnotationForm {}

/**
 * 命名空间配额表单
 */
export interface NamespaceQuotaForm {
  /** 资源配额 */
  resourceQuota: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange: NamespaceLimitRange
}

/**
 * 命名空间导入表单
 */
export interface NamespaceImportForm {
  /** YAML 配置内容 */
  yaml: string
}

// ============================================================
// 7.2 数据结构
// ============================================================

/**
 * 命名空间资源配额
 */
export interface NamespaceResourceQuota {
  /** CPU 请求限制 */
  requestsCpu: number
  /** 内存请求限制 */
  requestsMemory: string
  /** CPU 上限 */
  limitsCpu: number
  /** 内存上限 */
  limitsMemory: string
  /** 持久化存储卷声明数量 */
  persistentvolumeclaims: number
  /** LoadBalancer 类型服务数量 */
  servicesLoadbalancers: number
  /** Deployment 数量上限 */
  countDeploymentsApps: number
  /** Pod 数量上限 */
  countPods: number
}

/**
 * 命名空间资源限制范围
 */
export interface NamespaceLimitRange {
  /** 容器资源限制 */
  container?: {
    /** CPU 默认上限 */
    defaultCpu?: number
    /** 内存默认上限 */
    defaultMemory?: number
    /** CPU 默认请求 */
    defaultRequestCpu?: number
    /** 内存默认请求 */
    defaultRequestMemory?: number
    /** CPU 上限 */
    maxCpu?: number
    /** 内存上限 */
    maxMemory?: number
    /** CPU 下限 */
    minCpu?: number
    /** 内存下限 */
    minMemory?: number
    /** CPU 的 limit/request 最大比率 */
    maxLimitRequestRatioCpu?: number
    /** 内存的 limit/request 最大比率 */
    maxLimitRequestRatioMemory?: number
  }
  /** Pod 资源限制 */
  pod?: {
    /** CPU 上限 */
    maxCpu?: number
    /** 内存上限 */
    maxMemory?: number
    /** CPU 下限 */
    minCpu?: number
    /** 内存下限 */
    minMemory?: number
  }
  /** 持久化存储卷限制 */
  persistentvolumeclaim?: {
    /** 最小存储大小 */
    min?: string
    /** 最大存储大小 */
    max?: string
  }
}
