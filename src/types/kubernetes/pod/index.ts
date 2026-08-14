/**
 * Pod 资源相关类型定义
 * @module types/kubernetes/pod
 */
import type { AuditEntity, PageForm, UidEntity } from '@/types/common'

import type { PodStatus } from '@/config/kubernetes/pod'

import type { Clustered, ContainerResource, Metadata, Namespaced } from './types'

/**
 * Pod 查询表单
 * @extends PageForm 分页参数
 */
export interface PodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * Pod 列表响应数据
 * @extends Namespaced 继承命名空间类型（含 clusterUid, clusterName, namespace 等）
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
  /** CPU 使用率 */
  cpuUsage: string
  /** 内存使用率 */
  memoryUsage: string
}

export interface PodDetailVo extends UidEntity, Clustered, Namespaced, Metadata, ContainerResource, AuditEntity {
  name: string
  ip: string
  status: PodStatus
  statusMsg: string
  restarts: number
  nodeIp: string
  nodeName: string
}
