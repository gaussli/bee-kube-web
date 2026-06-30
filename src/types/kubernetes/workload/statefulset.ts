/**
 * StatefulSet 资源相关类型定义
 * @module types/kubernetes/workload/statefulset
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { Container, VolumeClaimTemplate } from '../types'

/**
 * StatefulSet 状态枚举
 * @remarks
 * - Running: 运行中（所有 Pod 正常运行）
 * - Available: 部分就绪（至少一个副本可用，但未全部就绪）
 * - Stopped: 已停止（副本数缩容为 0）
 * - Creating: 创建中（正在创建 Pod）
 * - Updating: 更新中（正在执行滚动更新）
 * - Terminating: 终止中（正在删除）
 * - CreateTimeout: 创建超时（Pod 创建超时）
 * - UpdateTimeout: 更新超时（更新过程超时）
 * - Failed: 失败异常（创建或更新过程出现错误）
 * - Unknown: 未知状态
 */
export type StatefulSetStatus = 'Running' | 'Available' | 'Stopped' | 'Creating' | 'Updating' | 'Terminating' | 'CreateTimeout' | 'UpdateTimeout' | 'Failed' | 'Unknown'

/**
 * StatefulSet 条件类型枚举
 * - Available: StatefulSet 至少有一个可用副本
 * - Progressing: StatefulSet 正在处理中
 * - ReplicaFailure: StatefulSet 副本创建失败
 */
export type StatefulSetConditionType = 'Available' | 'Progressing' | 'ReplicaFailure'

/**
 * StatefulSet 更新策略枚举
 * - RollingUpdate: 滚动更新策略（按序逐个更新 Pod）
 * - OnDelete: 手动删除策略（仅当 Pod 被手动删除时才重建）
 */
export type StatefulSetUpdateStrategyType = 'RollingUpdate' | 'OnDelete'

/**
 * StatefulSet Pod 管理策略枚举
 * - OrderedReady: 按序就绪（按序号逐个启动和更新 Pod）
 * - Parallel: 并行管理（所有 Pod 并行启动和更新）
 */
export type PodManagementPolicyType = 'OrderedReady' | 'Parallel'

// ==================== 1. 列表对象 ====================

/**
 * StatefulSet 列表对象响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface StatefulSetListVo extends BaseEntity {
  /** Kubernetes UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** StatefulSet 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态描述信息 */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: StatefulSetUpdateStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 是否可删除 */
  deletable?: boolean
}

// ==================== 2. 详情对象 ====================

/**
 * StatefulSet 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface StatefulSetDetailVo extends BaseEntity {
  /** Kubernetes UID */
  uid: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属命名空间 */
  namespace: string
  /** StatefulSet 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态描述信息 */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: StatefulSetUpdateStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 容器配置列表 */
  containers: Container[]
  /** 存储模板 */
  volumeClaimTemplates?: VolumeClaimTemplate[]
}

// ==================== 3. 查询表单 ====================

/**
 * StatefulSet 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface StatefulSetQueryForm extends PageReq {
  /** StatefulSet ID（精确匹配） */
  id: string
  /** StatefulSet 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 集群 ID */
  clusterId: string
  /** 状态 */
  status: string
  /** 标签选择器 */
  labelSelector: string
}

// ==================== 4. 创建表单 ====================

/**
 * StatefulSet 创建请求参数
 */
export interface StatefulSetCreateForm {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: StatefulSetUpdateStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: Container[]
  /** 存储模板 */
  volumeClaimTemplates?: VolumeClaimTemplate[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 5. 编辑表单 ====================

/**
 * StatefulSet 编辑请求参数
 */
export interface StatefulSetUpdateForm {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: StatefulSetUpdateStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: Container[]
  /** 存储模板 */
  volumeClaimTemplates?: VolumeClaimTemplate[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 6. 标签表单 ====================

/**
 * StatefulSet 标签更新请求
 */
export interface StatefulSetLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 7. 注解表单 ====================

/**
 * StatefulSet 注解更新请求
 */
export interface StatefulSetAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 8. 其他表单对象（尾部） ====================

/**
 * StatefulSet 扩缩容请求
 */
export interface StatefulSetScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * StatefulSet YAML 导入请求
 * 通过 YAML 格式导入 StatefulSet 配置
 */
export interface StatefulSetYamlForm {
  /** YAML 配置内容 */
  yaml: string
}
