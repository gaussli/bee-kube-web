/**
 * 命名空间管理相关类型定义
 * @module types/kubernetes/namespace
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * 命名空间响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NamespaceResp extends BaseEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 所属集群ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 状态 */
  status: string
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
  /** 资源配额 */
  resourceQuota: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange: NamespaceLimitRange
  /** 是否可删除 */
  deletable: boolean
}

/**
 * 命名空间查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface NamespaceQueryReq extends PageReq {
  /** 命名空间ID */
  id: string
  /** 命名空间名称（模糊匹配） */
  name?: string
  /** 状态 */
  status?: string
}

/**
 * 命名空间创建/更新请求参数
 */
export interface NamespaceReq {
  /** 命名空间ID */
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
export interface NamespaceLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 命名空间注解更新请求
 */
export interface NamespaceAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 命名空间配额请求
 * @description 包含资源配额（ResourceQuota）和资源限制范围（LimitRange）
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
 * @description Kubernetes ResourceQuota 配置，限制命名空间内各类资源的总量
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
 * @description Kubernetes LimitRange 配置，支持容器、Pod、持久化存储卷限制
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
