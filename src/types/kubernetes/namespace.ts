/**
 * 命名空间管理类型定义
 * @module types/kubernetes/namespace
 *
 * @remarks
 * 包含以下类型：
 *   NamespaceQueryForm                  - 查询请求参数
 *   NamespaceListVo                     - 列表对象响应
 *   NamespaceSimpleListVo               - 简要列表对象响应
 *   NamespaceDetailVo                   - 详情对象响应
 *     NamespaceDetailBasicVo            - 基础信息（name/description/status/type）
 *     NamespaceDetailMetadataVo         - 元数据（labels/annotations）
 *   NamespaceDetailConditionVo                - 状态条件
 *   NamespaceMonitorVo                  - 监控对象响应
 *   NamespaceEventVo                    - 事件对象响应
 *   NamespaceCreateForm                 - 创建请求表单
 *   NamespaceUpdateForm                 - 编辑请求表单
 *   NamespaceLabelForm                  - 标签更新请求表单
 *   NamespaceAnnotationForm             - 注解更新请求表单
 *   NamespaceQuotaDetailVo              - 配额详情对象响应
 *   NamespaceQuotaCreateForm            - 配额创建请求表单
 *   NamespaceQuotaUpdateForm            - 配额创建请求表单
 *   NamespaceResourceQuota              - 资源配额数据结构
 *   NamespaceLimitRange                 - 资源限制范围数据结构
 */

import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { NamespaceConditionType, NamespaceType } from '@/config/kubernetes/namespace'

import type { MetadataAnnotationForm, MetadataLabelForm } from './common'
import type { Clustered, Condition, Event, Metadata } from './types'

/**
 * 命名空间查询请求参数
 * @extends PageForm 继承分页表单
 */
export interface NamespaceQueryForm extends PageForm {
  /** 命名空间名称（支持模糊搜索） */
  name: string
  /** 状态 */
  status: string
  /** 命名空间类型 */
  type: NamespaceType
  /** 是否仅返回简要列表 */
  simple: boolean
}

/**
 * 命名空间列表对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface NamespaceListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
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
 * 命名空间简要列表对象响应数据
 * @extends UidEntity 继承 UID 类型
 */
export interface NamespaceSimpleListVo extends UidEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 命名空间类型 */
  type: NamespaceType
}

/**
 * 命名空间详情对象响应数据
 * 组合多个子对象，提供完整详情信息
 */
export interface NamespaceDetailVo {
  /** 基础信息 */
  basic: NamespaceDetailBasicVo
  /** 元数据信息（标签、注解） */
  metadata: NamespaceDetailMetadataVo
  conditions: NamespaceDetailConditionVo[]
}

/**
 * 命名空间基础信息响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface NamespaceDetailBasicVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  /** 命名空间名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: string
  /** 状态描述信息（如异常原因） */
  statusMsg?: string
  /** 命名空间类型 */
  type: NamespaceType
}

/**
 * 命名空间元数据响应数据
 * @extends Metadata 继承通用元数据类型
 */
export interface NamespaceDetailMetadataVo extends Metadata {}

/**
 * 命名空间条件响应数据
 * @extends Condition 继承 Kubernetes 条件类型
 */
export interface NamespaceDetailConditionVo extends Condition<NamespaceConditionType> {}

/**
 * 命名空间事件对象响应数据
 * @extends Event 继承 Kubernetes 事件类型
 */
export interface NamespaceEventVo extends Event {}

/**
 * 命名空间创建请求表单
 */
export interface NamespaceCreateForm {}

/**
 * 命名空间编辑请求表单
 */
export interface NamespaceUpdateForm {}

/**
 * 命名空间标签更新请求表单
 * @extends MetadataLabelForm 继承元数据标签表单
 */
export interface NamespaceLabelForm extends MetadataLabelForm {}

/**
 * 命名空间注解更新请求表单
 * @extends MetadataAnnotationForm 继承元数据注解表单
 */
export interface NamespaceAnnotationForm extends MetadataAnnotationForm {}

/**
 * 命名空间配额信息响应数据
 */
export interface NamespaceQuotaDetailVo {
  /** 资源配额 */
  resourceQuota?: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange?: NamespaceLimitRange
}

/**
 * 命名空间配额创建请求表单
 */
export interface NamespaceQuotaCreateForm {
  /** 资源配额 */
  resourceQuota?: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange?: NamespaceLimitRange
}

/**
 * 命名空间配额更新请求表单
 */
export interface NamespaceQuotaUpdateForm {
  /** 资源配额 */
  resourceQuota?: NamespaceResourceQuota
  /** 资源限制范围 */
  limitRange?: NamespaceLimitRange
}

/**
 * 命名空间资源配额数据结构
 */
export interface NamespaceResourceQuota {
  /** CPU 请求（单位：核） */
  requestsCpu?: string
  /** CPU 限制（单位：核） */
  limitsCpu?: string
  /** 内存请求（单位：Mi/Gi） */
  requestsMemory?: string
  /** 内存限制（单位：Mi/Gi） */
  limitsMemory?: string
  /** 存储请求（单位：Gi） */
  requestsStorage?: string
  /** Pod 数量限制 */
  countPods?: number
  /** 服务数量限制 */
  countServices?: number
  /** ConfigMap 数量限制 */
  countConfigMaps?: number
  /** Secret 数量限制 */
  countSecrets?: number
  /** PersistentVolumeClaim 数量限制 */
  countPersistentVolumeClaims?: number
}

/**
 * 命名空间资源限制范围数据结构
 */
export interface NamespaceLimitRange {
  /** 容器默认 CPU 请求 */
  defaultCpuRequest?: string
  /** 容器默认 CPU 限制 */
  defaultCpuLimit?: string
  /** 容器默认内存请求 */
  defaultMemoryRequest?: string
  /** 容器默认内存限制 */
  defaultMemoryLimit?: string
  /** 容器最小 CPU 请求 */
  minCpuRequest?: string
  /** 容器最大 CPU 请求 */
  maxCpuRequest?: string
  /** 容器最小内存请求 */
  minMemoryRequest?: string
  /** 容器最大内存请求 */
  maxMemoryRequest?: string
  /** 容器最大 CPU 限制 */
  maxCpuLimit?: string
  /** 容器最大内存限制 */
  maxMemoryLimit?: string
  /** 容器 CPU 请求与限制最大比率 */
  maxCpuRatio?: string
  /** 容器内存请求与限制最大比率 */
  maxMemoryRatio?: string
}
