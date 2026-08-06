/**
 * DaemonSet 资源相关类型定义
 * @module types/kubernetes/workload/daemonset
 */
import type { AuditEntity, PageForm } from '@/types/common'

import type { DaemonSetStatus, DaemonSetStrategyType } from '@/config/kubernetes/workload/daemonset'

export type {
  DaemonSetConditionType,
  DaemonSetStatus,
  DaemonSetStrategyType,
} from '@/config/kubernetes/workload/daemonset'

/**
 * DaemonSet 列表对象响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DaemonSetListResp extends AuditEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属命名空间 */
  namespace: string
  /** DaemonSet 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DaemonSetStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望调度节点数 */
  desiredNumberScheduled: number
  /** 就绪节点数 */
  numberReady: number
  /** 更新策略 */
  updateStrategy: DaemonSetStrategyType
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * DaemonSet 详情响应数据
 * @extends AuditEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface DaemonSetDetailResp extends AuditEntity {
  /** 资源 UID */
  uid: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属命名空间 */
  namespace: string
  /** DaemonSet 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DaemonSetStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望调度节点数 */
  desiredNumberScheduled: number
  /** 就绪节点数 */
  numberReady: number
  /** 更新策略 */
  updateStrategy: DaemonSetStrategyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 容器配置列表 */
  containers: DaemonSetContainer[]
}

/**
 * DaemonSet 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface DaemonSetQueryReq extends PageForm {
  /** DaemonSet ID（精确匹配） */
  id: string
  /** DaemonSet 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 集群 UID */
  clusterUid: string
  /** 状态 */
  status: string
}

/**
 * DaemonSet 创建/更新请求参数
 */
export interface DaemonSetReq {
  /** DaemonSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 更新策略 */
  updateStrategy: DaemonSetStrategyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: DaemonSetContainer[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * DaemonSet 标签更新请求
 */
export interface DaemonSetLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * DaemonSet 注解更新请求
 */
export interface DaemonSetAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * DaemonSet YAML 导入请求
 * 通过 YAML 格式导入 DaemonSet 配置
 */
export interface DaemonSetYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * DaemonSet 容器配置
 */
export interface DaemonSetContainer {
  /** 容器名称 */
  name: string
  /** 镜像 */
  image: string
  /** 镜像拉取策略 */
  imagePullPolicy?: string
  /** 资源请求 */
  resources?: {
    requests?: {
      cpu?: string
      memory?: string
    }
    limits?: {
      cpu?: string
      memory?: string
    }
  }
  /** 端口配置 */
  ports?: Array<{
    name: string
    containerPort: number
    protocol: string
  }>
  /** 环境变量 */
  env?: Array<{
    name: string
    value?: string
    valueFrom?: Record<string, unknown>
  }>
}
