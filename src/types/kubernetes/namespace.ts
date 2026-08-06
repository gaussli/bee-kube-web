/**
 * 命名空间管理相关类型定义
 * @module types/kubernetes/namespace
 */
import type { AuditEntity, PageForm } from '@/types/common'

import type { NamespaceConditionType, NamespaceType } from '@/config/kubernetes/namespace'

import type { MetadataAnnotationForm, MetadataLabelForm } from './comomn'
import type { Condition, Metadata } from './types'

export type { NamespaceConditionType, NamespaceStatus, NamespaceType } from '@/config/kubernetes/namespace'

/**
 * 命名空间响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NamespaceListResp extends AuditEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
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
}

/**
 * 命名空间详情响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NamespaceDetailResp extends AuditEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
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
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 资源配额 */
  resourceQuota?: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange?: NamespaceLimitRange
}

/**
 * 命名空间概览响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NamespaceOverviewResp extends AuditEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: string
  /** 命名空间类型 */
  type: NamespaceType
  /** 触发删除时间 */
  deletionTimestamp: string
  /** 条件列表 */
  conditions: Condition<NamespaceConditionType>[]
}

/**
 * 命名空间监控响应数据
 */
export interface NamespaceMonitorResp {
  /** TODO: Pod 使用数量 */
  podUsage: number
  /** TODO: Deployment 使用数量 */
  deploymentUsage: number
  /** TODO: StatefulSet 使用数量 */
  statefulSetUsage: number
  /** TODO: DaemonSet 使用数量 */
  daemonSetUsage: number
  /** TODO: Service 使用数量 */
  serviceUsage: number
}

/**
 * 命名空间配额响应数据
 */
export interface NamespaceQuotaResp {
  /** 资源配额 */
  resourceQuota: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange: NamespaceLimitRange
}

/**
 * 命名空间元数据响应数据
 * @extends Metadata 继承元数据类型
 */
export interface NamespaceMetadataResp extends Metadata {}

/**
 * 命名空间事件响应数据
 */
export interface NamespaceEventResp extends Event {}

/**
 * 命名空间查询模式枚举
 * - normal: 标准分页查询，返回完整字段
 * - simple: 简化查询，不分页，仅返回 id、uid、name
 */
export type NamespaceMode = 'normal' | 'simple'

/**
 * 命名空间简化响应数据
 */
export interface NamespaceSimpleListResp {
  /** 资源 ID */
  id: string
  /** 资源 UID */
  uid: string
  /** 命名空间名称 */
  name: string
}

/**
 * 命名空间查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface NamespaceQueryReq extends PageForm {
  /** 命名空间ID */
  id: string
  /** 命名空间名称（模糊匹配） */
  name: string
  /** 状态 */
  status: string
  /** 查询模式：normal-标准分页 / simple-不分页仅返回 id/uid/name */
  mode?: NamespaceMode
}

/**
 * 命名空间创建/更新请求参数
 */
export interface NamespaceReq {
  /** 命名空间 ID */
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

/**
 * 命名空间标签更新请求
 */
export interface NamespaceLabelsReq extends MetadataLabelForm {}

/**
 * 命名空间注解更新请求
 */
export interface NamespaceAnnotationsReq extends MetadataAnnotationForm {}

/**
 * 命名空间配额请求
 */
export interface NamespaceQuotaReq {
  /** 资源配额 */
  resouceQuota: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange: NamespaceLimitRange
}

/**
 * 命名空间导入请求
 */
export interface NamespaceImportReq {
  /** YAML 配置内容 */
  yaml: string
}

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
 * 资源限制范围
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
