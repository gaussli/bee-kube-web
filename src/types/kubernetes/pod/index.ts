/**
 * Pod 资源页面 ViewObject 及请求对象聚合
 * @module types/kubernetes/pod/index
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'
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
  ip: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * Pod 列表项响应对象
 */
export interface PodListVo extends UidEntity, Clustered, Namespaced, AuditEntity {
  /** Pod 名称 */
  name: string
  /** Pod IP */
  ip: string
  /** 状态 */
  status: PodStatus
  /** 状态描述信息 */
  statusMsg: string
  /** 重启次数 */
  restarts: number
  /** 所属节点 IP */
  nodeIp: string
  /** 所属节点名称 */
  nodeName: string
  /** 就绪容器数量 */
  readyContainerCount: number
  /** 容器总数 */
  containerCount: number
  /** Pod 资源 */
  resource: {
    request: Record<ResourceName, Quantity>
    limit: Record<ResourceName, Quantity>
    usage: Record<ResourceName, Quantity>
  }
}

export interface PodDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity, ObjectMeta {
  description?: string
  status: PodStatus
  statusMsg?: string
  spec: PodSpec
  statusObj: PodStatusObj
}

/** Pod YAML 响应对象 */
export interface PodYamlVo {
  /** Pod 完整 YAML 文本 */
  yaml: string
}
