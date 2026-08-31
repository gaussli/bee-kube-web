/**
 * 容器组（Pod）资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/pod/index
 */
import type { AuditEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/index'
import type { Clustered, Namespaced, ObjectMeta, Quantity } from '@/types/kubernetes/types'

import type { ResourceName } from '@/config/kubernetes/core'
import type { PodStatus } from '@/config/kubernetes/pod'

import type { PodSpec, PodStatusObj } from './types'

/**
 * 查询条件请求对象
 */
export interface PodQueryForm extends UidEntity, PageForm {
  /** 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** 状态 */
  status: PodStatus
  /** Pod IP */
  ip: string
}

/**
 * 列表项响应对象
 */
export interface PodListVo extends UidEntity, Clustered, Namespaced, AuditEntity {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: PodStatus
  /** 状态信息 */
  statusMsg?: string
  /** Pod IP */
  ip: string
  /** 重启次数 */
  restarts: number
  /** 所属 Node IP */
  nodeIp: string
  /** 所属 Node 名称 */
  nodeName: string
  /** 就绪容器数量 */
  readyContainerCount: number
  /** 容器总数 */
  containerCount: number
  /** Pod 资源 */
  resource: {
    request: Partial<Record<ResourceName, Quantity>>
    limit: Partial<Record<ResourceName, Quantity>>
    usage: Partial<Record<ResourceName, Quantity>>
  }
}

/**
 * 详情响应对象
 */
export interface PodDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, ObjectMeta {
  /** 描述 */
  description?: string
  /** 状态 */
  status: PodStatus
  /** 状态信息 */
  statusMsg?: string
  /** Spec */
  spec: PodSpec
  /** Status */
  statusObj: PodStatusObj
}

/**
 * YAML 响应对象
 */
export interface PodYamlVo {
  /** YAML 文本 */
  yaml: string
}

/**
 * 监控查询请求对象
 */
export interface PodMonitorQueryForm {}

/**
 * 监控响应对象
 */
export interface PodMonitorVo {}

/**
 * 导出查询条件请求对象
 */
export interface PodExportQueryForm extends ExportQueryForm, PodQueryForm {}
