/**
 * Kubernetes 集群管理类型定义
 * @module types/kubernetes/cluster
 */
import type { BaseEntity, PageForm } from '@/types/common'
import type { ResourceResp } from '@/types/kubernetes/comomn'
import type { Event, EventSource, EventType, ObjectReference } from './types'

/**
 * 集群查询请求参数
 */
export interface ClusterQueryReq extends PageForm {
  /** 集群ID */
  id: string
  /** 集群名称 */
  name: string
  /** 集群状态 */
  status: number
}

/**
 * 集群列表响应数据
 */
export interface ClusterListResp extends BaseEntity {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** API Server 地址 */
  apiServer: string
  /** 集群状态 */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
}

/**
 * 集群详情响应数据
 */
export interface ClusterDetailResp extends BaseEntity {
  /** 集群名称 */
  name: string
  /** API Server 地址 */
  apiServer: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: number
  /** 集群状态描述 */
  statusMsg?: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** 证书过期时间 */
  certExpireAt: string
}

/**
 * 集群资源用量数据
 */
export interface ClusterResourceResp extends ResourceResp {}

/**
 * 集群事件响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 * @extends Event 继承事件基础类型（含 type, reason, message 等）
 */
export interface ClusterEventResp extends BaseEntity, Event {
  /** 事件类型（Normal: 正常事件；Warning: 警告事件） */
  type: EventType
  /** 事件原因 */
  reason: string
  /** 事件消息 */
  message: string
  /** 关联的资源对象 */
  involvedObject: ObjectReference
  /** 事件来源 */
  source: EventSource
  /** 事件发生次数 */
  count: number
  /** 首次发生时间 */
  firstTimestamp: string
  /** 最后发生时间 */
  lastTimestamp: string
}

/**
 * 集群事件查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface ClusterEventQueryReq extends PageForm {
  /** 事件类型 */
  type?: EventType
  /** 事件原因（模糊匹配） */
  reason?: string
  /** 关联资源名称（模糊匹配） */
  involvedObjectName?: string
  /** 关联资源类型 */
  involvedObjectKind?: string
}

/**
 * 集群创建/更新请求参数
 */
export interface ClusterReq {
  /** 集群ID */
  id: string
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description: string
  /** API Server 地址 */
  apiServer: string
  /** CA 证书 */
  ca: string
  /** 客户端 CA 证书 */
  clientCa: string
  /** 客户端私钥 */
  clientKey: string
  /** Kubeconfig 配置 */
  kubeconfig: string
}

/**
 * 集群注册请求参数（Agent 模式）
 */
export interface ClusterRegistrationReq {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description: string
  /** Kubeconfig 配置 */
  kubeconfig: string
  /** 集群标签 */
  labels: Record<string, string>
}
