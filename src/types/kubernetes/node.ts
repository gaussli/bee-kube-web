/**
 * 节点管理相关类型定义
 * @module types/kubernetes/node
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * 节点响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeResp extends BaseEntity {
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 所属集群ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 状态 */
  status: string
  /** 角色 */
  roles: string[]
  /** Kubernetes 版本 */
  version: string
  /** 操作系统 */
  os: string
  /** 系统架构 */
  architecture: string
  /** IP 地址 */
  ip: string
  /** CPU 核心数 */
  cpu: string
  /** 内存大小 */
  memory: string
  /** Pod 数量 */
  pods: string
  /** 已分配 CPU */
  allocatedCpu?: string
  /** 已分配内存 */
  allocatedMemory?: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可调度 */
  schedulable: boolean
}

/**
 * 节点查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface NodeQueryReq extends PageReq {
  /** 节点ID */
  id: string
  /** 节点名称（模糊匹配） */
  name: string
  /** IP 地址 */
  ip: string
  /** 状态 */
  status: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * 节点创建/更新请求参数
 */
export interface NodeReq {
  /** 节点ID */
  id: string
  /** 节点名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
}

/**
 * 节点调度控制请求
 * @description 用于设置节点是否可调度（cordon/uncordon）
 */
export interface NodeCordonReq {
  /** 是否不可调度 */
  cordon: boolean
}

/**
 * 节点标签配置请求
 */
export interface NodeLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * 节点注解配置请求
 */
export interface NodeAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Kubernetes 污点效果枚举
 */
export type TaintEffect = 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute'

/**
 * Kubernetes 污点配置
 */
export interface Taint {
  /** 键名 */
  key: string
  /** 值（可选） */
  value?: string
  /** 影响效果 */
  effect: TaintEffect
  /** 添加时间（可选） */
  timeAdded?: string
}

/**
 * 节点污点配置请求
 */
export interface NodeTaintsReq {
  /** 污点配置列表 */
  taints: Taint[]
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
