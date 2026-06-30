/**
 * Pod 资源相关类型定义
 * @module types/kubernetes/pod
 */
import type { BaseEntity } from '../common'

/** Pod 状态枚举 */
export type PodStatus = 'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'Unknown'

/**
 * Pod 列表响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface PodListVo extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Pod 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群 UID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName: string
  /** 命名空间 ID */
  namespaceId: string
  /** 命名空间 UID */
  namespaceUid: string
  /** 所属命名空间 */
  namespace: string
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
