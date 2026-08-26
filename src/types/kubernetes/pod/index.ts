/**
 * Pod 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/pod/index
 */
import type { AuditEntity, ExportQueryForm, PageForm, UidEntity } from '@/types/common'
import type { Clustered, Namespaced, ObjectMeta, Quantity } from '@/types/kubernetes/types'

import type { ResourceName } from '@/config/kubernetes/core'
import type { PodStatus } from '@/config/kubernetes/pod'

import type { PodSpec, PodStatusObj } from './types'

/**
 * Pod 查询条件请求对象
 */
export interface PodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Namespace 名称 */
  namespace: string
  /** Pod 状态 */
  status: PodStatus
  /** Pod IP */
  ip: string
}

/**
 * Pod 列表项响应对象
 */
export interface PodListVo extends UidEntity, Clustered, Namespaced, AuditEntity {
  /** Pod 名称 */
  name: string
  /** Pod 描述 */
  description?: string
  /** Pod 状态 */
  status: PodStatus
  /** Pod 状态信息 */
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
 * Pod 详情响应对象
 */
export interface PodDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, ObjectMeta {
  /** Pod 描述 */
  description?: string
  /** Pod 状态 */
  status: PodStatus
  /** Pod 状态信息 */
  statusMsg?: string
  /** Pod Spec */
  spec: PodSpec
  /** Pod Status */
  statusObj: PodStatusObj
}

/**
 * Pod YAML 响应对象
 */
export interface PodYamlVo {
  /** Pod 完整 YAML 文本 */
  yaml: string
}

/**
 * Pod 监控查询请求对象
 */
export interface PodMonitorQueryForm {}

/**
 * Pod 监控响应对象
 */
export interface PodMonitorVo {}

/**
 * Pod 导出请求对象
 */
export interface PodExportQueryForm extends ExportQueryForm, PodQueryForm {}
