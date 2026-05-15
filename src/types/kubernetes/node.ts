/**
 * 节点管理相关类型定义
 * @module types/node
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * 节点响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface NodeResp extends BaseEntity {
  /** 节点ID */
  id: string
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
  id: string
  name: string
  description: string
}

/**
 * 节点调度控制请求
 * @description 用于设置节点是否可调度（cordon/uncordon）
 */
export interface NodeCordonReq {
  cordon: boolean
}
